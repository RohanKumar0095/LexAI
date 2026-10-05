from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from backend.app.schemas.legal import LegalChunkMetadata


class LegalSource(BaseModel):
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


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Legal query or factual scenario")
    conversation_id: Optional[str] = Field(default=None, description="Optional conversation session ID")
    explain_mode: Optional[str] = Field(default="simple", description="Explanation mode: simple, detailed, case-analysis, technical")


class ChatResponse(BaseModel):
    query: str
    answer: str
    sources: List[LegalSource]
    retrieved_chunks: Optional[List[RetrievedChunk]] = None
    conversation_id: Optional[str] = None
    explain_mode: Optional[str] = "simple"


class HealthResponse(BaseModel):
    status: str
    database_connected: bool
    chroma_connected: bool
    embedding_model_loaded: bool
    gemini_configured: bool
    details: Dict[str, Any] = {}
