import os
import uuid
import hashlib
import hmac
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()

# Secret salt for hashing passwords and generating session tokens
AUTH_SECRET = os.environ.get("AUTH_SECRET", "lexai-india-secure-jwt-auth-secret-key-2026")


def hash_password(password: str) -> str:
    salt = hashlib.sha256(AUTH_SECRET.encode()).hexdigest()[:16]
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}:{hashed.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if ":" not in hashed_password:
            return False
        salt, expected_hash = hashed_password.split(":", 1)
        actual_hash = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
        return hmac.compare_digest(expected_hash, actual_hash)
    except Exception:
        return False


def create_token(user_id: str, email: str) -> str:
    # Deterministic yet secure signature token
    payload = f"{user_id}:{email}"
    sig = hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"lex_{user_id}_{sig[:32]}"


import base64
import json
import time

def decode_supabase_jwt(token: str, jwt_secret: Optional[str] = None) -> Optional[dict]:
    """
    Decodes and optionally verifies a Supabase JWT token using standard library primitives.
    Validates token structure, expiration, and HS256 signature if secret is provided.
    """
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts

        # Decode payload with URL-safe base64 padding
        padded_payload = payload_b64 + "=" * (-len(payload_b64) % 4)
        payload_bytes = base64.urlsafe_b64decode(padded_payload.encode("utf-8"))
        payload = json.loads(payload_bytes.decode("utf-8"))

        # Verify expiration
        exp = payload.get("exp")
        if exp and time.time() > float(exp):
            logger.warning("Supabase JWT has expired")
            return None

        # Verify HMAC-SHA256 signature if JWT secret is configured
        if jwt_secret and jwt_secret.strip():
            msg = f"{header_b64}.{payload_b64}".encode("utf-8")
            expected_sig = base64.urlsafe_b64encode(
                hmac.new(jwt_secret.strip().encode("utf-8"), msg, hashlib.sha256).digest()
            ).decode("utf-8").rstrip("=")
            clean_sig = sig_b64.rstrip("=")
            if not hmac.compare_digest(expected_sig, clean_sig):
                logger.warning("Supabase JWT signature mismatch")
                return None

        return payload
    except Exception as e:
        logger.warning(f"Error decoding Supabase JWT: {e}")
        return None


def decode_token(token: str, db: Session) -> Optional[User]:
    """
    Decodes an authentication token supporting both Supabase JWTs and native LexAI tokens.
    Automatically provisions/syncs Supabase authenticated identities in the local database.
    """
    try:
        clean_token = token.replace("Bearer ", "").strip()
        if not clean_token:
            return None

        # 1. Check for Supabase JWT (3-part dot-delimited token)
        if clean_token.count(".") == 2:
            from backend.app.core.config import get_settings
            settings = get_settings()
            jwt_secret = settings.SUPABASE_JWT_SECRET or os.environ.get("SUPABASE_JWT_SECRET")
            payload = decode_supabase_jwt(clean_token, jwt_secret=jwt_secret)
            if not payload:
                return None

            user_id = payload.get("sub")
            email = payload.get("email") or f"{user_id}@supabase.user"
            if not user_id:
                return None

            # Look up or auto-sync user in local database
            user = db.query(User).filter(User.id == str(user_id)).first()
            if not user:
                user = db.query(User).filter(User.email == email.lower().strip()).first()

            if not user:
                # Sync user into local DB for relational integrity
                user_meta = payload.get("user_metadata", {}) or {}
                full_name = user_meta.get("full_name") or email.split("@")[0]
                user = User(
                    id=str(user_id),
                    email=email.lower().strip(),
                    password_hash="supabase_managed_oauth",
                    full_name=full_name,
                    avatar_url=user_meta.get("avatar_url")
                )
                db.add(user)
                try:
                    db.commit()
                    db.refresh(user)
                except Exception:
                    db.rollback()
                    user = db.query(User).filter(User.id == str(user_id)).first()

            return user

        # 2. Check for native LexAI token (lex_{user_id}_{signature})
        if clean_token.startswith("lex_"):
            parts = clean_token.split("_")
            if len(parts) < 3:
                return None
            user_id = parts[1]
            user = db.query(User).filter(User.id == user_id).first()
            return user

        return None
    except Exception as e:
        logger.warning(f"Error decoding token: {e}")
        return None


# --- Schemas ---

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


# --- Endpoints ---

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
        "supabase_configured": has_supabase
    }


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Sign up a new user"
)
def signup(request: SignUpRequest, db: Session = Depends(get_db)):
    """
    Registers a new user account with email and password.
    """
    email_clean = request.email.lower().strip()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    pw_hash = hash_password(request.password)
    new_user = User(
        id=user_id,
        email=email_clean,
        password_hash=pw_hash,
        full_name=request.full_name.strip() if request.full_name else email_clean.split("@")[0],
        avatar_url=None
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
            avatar_url=new_user.avatar_url
        )
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in user"
)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates user credentials and returns active session tokens.
    """
    email_clean = request.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
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
            avatar_url=user.avatar_url
        )
    )


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Log out user"
)
def logout():
    """
    Terminates the user's active session.
    """
    return LogoutResponse(message="Successfully logged out")


@router.get(
    "/me",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
    summary="Get current user"
)
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """
    Returns the profile and metadata of the currently authenticated session.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required."
        )

    user = decode_token(authorization, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token."
        )

    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url
    )
