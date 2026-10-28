import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from backend.app.core.database import get_db
from backend.app.schemas.rag import ChatRequest, ChatResponse, HealthResponse
from backend.app.services.rag_service import RAGService, get_rag_service
from backend.app.core.timing import StageTimer
from backend.app.core.telemetry import get_trace_collector, PipelineTrace
from backend.app.api.v1.auth import decode_token

logger = logging.getLogger(__name__)

router = APIRouter()



@router.post("/chat", response_model=ChatResponse, summary="Submit legal query to RAG pipeline")
async def rag_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    rag_service: RAGService = Depends(get_rag_service),
    authorization: Optional[str] = Header(None)
):
    """
    RAG Chat endpoint:
    1. Retrieves relevant legal chunks using hybrid search (Chroma + PostgreSQL FTS).
    2. Reranks evidence chunks with cross-encoder.
    3. Prompts Gemini with grounded evidence.
    4. Returns plain language legal answer with structured sources.
    Offloaded to worker threadpool to avoid blocking FastAPI event loop.
    Fully instrumented for real-time telemetry trace observability.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Legal query cannot be empty."
        )

    # Initialize or correlate trace_id
    trace_id = request.trace_id or f"trace_{uuid.uuid4().hex[:12]}"
    collector = get_trace_collector()

    # Identify user (if authenticated)
    user_id = None
    if authorization:
        user = decode_token(authorization, db)
        if user:
            user_id = user.id

    collector.init_trace(trace_id=trace_id, conversation_id=request.conversation_id, user_id=user_id)

    # Stage 1: Request Validation & Reception
    collector.start_stage(trace_id, "request_received", "Validating legal query payload")
    collector.end_stage(
        trace_id,
        "request_received",
        technical_details={
            "query_length_chars": len(request.query),
            "explain_mode": request.explain_mode or "simple",
            "has_conversation_id": bool(request.conversation_id)
        },
        status_msg="Query verified and validated"
    )

    # Stage 2: Session & Context Resolution
    collector.start_stage(trace_id, "session_context", "Resolving session parameters and user scope")
    collector.end_stage(
        trace_id,
        "session_context",
        technical_details={
            "conversation_id": request.conversation_id or "new",
            "authenticated": user_id is not None,
            "explain_mode": request.explain_mode or "simple"
        },
        status_msg="Session context resolved"
    )

    timer = StageTimer("chat_endpoint")
    try:
        response = await run_in_threadpool(
            rag_service.process_chat,
            query=request.query,
            conversation_id=request.conversation_id,
            db=db,
            explain_mode=request.explain_mode,
            timer=timer,
            trace_id=trace_id
        )
        timer.finish(log_output=True)
        response.trace_id = trace_id
        return response
    except Exception as e:
        logger.error(f"Error processing RAG chat request: {e}", exc_info=True)
        collector.complete_trace(trace_id, failed=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the legal query. Please check server logs."
        )


@router.get("/trace/{trace_id}", response_model=PipelineTrace, summary="Get telemetry trace for a RAG request")
def get_rag_trace(
    trace_id: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Returns real-time or historical telemetry execution stages for a specific RAG request.
    Enforces user ownership if the trace was created by an authenticated user.
    """
    collector = get_trace_collector()
    trace = collector.get_trace(trace_id)
    if not trace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telemetry trace '{trace_id}' not found or expired."
        )

    # If trace was linked to an authenticated user, verify requester matches
    if trace.user_id:
        requester = decode_token(authorization, db) if authorization else None
        if not requester or requester.id != trace.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this telemetry trace."
            )

    return trace


@router.get("/daily-law", summary="Featured daily law from the Indian legal corpus")
def get_daily_law():
    """
    Returns today's featured legal provision or case analysis from the Indian legal corpus.
    """
    return {
        "id": "daily-bnss-35",
        "title": "Right to Know Grounds of Arrest & Legal Aid",
        "category": "Criminal Procedure & Constitutional Rights",
        "section": "Section 35 & 47, Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "summary": "Under Section 35 and Section 47 of the BNSS, every police officer making an arrest without a warrant is statutorily mandated to inform the arrested person forthwith of the full particulars of the offence and the grounds for arrest. Furthermore, where an offence is bailable, the officer must inform the person of their entitlement to be released on bail and provide access to legal counsel.",
        "practicalTip": "Always ask the arresting officer for a signed arrest memo specifying the date, exact time, and grounds of arrest, and request that a designated family member or friend be immediately informed.",
        "relatedArticles": ["Article 22(1), Constitution of India", "Section 173, BNSS 2023", "D.K. Basu v. State of West Bengal"]
    }


@router.get("/health", response_model=HealthResponse, summary="Check RAG components health")
def rag_health(
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Health check endpoint verifying:
    - API operational
    - PostgreSQL database reachability
    - ChromaDB reachability
    - Embedding model configuration
    - Gemini LLM configuration
    """
    try:
        return rag_service.get_health_status()
    except Exception as e:
        logger.error(f"Error checking RAG health: {e}", exc_info=True)
        return HealthResponse(
            status="error",
            database_connected=False,
            chroma_connected=False,
            embedding_model_loaded=False,
            gemini_configured=False,
            details={"error": str(e)}
        )
