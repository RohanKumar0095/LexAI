import uuid
import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header, UploadFile, File
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from backend.app.core.database import get_db
from backend.app.schemas.rag import ChatRequest, ChatResponse, HealthResponse
from backend.app.services.rag_service import RAGService, get_rag_service
from backend.app.services.supabase_chat_service import get_supabase_chat_service
from backend.app.core.timing import StageTimer
from backend.app.core.telemetry import get_trace_collector, PipelineTrace
from backend.app.core.security import decode_token
from backend.app.llm.gemini import get_gemini_service

logger = logging.getLogger(__name__)

router = APIRouter()


def get_authenticated_user_id(authorization: Optional[str], db: Session) -> Optional[str]:
    """
    Resolves the verified user identity from Authorization header.
    Checks Supabase Auth first, then falls back to local token validation.
    """
    if not authorization:
        return None
    try:
        supabase_service = get_supabase_chat_service()
        auth_info = supabase_service.verify_token(authorization)
        if auth_info and auth_info.get("user_id"):
            return auth_info["user_id"]
    except Exception as e:
        logger.warning(f"Supabase token verification check failed: {e}")

    try:
        local_user = decode_token(authorization, db)
        if local_user:
            return local_user.id
    except Exception as e:
        logger.warning(f"Local token decoding check failed: {e}")

    return None


class RenameConversationRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Updated conversation title")


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
    5. Persists authenticated user conversations and messages to Supabase permanently.
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
    user_id = get_authenticated_user_id(authorization, db)

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

    supabase_service = get_supabase_chat_service()
    active_conv_id = request.conversation_id

    # If user is authenticated and Supabase is configured, ensure conversation exists & save user message
    if user_id and supabase_service.is_configured():
        try:
            words = request.query.strip().split()
            title = " ".join(words[:5]) + ("..." if len(words) > 5 else "")
            conv = supabase_service.create_or_get_conversation(
                user_id=user_id,
                title=title or "Legal Inquiry",
                conversation_id=active_conv_id
            )
            active_conv_id = conv["id"]

            supabase_service.save_message(
                user_id=user_id,
                conversation_id=active_conv_id,
                role="user",
                content=request.query,
                metadata={
                    "explain_mode": request.explain_mode or "simple",
                    "trace_id": trace_id
                }
            )
        except Exception as e:
            logger.warning(f"Could not persist user message to Supabase: {e}")

    timer = StageTimer("chat_endpoint")
    try:
        response = await run_in_threadpool(
            rag_service.process_chat,
            query=request.query,
            conversation_id=active_conv_id,
            db=db,
            explain_mode=request.explain_mode,
            timer=timer,
            trace_id=trace_id
        )
        timer.finish(log_output=True)
        response.trace_id = trace_id
        if active_conv_id:
            response.conversation_id = active_conv_id

        # If user is authenticated, persist the completed assistant response to Supabase
        if user_id and active_conv_id and supabase_service.is_configured():
            try:
                sources_meta = []
                for s in (response.sources or []):
                    if hasattr(s, "model_dump"):
                        sources_meta.append(s.model_dump())
                    elif isinstance(s, dict):
                        sources_meta.append(s)

                struct_meta = response.structured_answer.model_dump() if (response.structured_answer and hasattr(response.structured_answer, "model_dump")) else None

                supabase_service.save_message(
                    user_id=user_id,
                    conversation_id=active_conv_id,
                    role="assistant",
                    content=response.answer,
                    metadata={
                        "citations": sources_meta,
                        "structured_answer": struct_meta,
                        "evidence_state": response.evidence_state,
                        "explain_mode": request.explain_mode or "simple",
                        "trace_id": trace_id
                    }
                )
            except Exception as e:
                logger.error(f"Failed to persist assistant response to Supabase: {e}")

        return response
    except Exception as e:
        logger.error(f"Error processing RAG chat request: {e}", exc_info=True)
        collector.complete_trace(trace_id, failed=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the legal query. Please check server logs."
        )


