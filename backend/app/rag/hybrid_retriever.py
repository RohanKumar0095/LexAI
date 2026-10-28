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
        timer: Optional[Any] = None,
        trace_id: Optional[str] = None
    ) -> List[RetrievedChunk]:
        """
        Executes hybrid retrieval: vector search + keyword search -> score fusion -> deduplication -> top_k candidates.
        """
        if not query or not query.strip():
            return []

        logger.info(f"Starting hybrid retrieval for query: '{query[:80]}...' (top_k={top_k})")
        
        from backend.app.core.telemetry import get_trace_collector
        collector = get_trace_collector()

        # 1. Query Embedding
        if trace_id:
            collector.start_stage(trace_id, "query_embedding", "Computing dense semantic query embedding")
        try:
            if timer:
                with timer.measure("embedding_ms"):
                    query_embedding = self.embedding_service.embed_query(query)
            else:
                query_embedding = self.embedding_service.embed_query(query)
            
            dim = len(query_embedding) if query_embedding else 0
            model_name = getattr(self.embedding_service, "_model_name", None) or get_settings().EMBEDDING_MODEL
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "query_embedding",
                    technical_details={
                        "embedding_model": model_name,
                        "vector_dimensions": dim,
                        "is_loaded": self.embedding_service.is_loaded
                    },
                    status_msg=f"Generated {dim}-dimensional query vector"
                )
        except Exception as e:
            if trace_id:
                collector.end_stage(trace_id, "query_embedding", error="Embedding generation failed")
            raise

        # 2. Vector Search (ChromaDB)
        if trace_id:
            collector.start_stage(trace_id, "vector_search", "Querying ChromaDB vector index")
        vector_candidates: List[RetrievedChunk] = []
        try:
            if timer:
                with timer.measure("vector_search_ms"):
                    vector_candidates = self.vector_store.search(query_embedding, top_k=top_k)
            else:
                vector_candidates = self.vector_store.search(query_embedding, top_k=top_k)
            logger.info(f"Vector search retrieved {len(vector_candidates)} candidates")
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "vector_search",
                    technical_details={
                        "collection_name": self.vector_store.collection_name,
                        "retrieval_limit": top_k,
                        "candidates_retrieved": len(vector_candidates),
                        "distance_metric": "cosine"
                    },
                    status_msg=f"Found {len(vector_candidates)} vector candidates"
                )
        except Exception as e:
            logger.error(f"Vector search failed in hybrid retriever: {e}", exc_info=True)
            if trace_id:
                collector.end_stage(trace_id, "vector_search", error="Vector store search failed")

        # 3. Keyword Search
        dialect_name = "unknown"
        if db_session and db_session.bind:
            dialect_name = db_session.bind.dialect.name

        if trace_id:
            collector.start_stage(trace_id, "keyword_search", f"Searching database ({dialect_name})")
        keyword_candidates: List[RetrievedChunk] = []
        try:
            if timer:
                with timer.measure("keyword_search_ms"):
                    keyword_candidates = self.keyword_search.search(query, top_k=top_k, db=db_session)
            else:
                keyword_candidates = self.keyword_search.search(query, top_k=top_k, db=db_session)
            logger.info(f"Keyword search retrieved {len(keyword_candidates)} candidates")
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "keyword_search",
                    technical_details={
                        "search_backend": dialect_name,
                        "retrieval_limit": top_k,
                        "candidates_retrieved": len(keyword_candidates)
                    },
                    status_msg=f"Found {len(keyword_candidates)} keyword candidates"
                )
        except Exception as e:
            logger.error(f"Keyword search failed in hybrid retriever: {e}", exc_info=True)
            if trace_id:
                collector.end_stage(trace_id, "keyword_search", error="Keyword search failed")

        # If both empty, return empty list
        if not vector_candidates and not keyword_candidates:
            logger.warning("Both vector and keyword searches returned zero results.")
            if trace_id:
                collector.start_stage(trace_id, "hybrid_fusion", "Fusing candidate scores")
                collector.end_stage(
                    trace_id,
                    "hybrid_fusion",
                    technical_details={"candidates_before_fusion": 0, "candidates_after_fusion": 0},
                    status_msg="Zero candidates returned from both retrievers"
                )
            return []

        # 4. Deterministic Score Fusion & Deduplication
        if trace_id:
            collector.start_stage(trace_id, "hybrid_fusion", "Fusing scores and deduplicating")

        def _fuse():
            merged_chunks: Dict[str, RetrievedChunk] = {}
            rrf_scores: Dict[str, float] = {}
            source_flags: Dict[str, set] = {}

            # Standard Reciprocal Rank Fusion (RRF) constant (k=60)
            k = 60.0

            for rank, c in enumerate(vector_candidates):
                merged_chunks[c.chunk_id] = c
                rrf_scores[c.chunk_id] = rrf_scores.get(c.chunk_id, 0.0) + (self.vector_weight / (k + rank))
                source_flags.setdefault(c.chunk_id, set()).add("vector")

            for rank, c in enumerate(keyword_candidates):
                if c.chunk_id not in merged_chunks:
                    merged_chunks[c.chunk_id] = c
                rrf_scores[c.chunk_id] = rrf_scores.get(c.chunk_id, 0.0) + (self.keyword_weight / (k + rank))
                source_flags.setdefault(c.chunk_id, set()).add("keyword")

            final_candidates: List[RetrievedChunk] = []
            for chunk_id, chunk in merged_chunks.items():
                flags = source_flags.get(chunk_id, set())
                if "vector" in flags and "keyword" in flags:
                    src_type = "hybrid (vector+keyword)"
                elif "vector" in flags:
                    src_type = "vector"
                else:
                    src_type = "keyword"

                final_candidates.append(RetrievedChunk(
                    chunk_id=chunk.chunk_id,
                    document_id=chunk.document_id,
                    chunk_text=chunk.chunk_text,
                    metadata=chunk.metadata,
                    score=round(rrf_scores.get(chunk_id, 0.0), 6),
                    source_type=src_type
                ))

            final_candidates.sort(key=lambda x: x.score, reverse=True)
            return final_candidates[:top_k]

        if timer:
            with timer.measure("rrf_ms"):
                top_candidates = _fuse()
        else:
            top_candidates = _fuse()

        if trace_id:
            collector.end_stage(
                trace_id,
                "hybrid_fusion",
                technical_details={
                    "vector_candidates_count": len(vector_candidates),
                    "keyword_candidates_count": len(keyword_candidates),
                    "vector_weight": self.vector_weight,
                    "keyword_weight": self.keyword_weight,
                    "candidates_after_fusion": len(top_candidates),
                },
                status_msg=f"Fused into {len(top_candidates)} deduplicated candidates"
            )

        logger.info(f"Hybrid retrieval finished with {len(top_candidates)} fused candidates")
        return top_candidates


_cached_hybrid_retriever: Optional[HybridRetriever] = None


def get_hybrid_retriever() -> HybridRetriever:
    global _cached_hybrid_retriever
    if _cached_hybrid_retriever is None:
        _cached_hybrid_retriever = HybridRetriever()
    return _cached_hybrid_retriever
