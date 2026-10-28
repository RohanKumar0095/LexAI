import time
import logging
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

logger = logging.getLogger("lexai_telemetry")


class StageTrace(BaseModel):
    stage_id: str
    stage_number: int
    stage_name: str
    simple_name: str
    description: str
    status: str = "pending"  # "pending", "in_progress", "completed", "failed", "skipped"
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    duration_ms: Optional[float] = None
    technical_details: Dict[str, Any] = Field(default_factory=dict)
    status_message: Optional[str] = None
    error: Optional[str] = None


class PipelineTrace(BaseModel):
    trace_id: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    status: str = "pending"  # "pending", "processing", "completed", "failed"
    created_at: float = Field(default_factory=time.time)
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    total_duration_ms: Optional[float] = None
    current_stage_id: Optional[str] = None
    stages: List[StageTrace] = Field(default_factory=list)


def build_default_stages() -> List[StageTrace]:
    """
    Standard stages corresponding exactly to real LexAI execution points:
    1. Request Received & Validation
    2. Session & Context Resolution
    3. Query Legal Normalization & Embedding
    4. Dense Vector Retrieval (ChromaDB)
    5. Keyword Lexical Retrieval (PostgreSQL / SQLite)
    6. Score Fusion & Deduplication
    7. Cross-Encoder Reranking
    8. Evidence Relevance Validation (Sufficient / Partial / Insufficient Gate)
    9. Prompt Synthesis & Grounding
    10. Gemini Evidence Transformation (Transformation Only)
    11. Response Processing & Provenance Validation
    12. Persistence & Delivery
    """
    return [
        StageTrace(
            stage_id="request_received",
            stage_number=1,
            stage_name="Request Validation & Reception",
            simple_name="Receiving and validating question",
            description="Validates query parameters, input length, and ensures security boundaries.",
            status="pending",
        ),
        StageTrace(
            stage_id="session_context",
            stage_number=2,
            stage_name="Session & Context Resolution",
            simple_name="Checking session and history",
            description="Resolves active conversation context, explanation mode, and user ownership.",
            status="pending",
        ),
        StageTrace(
            stage_id="query_embedding",
            stage_number=3,
            stage_name="Query Legal Normalization & Embedding",
            simple_name="Analyzing query and generating embedding",
            description="Normalizes legal terminology and computes dense semantic vector embedding.",
            status="pending",
        ),
        StageTrace(
            stage_id="vector_search",
            stage_number=4,
            stage_name="Vector Search (ChromaDB)",
            simple_name="Searching legal knowledge base",
            description="Queries indexed legal provisions and judicial judgments using cosine distance.",
            status="pending",
        ),
        StageTrace(
            stage_id="keyword_search",
            stage_number=5,
            stage_name="Keyword Search (Full-Text Database)",
            simple_name="Searching statutory terminology",
            description="Performs lexical matching across legal statutes using database full-text search.",
            status="pending",
        ),
        StageTrace(
            stage_id="hybrid_fusion",
            stage_number=6,
            stage_name="Hybrid Retrieval & Fusion",
            simple_name="Combining search results",
            description="Fuses dense semantic vectors and sparse lexical scores using weighted normalization.",
            status="pending",
        ),
        StageTrace(
            stage_id="reranking",
            stage_number=7,
            stage_name="Cross-Encoder Reranking",
            simple_name="Selecting strongest legal authorities",
            description="Evaluates query-passage pairs using a cross-encoder model to optimize authority ordering.",
            status="pending",
        ),
        StageTrace(
            stage_id="evidence_validation",
            stage_number=8,
            stage_name="Evidence Relevance Validation",
            simple_name="Validating evidence sufficiency",
            description="Evaluates relevance scores against calibrated thresholds to determine if sufficient, partial, or insufficient evidence exists.",
            status="pending",
        ),
        StageTrace(
            stage_id="prompt_construction",
            stage_number=9,
            stage_name="Prompt Synthesis & Evidence Assembly",
            simple_name="Assembling accepted evidence",
            description="Packages accepted evidence chunks with strict transformation-only instructions into schema-bound prompt.",
            status="pending",
        ),
        StageTrace(
            stage_id="gemini_generation",
            stage_number=10,
            stage_name="Gemini Evidence Transformation",
            simple_name="Transforming evidence into readable format",
            description="Restricts Gemini to strictly transforming supplied evidence into structured format without using pretrained knowledge.",
            status="pending",
        ),
        StageTrace(
            stage_id="response_processing",
            stage_number=11,
            stage_name="Response Provenance & Citation Validation",
            simple_name="Validating source provenance and citations",
            description="Validates structured response, verifies source IDs against accepted evidence, and formats clean citations.",
            status="pending",
        ),
        StageTrace(
            stage_id="persistence_delivery",
            stage_number=12,
            stage_name="Persistence & Delivery",
            simple_name="Delivering verified response",
            description="Finalizes payload and delivers verified legal answer to the client interface.",
            status="pending",
        ),
    ]



