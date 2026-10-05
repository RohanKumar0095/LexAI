import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.core.config import get_settings
from backend.app.core.timing import StageTimer
from backend.app.rag.hybrid_retriever import HybridRetriever, get_hybrid_retriever
from backend.app.rag.reranker import BaseReranker, get_reranker
from backend.app.rag.prompt_builder import LegalPromptBuilder
from backend.app.llm.base import BaseLLM
from backend.app.llm.gemini import get_gemini_service
from backend.app.schemas.rag import ChatResponse, SearchResponse, RetrievedChunk, LegalSource
from backend.app.legal.case_matching import normalize_legal_terms

logger = logging.getLogger(__name__)


class LegalRAGPipeline:
    """
    Complete Legal RAG Pipeline orchestrating query normalization, hybrid retrieval,
    cross-encoder reranking, prompt synthesis, and Gemini LLM answer generation.
    """

    def __init__(
        self,
        retriever: Optional[HybridRetriever] = None,
        reranker: Optional[BaseReranker] = None,
        llm: Optional[BaseLLM] = None,
    ):
        settings = get_settings()
        self.retriever = retriever or get_hybrid_retriever()
        self.reranker = reranker or get_reranker()
        self.llm = llm or get_gemini_service()
        self.retrieval_top_k = settings.RETRIEVAL_TOP_K
        self.rerank_top_k = settings.RERANK_TOP_K

    def search(self, query: str, top_k: int = 10, db: Optional[Session] = None) -> List[RetrievedChunk]:
        """
        Executes hybrid retrieval and reranking for debug search without calling Gemini.
        """
        cleaned_query = normalize_legal_terms(query)
        candidates = self.retriever.retrieve(cleaned_query, top_k=self.retrieval_top_k, db_session=db)
        reranked = self.reranker.rerank(cleaned_query, candidates, top_k=top_k)
        return reranked

    def run(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        db: Optional[Session] = None,
        explain_mode: Optional[str] = "simple",
        timer: Optional[StageTimer] = None
    ) -> ChatResponse:
        """
        Executes the full RAG pipeline: retrieval -> reranking -> prompt generation -> LLM response.
        Instrumented with StageTimer for safe millisecond profiling.
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty.")

        local_timer = timer or StageTimer("rag_pipeline")
        cleaned_query = normalize_legal_terms(query)
        logger.info(f"Executing Legal RAG for query: '{cleaned_query[:60]}...' [mode: {explain_mode}]")

        # 1. Hybrid Retrieval (Vector + Keyword)
        retrieved_candidates = self.retriever.retrieve(
            cleaned_query,
            top_k=self.retrieval_top_k,
            db_session=db,
            timer=local_timer
        )
        logger.info(f"Retrieved {len(retrieved_candidates)} hybrid candidates")

        # 2. Reranking
        with local_timer.measure("reranker_inference_ms"):
            evidence_chunks = self.reranker.rerank(
                cleaned_query,
                retrieved_candidates,
                top_k=self.rerank_top_k
            )
        logger.info(f"Reranked into {len(evidence_chunks)} top evidence chunks")

        # 3. Prompt Construction
        with local_timer.measure("prompt_build_ms"):
            system_prompt, user_prompt, sources = LegalPromptBuilder.build_grounded_prompt(
                cleaned_query,
                evidence_chunks,
                explain_mode=explain_mode or "simple"
            )

        # 4. Generate LLM Answer
        if not evidence_chunks:
            answer = (
                "The LexAI India legal knowledge base does not currently contain relevant documents, "
                "case laws, or statutory provisions matching your query. "
                "Please ensure relevant legal PDFs (e.g. Supreme Court judgments or Acts) have been ingested into the system."
            )
        else:
            try:
                with local_timer.measure("llm_roundtrip_ms"):
                    answer = self.llm.generate_answer(system_prompt, user_prompt)
            except Exception as e:
                logger.error(f"Error during LLM answer generation: {e}", exc_info=True)
                answer = f"Error generating legal answer: {str(e)}"

        if timer is None:
            local_timer.finish(log_output=True)

        return ChatResponse(
            query=cleaned_query,
            answer=answer,
            sources=sources,
            retrieved_chunks=evidence_chunks,
            conversation_id=conversation_id,
            explain_mode=explain_mode or "simple"
        )


_cached_pipeline: Optional[LegalRAGPipeline] = None


def get_rag_pipeline(
    retriever: Optional[HybridRetriever] = None,
    reranker: Optional[BaseReranker] = None,
    llm: Optional[BaseLLM] = None,
) -> LegalRAGPipeline:
    global _cached_pipeline
    if retriever is not None or reranker is not None or llm is not None:
        return LegalRAGPipeline(retriever=retriever, reranker=reranker, llm=llm)
    if _cached_pipeline is None:
        _cached_pipeline = LegalRAGPipeline()
    return _cached_pipeline


def warmup_rag_pipeline() -> LegalRAGPipeline:
    """Pre-initializes the complete RAG pipeline once at startup."""
    return get_rag_pipeline()
