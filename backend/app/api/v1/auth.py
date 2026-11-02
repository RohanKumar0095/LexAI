import os
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.core.security import (
    hash_password,
    verify_password,
    create_token,
    decode_supabase_jwt,
    decode_token,
)
from backend.app.schemas.auth import (
    SignUpRequest,
    LoginRequest,
    UserOut,
    AuthResponse,
    LogoutResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Re-exports for backward compatibility
__all__ = [
    "router",
    "hash_password",
    "verify_password",
    "create_token",
    "decode_supabase_jwt",
    "decode_token",
    "SignUpRequest",
    "LoginRequest",
    "UserOut",
    "AuthResponse",
    "LogoutResponse",
]


@router.get("/status", summary="Check auth service status")
def auth_status():
    """
    Returns auth configuration status supporting Supabase and standard authentication.
    """
    from backend.app.core.config import get_settings
    settings = get_settings()
    has_supabase = bool(settings.SUPABASE_URL or os.environ.get("SUPABASE_URL"))
    return {
        "status": "auth_ready",
        "auth_type": "supabase" if has_supabase else "standard",
        "supabase_configured": has_supabase,
    }


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Sign up a new user",
)
def signup(request: SignUpRequest, db: Session = Depends(get_db)):
    """Registers a new user account with email and password."""
    email_clean = request.email.lower().strip()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists.",
        )

    user_id = str(uuid.uuid4())
    pw_hash = hash_password(request.password)
    new_user = User(
        id=user_id,
        email=email_clean,
        password_hash=pw_hash,
        full_name=request.full_name.strip() if request.full_name else email_clean.split("@")[0],
        avatar_url=None,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token(user_id, email_clean)
    return AuthResponse(
        access_token=token,
        refresh_token=token,
        token_type="bearer",
        user=UserOut(
            id=new_user.id,
            email=new_user.email,
            full_name=new_user.full_name,
            avatar_url=new_user.avatar_url,
        ),
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in user",
)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates user credentials and returns active session tokens."""
    email_clean = request.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_token(user.id, user.email)
    return AuthResponse(
        access_token=token,
        refresh_token=token,
        token_type="bearer",
        user=UserOut(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
        ),
    )


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Log out user",
)
def logout():
    """Terminates the user's active session."""
    return LogoutResponse(message="Successfully logged out")


@router.get(
    "/me",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
)
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Returns the profile and metadata of the currently authenticated session."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required.",
        )

    user = decode_token(authorization, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
        )

    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
    )
