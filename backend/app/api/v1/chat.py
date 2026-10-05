import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.rag import ChatRequest, ChatResponse, HealthResponse
from backend.app.services.rag_service import RAGService, get_rag_service

from starlette.concurrency import run_in_threadpool
from backend.app.core.timing import StageTimer

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse, summary="Submit legal query to RAG pipeline")
async def rag_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    RAG Chat endpoint:
    1. Retrieves relevant legal chunks using hybrid search (Chroma + PostgreSQL FTS).
    2. Reranks evidence chunks with cross-encoder.
    3. Prompts Gemini with grounded evidence.
    4. Returns plain language legal answer with structured sources.
    Offloaded to worker threadpool to avoid blocking FastAPI event loop.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Legal query cannot be empty."
        )

    timer = StageTimer("chat_endpoint")
    try:
        response = await run_in_threadpool(
            rag_service.process_chat,
            query=request.query,
            conversation_id=request.conversation_id,
            db=db,
            explain_mode=request.explain_mode,
            timer=timer
        )
        timer.finish(log_output=True)
        return response
    except Exception as e:
        logger.error(f"Error processing RAG chat request: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the legal query. Please check server logs."
        )


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
