from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="User password (min 6 characters)")
    full_name: Optional[str] = Field(None, max_length=150, description="Full name of the user")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., description="User password")


class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: UserOut


class LogoutResponse(BaseModel):
    message: str = "Successfully logged out"
