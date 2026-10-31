from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from backend.app.schemas.legal import LegalChunkMetadata


class LegalSource(BaseModel):
    evidence_id: Optional[str] = None  # e.g. "EVIDENCE_1"
    document_id: str
    chunk_id: str
    title: Optional[str] = None
    case_name: Optional[str] = None
    court: Optional[str] = None
    citation: Optional[str] = None
    judgment_date: Optional[str] = None
    section_reference: Optional[str] = None
    paragraph_reference: Optional[str] = None
    page_number: Optional[int] = None
    source_url: Optional[str] = None
    relevance_score: Optional[float] = None
    snippet: Optional[str] = None


class RetrievedChunk(BaseModel):
    chunk_id: str
    document_id: str
    chunk_text: str
    metadata: LegalChunkMetadata
    score: float = 0.0
    source_type: str = "hybrid"  # vector, keyword, hybrid, reranked


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Legal query or search term")
    top_k: int = Field(default=10, ge=1, le=50, description="Number of results to return")
    mode: str = Field(default="hybrid", description="Search mode: hybrid, vector, or keyword")


class SearchResponse(BaseModel):
    query: str
    count: int
    results: List[RetrievedChunk]


from enum import Enum


class EvidenceState(str, Enum):
    SUFFICIENT = "sufficient"
    PARTIAL = "partial"
    INSUFFICIENT = "insufficient"
    VALIDATION_FAILED = "validation_failed"


class KeyPointItem(BaseModel):
    text: str
    source_ids: List[str] = Field(default_factory=list)


class StructuredLegalAnswer(BaseModel):
    status: str = "supported"  # "supported", "partially_supported", "insufficient"
    summary: str = ""
    summary_source_ids: List[str] = Field(default_factory=list)
    key_points: List[KeyPointItem] = Field(default_factory=list)
    steps: List[KeyPointItem] = Field(default_factory=list)
    conditions: List[KeyPointItem] = Field(default_factory=list)
    exceptions: List[KeyPointItem] = Field(default_factory=list)
    important_notes: List[KeyPointItem] = Field(default_factory=list)
    unavailable_information: List[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Legal query or factual scenario")
    conversation_id: Optional[str] = Field(default=None, description="Optional conversation session ID")
    explain_mode: Optional[str] = Field(default="simple", description="Explanation mode: simple or detailed")
    trace_id: Optional[str] = Field(default=None, description="Optional client-generated or correlated telemetry trace ID")


class ChatResponse(BaseModel):
    query: str
    answer: str
    sources: List[LegalSource]
    retrieved_chunks: Optional[List[RetrievedChunk]] = None
    conversation_id: Optional[str] = None
    explain_mode: Optional[str] = "simple"
    trace_id: Optional[str] = None
    evidence_state: str = "sufficient"  # "sufficient", "partial", "insufficient"
    structured_answer: Optional[StructuredLegalAnswer] = None



class HealthResponse(BaseModel):
    status: str
    database_connected: bool
    chroma_connected: bool
    embedding_model_loaded: bool
    gemini_configured: bool
    details: Dict[str, Any] = {}