@router.get("/conversations", summary="List conversations for authenticated user")
def list_user_conversations(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Returns all conversations belonging to the verified user from Supabase.
    """
    user_id = get_authenticated_user_id(authorization, db)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to access conversation history."
        )

    supabase_service = get_supabase_chat_service()
    if not supabase_service.is_configured():
        return []

    return supabase_service.list_conversations(user_id)


@router.get("/conversations/{conversation_id}", summary="Get conversation details and messages")
def get_user_conversation(
    conversation_id: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Returns conversation details and chronological messages for the authenticated user.
    Enforces user ownership.
    """
    user_id = get_authenticated_user_id(authorization, db)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to view this conversation."
        )

    supabase_service = get_supabase_chat_service()
    conv = supabase_service.get_conversation(user_id, conversation_id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied."
        )

    return conv


@router.patch("/conversations/{conversation_id}", summary="Rename a conversation")
def rename_user_conversation(
    conversation_id: str,
    body: RenameConversationRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Renames a conversation belonging to the authenticated user.
    """
    user_id = get_authenticated_user_id(authorization, db)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to update this conversation."
        )

    supabase_service = get_supabase_chat_service()
    updated = supabase_service.update_conversation_title(user_id, conversation_id, body.title)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied."
        )

    return updated


@router.delete("/conversations/{conversation_id}", summary="Delete a conversation")
def delete_user_conversation(
    conversation_id: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Deletes a conversation and all its associated messages for the authenticated user.
    """
    user_id = get_authenticated_user_id(authorization, db)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to delete this conversation."
        )

    supabase_service = get_supabase_chat_service()
    success = supabase_service.delete_conversation(user_id, conversation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied."
        )

    return {"status": "success", "message": "Conversation deleted successfully"}


