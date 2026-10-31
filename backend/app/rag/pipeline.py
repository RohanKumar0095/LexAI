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
        close_db = False
        if db is None:
            try:
                from backend.app.core.database import SessionLocal
                db = SessionLocal()
                close_db = True
            except Exception as e:
                logger.warning(f"Could not open fallback database session in search: {e}")
        try:
            candidates = self.retriever.retrieve(cleaned_query, top_k=self.retrieval_top_k, db_session=db)
            reranked = self.reranker.rerank(cleaned_query, candidates, top_k=top_k)
            return reranked
        finally:
            if close_db and db:
                db.close()

    def run(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        db: Optional[Session] = None,
        explain_mode: Optional[str] = "simple",
        timer: Optional[StageTimer] = None,
        trace_id: Optional[str] = None
    ) -> ChatResponse:
        """
        Executes the full RAG pipeline: retrieval -> reranking -> prompt generation -> LLM response.
        Instrumented with StageTimer and TraceCollector for real-time telemetry profiling.
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty.")

        close_db = False
        if db is None:
            try:
                from backend.app.core.database import SessionLocal
                db = SessionLocal()
                close_db = True
            except Exception as e:
                logger.warning(f"Could not open fallback database session in run: {e}")

        try:
            return self._run_pipeline(
                query=query,
                conversation_id=conversation_id,
                db=db,
                explain_mode=explain_mode,
                timer=timer,
                trace_id=trace_id
            )
        finally:
            if close_db and db:
                db.close()

    def _run_pipeline(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        db: Optional[Session] = None,
        explain_mode: Optional[str] = "simple",
        timer: Optional[StageTimer] = None,
        trace_id: Optional[str] = None
    ) -> ChatResponse:
        from backend.app.core.telemetry import get_trace_collector
        collector = get_trace_collector()

        local_timer = timer or StageTimer("rag_pipeline")
        cleaned_query = normalize_legal_terms(query)
        logger.info(f"Executing Legal RAG for query: '{cleaned_query[:60]}...' [mode: {explain_mode}]")

        # 1. Hybrid Retrieval (Vector + Keyword)
        retrieved_candidates = self.retriever.retrieve(
            cleaned_query,
            top_k=self.retrieval_top_k,
            db_session=db,
            timer=local_timer,
            trace_id=trace_id
        )
        logger.info(f"Retrieved {len(retrieved_candidates)} hybrid candidates")

        # 2. Reranking
        if trace_id:
            collector.start_stage(trace_id, "reranking", "Scoring candidate relevance with CrossEncoder")
        reranker_model = getattr(self.reranker, "model_name", "CrossEncoder")
        try:
            with local_timer.measure("reranker_inference_ms"):
                ranked_candidates = self.reranker.rerank(
                    cleaned_query,
                    retrieved_candidates,
                    top_k=self.rerank_top_k
                )
            logger.info(f"Reranked into {len(ranked_candidates)} top candidate chunks")
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "reranking",
                    technical_details={
                        "reranker_model": reranker_model,
                        "candidates_in": len(retrieved_candidates),
                        "candidates_retained": len(ranked_candidates),
                        "top_k_threshold": self.rerank_top_k
                    },
                    status_msg=f"Scored {len(ranked_candidates)} candidates"
                )
        except Exception as e:
            logger.error(f"Error during reranking: {e}", exc_info=True)
            if trace_id:
                collector.end_stage(trace_id, "reranking", error="Reranking cross-encoder failure")
            ranked_candidates = retrieved_candidates[:self.rerank_top_k]

        # 3. Evidence Relevance Validation (Stage 8)
        if trace_id:
            collector.start_stage(trace_id, "evidence_validation", "Evaluating evidence relevance against calibrated thresholds")

        settings = get_settings()
        min_relevance = getattr(settings, "MIN_EVIDENCE_RELEVANCE_SCORE", -2.5)
        partial_threshold = getattr(settings, "PARTIAL_EVIDENCE_SCORE_THRESHOLD", 1.0)

        # Filter candidates strictly above minimum relevance cutoff
        accepted_evidence: List[RetrievedChunk] = [c for c in ranked_candidates if c.score >= min_relevance]
        top_score = ranked_candidates[0].score if ranked_candidates else -999.0

        if not accepted_evidence or top_score < min_relevance:
            evidence_state = "insufficient"
        elif top_score < partial_threshold or len(accepted_evidence) == 1:
            evidence_state = "partial"
        else:
            evidence_state = "sufficient"

        if trace_id:
            collector.end_stage(
                trace_id,
                "evidence_validation",
                technical_details={
                    "evidence_state": evidence_state,
                    "top_relevance_score": round(top_score, 4),
                    "min_relevance_cutoff": min_relevance,
                    "partial_threshold": partial_threshold,
                    "accepted_chunks_count": len(accepted_evidence),
                    "discarded_chunks_count": len(ranked_candidates) - len(accepted_evidence),
                },
                status_msg=f"Evidence state: {evidence_state.upper()} ({len(accepted_evidence)} accepted chunks)"
            )

        # =================================================================
        # BRANCH A: INSUFFICIENT EVIDENCE -> BYPASS GEMINI ENTIRELY
        # =================================================================
        if evidence_state == "insufficient":
            logger.info("Insufficient evidence in indexed legal documents. Bypassing Gemini transformation.")
            
            # Explicitly mark subsequent stages in telemetry
            if trace_id:
                collector.start_stage(trace_id, "prompt_construction", "Skipped - insufficient evidence")
                collector.end_stage(trace_id, "prompt_construction", skipped=True, status_msg="Skipped: No relevant evidence to assemble")
                collector.start_stage(trace_id, "gemini_generation", "Skipped - insufficient evidence")
                collector.end_stage(trace_id, "gemini_generation", skipped=True, status_msg="Bypassed: Gemini was not invoked because data is not in indexed corpus")
                collector.start_stage(trace_id, "response_processing", "Delivering fixed unavailable response")
                collector.end_stage(trace_id, "response_processing", status_msg="Attached zero citations for unsupported query")
                collector.start_stage(trace_id, "persistence_delivery", "Delivering fixed unavailable response")
                collector.end_stage(trace_id, "persistence_delivery", technical_details={"delivered": True}, status_msg="Returned fixed unavailable response")
                collector.complete_trace(trace_id, failed=False)

            if timer is None:
                local_timer.finish(log_output=True)

            return ChatResponse(
                query=cleaned_query,
                answer="Data not available in the indexed legal documents.",
                sources=[],
                retrieved_chunks=[],
                conversation_id=conversation_id,
                explain_mode=explain_mode or "simple",
                trace_id=trace_id,
                evidence_state="insufficient",
                structured_answer=None
            )

        # =================================================================
        # BRANCH B & C: SUFFICIENT OR PARTIAL EVIDENCE -> TRANSFORM ONLY
        # =================================================================
        is_partial = (evidence_state == "partial")

        # 4. Prompt Synthesis & Grounding
        if trace_id:
            collector.start_stage(trace_id, "prompt_construction", "Assembling accepted evidence for transformation")
        try:
            with local_timer.measure("prompt_build_ms"):
                system_prompt, user_prompt, sources = LegalPromptBuilder.build_grounded_prompt(
                    cleaned_query,
                    accepted_evidence,
                    explain_mode=explain_mode or "simple",
                    is_partial=is_partial
                )
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "prompt_construction",
                    technical_details={
                        "explain_mode": explain_mode or "simple",
                        "context_chunks_count": len(accepted_evidence),
                        "approx_prompt_chars": len(system_prompt) + len(user_prompt),
                        "is_partial": is_partial
                    },
                    status_msg=f"Grounded prompt assembled with {len(accepted_evidence)} accepted chunks"
                )
        except Exception as e:
            logger.error(f"Error building prompt: {e}", exc_info=True)
            if trace_id:
                collector.end_stage(trace_id, "prompt_construction", error="Prompt assembly failed")
            raise

        # 5. Gemini Evidence Transformation (Transformation Only)
        if trace_id:
            collector.start_stage(trace_id, "gemini_generation", "Calling Gemini strictly for evidence transformation")

        llm_model = getattr(self.llm, "model_name", "gemini-3.5-flash-lite")
        gemini_failed = False
        raw_llm_response = ""

        try:
            with local_timer.measure("llm_roundtrip_ms"):
                raw_llm_response = self.llm.generate_answer(system_prompt, user_prompt)
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "gemini_generation",
                    technical_details={
                        "model": llm_model,
                        "generation_status": "success",
                        "response_chars": len(raw_llm_response)
                    },
                    status_msg="Successfully transformed evidence into structured format"
                )
        except Exception as e:
            logger.error(f"Error during LLM answer generation: {e}", exc_info=True)
            raw_llm_response = ""
            gemini_failed = True
            if trace_id:
                collector.end_stage(
                    trace_id,
                    "gemini_generation",
                    technical_details={"model": llm_model},
                    error="Language model transformation failed"
                )

        # 6. Response Processing & Provenance Validation
        if trace_id:
            collector.start_stage(trace_id, "response_processing", "Validating structured answer and source provenance")

        if gemini_failed or not raw_llm_response:
            structured_ans = None
            answer = "Error generating transformed legal answer. Please verify server connectivity."
            evidence_state = "validation_failed"
            valid_sources = []
        else:
            # Parse structured JSON output from Gemini
            structured_ans = LegalPromptBuilder.parse_structured_transformation(
                raw_llm_response,
                sources=sources,
                fallback_query=cleaned_query
            )

            # Check if structured answer revealed partial coverage
            if structured_ans.status == "partially_supported" or len(structured_ans.unavailable_information) > 0:
                evidence_state = "partial"
                is_partial = True

            # Format clean, accessible markdown for display based on explain_mode
            answer = LegalPromptBuilder.format_structured_answer_to_markdown(
                structured_ans,
                is_partial=is_partial,
                explain_mode=explain_mode or "simple"
            )

            # Source Provenance Validation:
            # Collect all source IDs explicitly relied upon in the structured answer
            relied_source_ids = set(structured_ans.summary_source_ids)
            for item in (
                structured_ans.key_points +
                structured_ans.steps +
                structured_ans.conditions +
                structured_ans.exceptions +
                structured_ans.important_notes
            ):
                relied_source_ids.update(item.source_ids)

            # Retain only sources that were actually cited in the generated answer
            accepted_chunk_ids = {c.chunk_id for c in accepted_evidence}
            valid_sources = [
                s for s in sources
                if s.chunk_id in accepted_chunk_ids and (
                    (s.evidence_id and s.evidence_id in relied_source_ids) or
                    (s.chunk_id in relied_source_ids)
                )
            ]

            # If model didn't tag any specific source, fall back to primary accepted source
            if not valid_sources and sources:
                valid_sources = [sources[0]]

        if trace_id:
            collector.end_stage(
                trace_id,
                "response_processing",
                technical_details={
                    "sources_retained": len(valid_sources),
                    "accepted_chunks_count": len(accepted_evidence),
                    "structured_status": structured_ans.status if structured_ans else "failed",
                    "key_points_count": len(structured_ans.key_points) if structured_ans else 0,
                    "unavailable_fields_count": len(structured_ans.unavailable_information) if structured_ans else 0,
                },
                status_msg=f"Validated {len(valid_sources)} active supporting source references"
            )

        # 7. Persistence & Delivery
        if trace_id:
            collector.start_stage(trace_id, "persistence_delivery", "Finalizing response delivery")
            collector.end_stage(
                trace_id,
                "persistence_delivery",
                technical_details={
                    "delivered": True,
                    "conversation_id": conversation_id or "new_session",
                    "evidence_state": evidence_state
                },
                status_msg="Response delivered to user"
            )
            collector.complete_trace(trace_id, failed=gemini_failed)

        if timer is None:
            local_timer.finish(log_output=True)

        return ChatResponse(
            query=cleaned_query,
            answer=answer,
            sources=valid_sources,
            retrieved_chunks=accepted_evidence,
            conversation_id=conversation_id,
            explain_mode=explain_mode or "simple",
            trace_id=trace_id,
            evidence_state=evidence_state,
            structured_answer=structured_ans
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