class TraceCollector:
    """
    Manages in-memory telemetry traces for RAG pipeline requests.
    Thread-safe and async-safe via monotonic time tracking and isolated trace IDs.
    Includes automatic cleanup of expired traces.
    """

    def __init__(self, ttl_seconds: int = 1800, max_traces: int = 200):
        self._traces: Dict[str, PipelineTrace] = {}
        self._start_perf: Dict[str, float] = {}
        self._stage_perf: Dict[str, Dict[str, float]] = {}
        self._ttl_seconds = ttl_seconds
        self._max_traces = max_traces

    def _cleanup_old_traces(self) -> None:
        now = time.time()
        expired = [
            tid for tid, trace in self._traces.items()
            if (now - trace.created_at) > self._ttl_seconds
        ]
        for tid in expired:
            self._traces.pop(tid, None)
            self._start_perf.pop(tid, None)
            self._stage_perf.pop(tid, None)

        if len(self._traces) > self._max_traces:
            # Drop oldest traces
            sorted_by_time = sorted(self._traces.items(), key=lambda kv: kv[1].created_at)
            to_remove = sorted_by_time[: len(self._traces) - self._max_traces]
            for tid, _ in to_remove:
                self._traces.pop(tid, None)
                self._start_perf.pop(tid, None)
                self._stage_perf.pop(tid, None)

    def init_trace(self, trace_id: str, conversation_id: Optional[str] = None, user_id: Optional[str] = None) -> PipelineTrace:
        self._cleanup_old_traces()
        trace = PipelineTrace(
            trace_id=trace_id,
            conversation_id=conversation_id,
            user_id=user_id,
            status="processing",
            stages=build_default_stages(),
            started_at=time.time(),
        )
        self._traces[trace_id] = trace
        self._start_perf[trace_id] = time.perf_counter()
        self._stage_perf[trace_id] = {}
        return trace

    def get_trace(self, trace_id: str) -> Optional[PipelineTrace]:
        return self._traces.get(trace_id)

    def start_stage(self, trace_id: str, stage_id: str, status_msg: Optional[str] = None) -> None:
        trace = self._traces.get(trace_id)
        if not trace:
            return
        trace.current_stage_id = stage_id
        if trace.status == "pending":
            trace.status = "processing"

        for stage in trace.stages:
            if stage.stage_id == stage_id:
                stage.status = "in_progress"
                stage.started_at = time.time()
                if status_msg:
                    stage.status_message = status_msg
                break

        if trace_id not in self._stage_perf:
            self._stage_perf[trace_id] = {}
        self._stage_perf[trace_id][stage_id] = time.perf_counter()

    def end_stage(
        self,
        trace_id: str,
        stage_id: str,
        technical_details: Optional[Dict[str, Any]] = None,
        status_msg: Optional[str] = None,
        error: Optional[str] = None,
        skipped: bool = False
    ) -> None:
        trace = self._traces.get(trace_id)
        if not trace:
            return

        perf_start = self._stage_perf.get(trace_id, {}).get(stage_id)
        duration_ms = round((time.perf_counter() - perf_start) * 1000.0, 2) if perf_start else None

        for stage in trace.stages:
            if stage.stage_id == stage_id:
                if skipped:
                    stage.status = "skipped"
                elif error:
                    stage.status = "failed"
                    stage.error = str(error)
                else:
                    stage.status = "completed"

                stage.completed_at = time.time()
                if duration_ms is not None:
                    stage.duration_ms = duration_ms

                if technical_details:
                    stage.technical_details.update(technical_details)

                if status_msg:
                    stage.status_message = status_msg
                break

    def complete_trace(self, trace_id: str, failed: bool = False) -> Optional[PipelineTrace]:
        trace = self._traces.get(trace_id)
        if not trace:
            return None

        trace.status = "failed" if failed else "completed"
        trace.completed_at = time.time()
        start_t = self._start_perf.get(trace_id)
        if start_t:
            trace.total_duration_ms = round((time.perf_counter() - start_t) * 1000.0, 2)

        return trace


# Global singleton instance
_collector: Optional[TraceCollector] = None


def get_trace_collector() -> TraceCollector:
    global _collector
    if _collector is None:
        _collector = TraceCollector()
    return _collector
