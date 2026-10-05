import logging
from abc import ABC, abstractmethod
from typing import List, Optional
from backend.app.core.config import get_settings
from backend.app.schemas.rag import RetrievedChunk

logger = logging.getLogger(__name__)


class BaseReranker(ABC):
    """Abstract interface for Reranking models."""
    
    @abstractmethod
    def rerank(self, query: str, chunks: List[RetrievedChunk], top_k: int = 5) -> List[RetrievedChunk]:
        pass


class CrossEncoderReranker(BaseReranker):
    """
    Local Cross-Encoder Reranker using sentence-transformers CrossEncoder.
    Scores (query, chunk_text) pairs directly to produce refined relevance rankings.
    Reuses model instance across requests via class-level caching.
    """

    _model_cache: dict = {}

    def __init__(self, model_name: Optional[str] = None):
        settings = get_settings()
        self.model_name = model_name if model_name is not None else (settings.RERANKER_MODEL or "cross-encoder/ms-marco-MiniLM-L-6-v2")
        self._model = None
        self._initialize_model()

    def _initialize_model(self):
        if not self.model_name:
            logger.info("No reranker model specified. Using passthrough scoring.")
            return

        if self.model_name in CrossEncoderReranker._model_cache:
            self._model = CrossEncoderReranker._model_cache[self.model_name]
            logger.info(f"Reusing cached reranker model: {self.model_name}")
            return

        logger.info(f"Loading reranker cross-encoder model: {self.model_name}")
        try:
            from sentence_transformers import CrossEncoder
            loaded = CrossEncoder(self.model_name)
            CrossEncoderReranker._model_cache[self.model_name] = loaded
            self._model = loaded
            logger.info(f"Successfully loaded and cached reranker model: {self.model_name}")
        except Exception as e:
            logger.warning(
                f"Could not load local CrossEncoder '{self.model_name}': {e}. "
                f"Ensure 'sentence-transformers' and PyTorch are installed."
            )
            self._model = None

    def rerank(self, query: str, chunks: List[RetrievedChunk], top_k: int = 5) -> List[RetrievedChunk]:
        """
        Reranks candidate chunks based on cross-encoder scoring.
        """
        if not chunks or not query:
            return []

        logger.info(f"Reranking {len(chunks)} candidate chunks for query (target top_k={top_k})")
        
        # If model is loaded, compute cross-encoder scores
        if self._model is not None:
            try:
                pairs = [(query, chunk.chunk_text) for chunk in chunks]
                scores = self._model.predict(pairs, batch_size=32)

                reranked_chunks: List[RetrievedChunk] = []
                for idx, chunk in enumerate(chunks):
                    raw_score = float(scores[idx])
                    reranked_chunks.append(RetrievedChunk(
                        chunk_id=chunk.chunk_id,
                        document_id=chunk.document_id,
                        chunk_text=chunk.chunk_text,
                        metadata=chunk.metadata,
                        score=round(raw_score, 4),
                        source_type="reranked"
                    ))

                reranked_chunks.sort(key=lambda x: x.score, reverse=True)
                return reranked_chunks[:top_k]
            except Exception as e:
                logger.error(f"Error during cross-encoder reranking: {e}", exc_info=True)
                return chunks[:top_k]
        else:
            logger.info("Reranker model not initialized; falling back to hybrid retrieval ranking.")
            return chunks[:top_k]


_cached_reranker: Optional[BaseReranker] = None


def get_reranker() -> BaseReranker:
    global _cached_reranker
    if _cached_reranker is None:
        _cached_reranker = CrossEncoderReranker()
    return _cached_reranker


def warmup_reranker() -> BaseReranker:
    """Pre-loads the reranker model once at startup."""
    return get_reranker()
