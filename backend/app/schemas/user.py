from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProfileOut(BaseModel):
    id: UUID
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=150, description="Full name")
    avatar_url: Optional[str] = Field(None, max_length=500, description="Avatar image URL")
