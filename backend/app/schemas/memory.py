from uuid import UUID
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class MemoryCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000, description="Memory content")
    memory_type: Optional[str] = Field(None, max_length=100, description="Category/type of memory (e.g., preference, factual, case_detail)")
    source_conversation_id: Optional[UUID] = Field(None, description="Originating conversation ID if applicable")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context metadata")
    is_active: bool = Field(True, description="Whether this memory is active")


class MemoryUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=10000, description="Updated memory content")
    memory_type: Optional[str] = Field(None, max_length=100, description="Updated category/type")
    is_active: Optional[bool] = Field(None, description="Activate or deactivate memory")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Updated metadata")


class MemoryOut(BaseModel):
    id: UUID
    user_id: UUID
    memory_type: Optional[str] = None
    content: str
    source_conversation_id: Optional[UUID] = None
    metadata: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class MemoryListResponse(BaseModel):
    items: List[MemoryOut]
    total: int
    page: int
    page_size: int
    total_pages: int
