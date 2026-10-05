from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class LegalDocumentBase(BaseModel):
    title: str
    document_type: str = "judgment"
    source: str = "Supreme Court of India"
    source_url: Optional[str] = None
    court: Optional[str] = None
    case_name: Optional[str] = None
    citation: Optional[str] = None
    judgment_date: Optional[str] = None
    jurisdiction: str = "India"
    language: str = "en"


class LegalDocumentCreate(LegalDocumentBase):
    id: str


class LegalDocumentRead(LegalDocumentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LegalChunkMetadata(BaseModel):
    document_id: str
    chunk_id: str
    chunk_index: int
    case_name: Optional[str] = None
    court: Optional[str] = None
    judgment_date: Optional[str] = None
    citation: Optional[str] = None
    section_reference: Optional[str] = None
    paragraph_reference: Optional[str] = None
    document_type: str = "judgment"
    source_url: Optional[str] = None
    page_number: Optional[int] = None
    extra: Optional[Dict[str, Any]] = None


class LegalChunkCreate(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    chunk_text: str
    section_reference: Optional[str] = None
    paragraph_reference: Optional[str] = None
    chunk_type: str = "body"
    metadata: LegalChunkMetadata


class LegalChunkRead(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    chunk_text: str
    section_reference: Optional[str] = None
    paragraph_reference: Optional[str] = None
    chunk_type: str
    metadata_json: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentClause(BaseModel):
    title: str
    text: str
    page: Optional[int] = 1


class DocumentTerm(BaseModel):
    term: str
    meaning: str


class DocumentRiskFlag(BaseModel):
    title: str
    severity: str  # low, medium, high
    description: str


class DocumentAnalysisResponse(BaseModel):
    summary: str
    clauses: List[DocumentClause]
    terms: List[DocumentTerm]
    riskFlags: List[DocumentRiskFlag]


class DocumentAnalyzeRequest(BaseModel):
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    text_content: Optional[str] = None
