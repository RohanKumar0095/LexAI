import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.core.config import get_settings
from backend.app.core.database import check_db_connection
from backend.app.rag.pipeline import LegalRAGPipeline, get_rag_pipeline
from backend.app.rag.vector_store import VectorStore, get_vector_store
from backend.app.rag.embeddings import EmbeddingService, get_embedding_service
from backend.app.rag.ingestion import IngestionPipeline, get_ingestion_pipeline
from backend.app.llm.gemini import get_gemini_service
from backend.app.schemas.rag import ChatResponse, RetrievedChunk, HealthResponse

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(
        self,
        pipeline: Optional[LegalRAGPipeline] = None,
        ingestion: Optional[IngestionPipeline] = None,
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
    ):
        self.vector_store = vector_store or get_vector_store()
        self.embedding_service = embedding_service or get_embedding_service()
        self.pipeline = pipeline or get_rag_pipeline()
        self.ingestion = ingestion or get_ingestion_pipeline()
        self.gemini = get_gemini_service()

    def process_chat(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        db: Optional[Session] = None,
        explain_mode: Optional[str] = "simple",
        timer: Optional[Any] = None
    ) -> ChatResponse:
        return self.pipeline.run(
            query=query,
            conversation_id=conversation_id,
            db=db,
            explain_mode=explain_mode,
            timer=timer
        )

    def search_chunks(self, query: str, top_k: int = 10, db: Optional[Session] = None) -> List[RetrievedChunk]:
        return self.pipeline.search(query=query, top_k=top_k, db=db)

    def ingest_document(self, file_path: str, db: Session, source_url: Optional[str] = None) -> Dict[str, Any]:
        return self.ingestion.ingest_pdf(file_path=file_path, db=db, source_url=source_url)

    def get_health_status(self) -> HealthResponse:
        settings = get_settings()
        
        db_ok = check_db_connection()
        chroma_ok = self.vector_store.is_healthy()
        embedding_ok = self.embedding_service.is_loaded
        gemini_ok = self.gemini.is_available()

        all_ok = db_ok and chroma_ok and embedding_ok and gemini_ok
        status = "healthy" if all_ok else "degraded"

        return HealthResponse(
            status=status,
            database_connected=db_ok,
            chroma_connected=chroma_ok,
            embedding_model_loaded=embedding_ok,
            gemini_configured=gemini_ok,
            details={
                "project": settings.PROJECT_NAME,
                "embedding_model": settings.EMBEDDING_MODEL,
                "gemini_model": settings.GEMINI_MODEL,
                "chroma_collection": settings.CHROMA_COLLECTION_NAME,
                "chroma_chunks_count": self.vector_store.count() if chroma_ok else 0,
            }
        )


_cached_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    global _cached_rag_service
    if _cached_rag_service is None:
        _cached_rag_service = RAGService()
    return _cached_rag_service


def warmup_rag_service() -> RAGService:
    """Pre-initializes the complete RAG service once at startup."""
    return get_rag_service()
