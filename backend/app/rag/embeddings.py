import logging
from typing import List, Optional
from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Embedding Service using sentence-transformers (all-MiniLM-L6-v2 by default).
    Singleton model loading to avoid reloading on each request.
    """

    _instance: Optional["EmbeddingService"] = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._initialize_model()
        return cls._instance

    def _initialize_model(self):
        settings = get_settings()
        model_name = settings.EMBEDDING_MODEL
        logger.info(f"Loading embedding model: {model_name}")
        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(model_name)
            logger.info(f"Successfully loaded embedding model: {model_name}")
        except Exception as e:
            logger.error(f"Failed to load embedding model {model_name}: {e}", exc_info=True)
            self._model = None

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Generates dense vector embeddings for a list of document chunk texts.
        """
        if not texts:
            return []
        if self._model is None:
            self._initialize_model()
        if self._model is None:
            raise RuntimeError("Embedding model is not loaded or unavailable.")
        
        try:
            embeddings = self._model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Error encoding documents with embedding model: {e}", exc_info=True)
            raise

    def embed_query(self, text: str) -> List[float]:
        """
        Generates dense vector embedding for a single user query.
        """
        if not text:
            return []
        if self._model is None:
            self._initialize_model()
        if self._model is None:
            raise RuntimeError("Embedding model is not loaded or unavailable.")
        
        try:
            embedding = self._model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error encoding query with embedding model: {e}", exc_info=True)
            raise


def get_embedding_service() -> EmbeddingService:
    """Dependency helper to get embedding service singleton."""
    return EmbeddingService()


def warmup_embedding_service() -> EmbeddingService:
    """Pre-loads the sentence transformer embedding model once at startup."""
    svc = get_embedding_service()
    if not svc.is_loaded:
        svc._initialize_model()
    return svc
