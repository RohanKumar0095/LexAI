from uuid import UUID
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class MessageCreate(BaseModel):
    role: MessageRole = Field(..., description="Role of the message sender (user, assistant, system)")
    content: str = Field(..., min_length=1, max_length=50000, description="Message text content")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary metadata (citations, tokens, etc.)")


class MessageOut(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime


class MessageListResponse(BaseModel):
    items: List[MessageOut]
    total: int
    page: int
    page_size: int
    total_pages: int
