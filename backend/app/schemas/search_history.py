from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class SearchHistoryCreate(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="Search query text")
    conversation_id: Optional[UUID] = Field(None, description="Optional associated conversation ID")


class SearchHistoryOut(BaseModel):
    id: UUID
    user_id: UUID
    conversation_id: Optional[UUID] = None
    query: str
    created_at: datetime


class SearchHistoryListResponse(BaseModel):
    items: List[SearchHistoryOut]
    total: int
    page: int
    page_size: int
    total_pages: int
