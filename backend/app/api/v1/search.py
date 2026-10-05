import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.rag import SearchRequest, SearchResponse
from backend.app.services.rag_service import RAGService, get_rag_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/search", response_model=SearchResponse, summary="Debug retrieval and reranking endpoint")
def rag_search(
    request: SearchRequest,
    db: Session = Depends(get_db),
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Debug Search Endpoint:
    Allows developers and evaluators to inspect retrieved legal chunks, scores,
    and metadata before triggering LLM generation.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query cannot be empty."
        )

    try:
        results = rag_service.search_chunks(
            query=request.query,
            top_k=request.top_k,
            db=db
        )
        return SearchResponse(
            query=request.query,
            count=len(results),
            results=results
        )
    except Exception as e:
        logger.error(f"Error during RAG search: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval error: {str(e)}"
        )
