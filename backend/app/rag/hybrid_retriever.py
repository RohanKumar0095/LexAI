import logging
from typing import List, Dict, Optional, Any
from sqlalchemy.orm import Session
from backend.app.core.config import get_settings
from backend.app.rag.embeddings import EmbeddingService, get_embedding_service
from backend.app.rag.vector_store import VectorStore, get_vector_store
from backend.app.rag.keyword_search import KeywordSearchService, get_keyword_search_service
from backend.app.schemas.rag import RetrievedChunk

logger = logging.getLogger(__name__)


class HybridRetriever:
    """
    Hybrid Retriever combining Chroma dense vector search with PostgreSQL full text search.
    Implements Reciprocal Rank / Linear Score Fusion with normalization and deduplication.
    """

    def __init__(
        self,
        vector_store: Optional[VectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
        keyword_search: Optional[KeywordSearchService] = None,
        vector_weight: Optional[float] = None,
        keyword_weight: Optional[float] = None,
    ):
        settings = get_settings()
        self.vector_store = vector_store or get_vector_store()
        self.embedding_service = embedding_service or get_embedding_service()
        self.keyword_search = keyword_search or get_keyword_search_service()
        self.vector_weight = vector_weight if vector_weight is not None else settings.VECTOR_WEIGHT
        self.keyword_weight = keyword_weight if keyword_weight is not None else settings.KEYWORD_WEIGHT

    def retrieve(
        self,
        query: str,
        top_k: int = 20,
        db_session: Optional[Session] = None,
        timer: Optional[Any] = None
    ) -> List[RetrievedChunk]:
        """
        Executes hybrid retrieval: vector search + keyword search -> score fusion -> deduplication -> top_k candidates.
        """
        if not query or not query.strip():
            return []

        logger.info(f"Starting hybrid retrieval for query: '{query[:80]}...' (top_k={top_k})")
        
        # 1. Vector Search
        vector_candidates: List[RetrievedChunk] = []
        try:
            if timer:
                with timer.measure("embedding_ms"):
                    query_embedding = self.embedding_service.embed_query(query)
                with timer.measure("vector_search_ms"):
                    vector_candidates = self.vector_store.search(query_embedding, top_k=top_k)
            else:
                query_embedding = self.embedding_service.embed_query(query)
                vector_candidates = self.vector_store.search(query_embedding, top_k=top_k)
            logger.info(f"Vector search retrieved {len(vector_candidates)} candidates")
        except Exception as e:
            logger.error(f"Vector search failed in hybrid retriever: {e}", exc_info=True)

        # 2. Keyword Search
        keyword_candidates: List[RetrievedChunk] = []
        try:
            if timer:
                with timer.measure("keyword_search_ms"):
                    keyword_candidates = self.keyword_search.search(query, top_k=top_k, db=db_session)
            else:
                keyword_candidates = self.keyword_search.search(query, top_k=top_k, db=db_session)
            logger.info(f"Keyword search retrieved {len(keyword_candidates)} candidates")
        except Exception as e:
            logger.error(f"Keyword search failed in hybrid retriever: {e}", exc_info=True)

        # If both empty, return empty list
        if not vector_candidates and not keyword_candidates:
            logger.warning("Both vector and keyword searches returned zero results.")
            return []

        # 3. Deterministic Score Fusion & Deduplication
        def _fuse():
            merged_chunks: Dict[str, RetrievedChunk] = {}
            vec_scores: Dict[str, float] = {}
            kw_scores: Dict[str, float] = {}

            max_vec = max([c.score for c in vector_candidates], default=1.0) or 1.0
            for c in vector_candidates:
                norm_v = (c.score / max_vec) if max_vec > 0 else 0.0
                vec_scores[c.chunk_id] = norm_v
                merged_chunks[c.chunk_id] = c

            max_kw = max([c.score for c in keyword_candidates], default=1.0) or 1.0
            for c in keyword_candidates:
                norm_kw = (c.score / max_kw) if max_kw > 0 else 0.0
                kw_scores[c.chunk_id] = norm_kw
                if c.chunk_id not in merged_chunks:
                    merged_chunks[c.chunk_id] = c

            final_candidates: List[RetrievedChunk] = []
            for chunk_id, chunk in merged_chunks.items():
                v_score = vec_scores.get(chunk_id, 0.0)
                k_score = kw_scores.get(chunk_id, 0.0)
                hybrid_score = (self.vector_weight * v_score) + (self.keyword_weight * k_score)
                
                if chunk_id in vec_scores and chunk_id in kw_scores:
                    src_type = "hybrid (vector+keyword)"
                elif chunk_id in vec_scores:
                    src_type = "vector"
                else:
                    src_type = "keyword"

                final_candidates.append(RetrievedChunk(
                    chunk_id=chunk.chunk_id,
                    document_id=chunk.document_id,
                    chunk_text=chunk.chunk_text,
                    metadata=chunk.metadata,
                    score=round(hybrid_score, 4),
                    source_type=src_type
                ))

            final_candidates.sort(key=lambda x: x.score, reverse=True)
            return final_candidates[:top_k]

        if timer:
            with timer.measure("rrf_ms"):
                top_candidates = _fuse()
        else:
            top_candidates = _fuse()

        logger.info(f"Hybrid retrieval finished with {len(top_candidates)} fused candidates")
        return top_candidates


_cached_hybrid_retriever: Optional[HybridRetriever] = None


def get_hybrid_retriever() -> HybridRetriever:
    global _cached_hybrid_retriever
    if _cached_hybrid_retriever is None:
        _cached_hybrid_retriever = HybridRetriever()
    return _cached_hybrid_retriever
