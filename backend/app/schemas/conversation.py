from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ConversationCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=255, description="Title of the conversation")


class ConversationUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255, description="Updated title of the conversation")


class ConversationOut(BaseModel):
    id: UUID
    user_id: UUID
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ConversationListResponse(BaseModel):
    items: List[ConversationOut]
    total: int
    page: int
    page_size: int
    total_pages: int