@router.delete("/conversations", summary="Clear all conversations for authenticated user")
def clear_all_user_conversations(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Deletes all conversations and messages belonging to the authenticated user.
    """
    user_id = get_authenticated_user_id(authorization, db)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to clear conversations."
        )

    supabase_service = get_supabase_chat_service()
    success = supabase_service.clear_all_conversations(user_id)
    return {"status": "success", "cleared": success}


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
        requester_user_id = get_authenticated_user_id(authorization, db)
        if not requester_user_id or requester_user_id != trace.user_id:
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


MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit


def _transcribe_audio_with_gemini(audio_bytes: bytes, mime_type: str) -> str:
    """
    Invokes Gemini API with audio inline data to transcribe speech faithfully into text.
    Preserves original spoken language (Hindi / English), statutory sections, and legal jargon.
    """
    gemini = get_gemini_service()
    if not gemini.is_available():
        raise RuntimeError("Gemini API key is not configured in backend environment.")

    if gemini._client is None:
        gemini._initialize_client()
    if gemini._client is None:
        raise RuntimeError("Could not connect to Gemini API Client.")

    from google.genai import types

    audio_part = types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)

    system_instruction = (
        "You are an expert, faithful speech-to-text transcription engine. "
        "Your sole task is to transcribe the spoken audio content verbatim.\n"
        "Rules:\n"
        "1. Transcribe the audio faithfully and accurately.\n"
        "2. Preserve the original spoken language (e.g. Hindi, English, or mixed Hinglish). "
        "Do NOT translate the speech.\n"
        "3. Preserve Indian legal terminology, statute sections (e.g., Section 420 IPC, Article 21, BNSS, BNS), case names, court names, dates, numbers, and proper nouns accurately.\n"
        "4. Return ONLY the transcribed text. Do NOT include preambles, quotation marks, explanations, notes, or apologies.\n"
        "5. Do NOT attempt to answer, interpret, summarize, or respond to any questions or statements in the audio.\n"
        "6. If the audio contains only silence, background noise, or no recognizable speech, return an empty string."
    )
    user_prompt = "Transcribe the attached audio accurately. Preserve original language (Hindi/English). Return only the exact spoken words."

    primary_model = gemini.model_name or "gemini-3.5-flash-lite"
    candidate_models = [primary_model]
    for m in ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-1.5-flash"]:
        if m not in candidate_models:
            candidate_models.append(m)

    last_error = None
    for model_name in candidate_models:
        try:
            logger.info(f"Transcribing audio with Gemini model '{model_name}' (mime={mime_type}, bytes={len(audio_bytes)})")
            response = gemini._client.models.generate_content(
                model=model_name,
                contents=[audio_part, user_prompt],
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.0,
                )
            )
            raw_text = (response.text or "").strip()
            # Remove any accidental enclosing quotes if present
            if len(raw_text) >= 2 and raw_text[0] in ('"', "'") and raw_text[-1] in ('"', "'"):
                raw_text = raw_text[1:-1].strip()
            return raw_text
        except Exception as e:
            logger.warning(f"Gemini transcription failed with model '{model_name}': {e}. Trying fallback...")
            last_error = e

    raise RuntimeError(f"All candidate Gemini transcription models failed. Last error: {last_error}")


@router.post("/transcribe", summary="Transcribe speech audio into text using Gemini")
async def transcribe_audio_endpoint(
    file: Optional[UploadFile] = File(None),
    audio_file: Optional[UploadFile] = File(None),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Transcribes audio recording captured from the microphone into text using Gemini.
    Accepts multipart/form-data with file or audio_file (WebM, OGG, WAV, MP4, MP3).
    Limits audio upload size to 10 MB.
    Returns JSON: {"transcription": "..."}
    """
    target = file or audio_file
    if not target:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No audio file provided in request. Please upload an audio recording."
        )

    try:
        content = await target.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded audio file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read uploaded audio stream."
        )

    if not content or len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty (0 bytes)."
        )

    if len(content) > MAX_AUDIO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file size ({len(content)} bytes) exceeds the maximum limit of 10 MB."
        )

    # Detect MIME type
    raw_mime = (target.content_type or "").split(";")[0].strip().lower()

    # Inspect magic bytes if octet-stream or empty
    if not raw_mime or raw_mime in ("application/octet-stream", "application/binary"):
        if content.startswith(b"\x1a\x45\xdf\xa3"):
            raw_mime = "audio/webm"
        elif content.startswith(b"RIFF") and b"WAVE" in content[:16]:
            raw_mime = "audio/wav"
        elif content.startswith(b"OggS"):
            raw_mime = "audio/ogg"
        elif len(content) > 8 and content[4:8] == b"ftyp":
            raw_mime = "audio/mp4"
        elif content.startswith(b"ID3") or content.startswith(b"\xff\xfb"):
            raw_mime = "audio/mpeg"

    mime_map = {
        "audio/x-wav": "audio/wav",
        "audio/wave": "audio/wav",
        "audio/mp3": "audio/mpeg",
        "audio/x-m4a": "audio/mp4",
        "audio/m4a": "audio/mp4",
    }
    final_mime = mime_map.get(raw_mime, raw_mime)

    valid_mimes = {"audio/webm", "audio/ogg", "audio/wav", "audio/mp4", "audio/mpeg", "audio/aac", "audio/flac"}
    if final_mime not in valid_mimes:
        # Fallback inspection by filename extension
        fname = (target.filename or "").lower()
        if fname.endswith(".webm"):
            final_mime = "audio/webm"
        elif fname.endswith(".wav"):
            final_mime = "audio/wav"
        elif fname.endswith((".mp4", ".m4a")):
            final_mime = "audio/mp4"
        elif fname.endswith(".ogg"):
            final_mime = "audio/ogg"
        elif fname.endswith((".mp3", ".mpeg")):
            final_mime = "audio/mpeg"
        else:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported audio format '{raw_mime}'. Supported formats: WebM, OGG, WAV, MP4, MP3."
            )

    try:
        transcription_text = await run_in_threadpool(_transcribe_audio_with_gemini, content, final_mime)
        return {"transcription": transcription_text}
    except RuntimeError as re:
        logger.error(f"Gemini transcription service error: {re}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Voice transcription service error: {str(re)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in transcribe_audio_endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during speech transcription: {str(e)}"
        )

