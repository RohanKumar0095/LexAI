from typing import Optional
from pydantic import BaseModel, Field


class SignUpRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password (min 6 characters)")
    full_name: Optional[str] = Field(None, max_length=150, description="Full name")


class LoginRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserOut(BaseModel):
    id: str
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
