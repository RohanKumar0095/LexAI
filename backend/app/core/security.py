import os
import time
import json
import base64
import hashlib
import hmac
import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.user import User

logger = logging.getLogger(__name__)

AUTH_SECRET = os.environ.get("AUTH_SECRET", "lexai-india-secure-jwt-auth-secret-key-2026")


def hash_password(password: str) -> str:
    """Hashes password using PBKDF2-HMAC-SHA256 with 100,000 iterations."""
    salt = hashlib.sha256(AUTH_SECRET.encode()).hexdigest()[:16]
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}:{hashed.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored PBKDF2 hash string."""
    try:
        if ":" not in hashed_password:
            return False
        salt, expected_hash = hashed_password.split(":", 1)
        actual_hash = hashlib.pbkdf2_hmac(
            "sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000
        ).hex()
        return hmac.compare_digest(expected_hash, actual_hash)
    except Exception:
        return False


def create_token(user_id: str, email: str) -> str:
    """Generates a signed LexAI session token."""
    payload = f"{user_id}:{email}"
    sig = hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"lex_{user_id}_{sig[:32]}"


def decode_supabase_jwt(token: str, jwt_secret: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a Supabase JWT token.
    Validates token structure, expiration, and HS256 signature if secret is provided.
    """
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts

        padded_payload = payload_b64 + "=" * (-len(payload_b64) % 4)
        payload_bytes = base64.urlsafe_b64decode(padded_payload.encode("utf-8"))
        payload = json.loads(payload_bytes.decode("utf-8"))

        exp = payload.get("exp")
        if exp and time.time() > float(exp):
            logger.warning("Supabase JWT has expired")
            return None

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

        # 1. Supabase JWT (3 parts)
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

            user = db.query(User).filter(User.id == str(user_id)).first()
            if not user:
                user = db.query(User).filter(User.email == email.lower().strip()).first()

            if not user:
                user_meta = payload.get("user_metadata", {}) or {}
                full_name = user_meta.get("full_name") or email.split("@")[0]
                user = User(
                    id=str(user_id),
                    email=email.lower().strip(),
                    password_hash="supabase_managed_oauth",
                    full_name=full_name,
                    avatar_url=user_meta.get("avatar_url"),
                )
                db.add(user)
                try:
                    db.commit()
                    db.refresh(user)
                except Exception:
                    db.rollback()
                    user = db.query(User).filter(User.id == str(user_id)).first()

            return user

        # 2. Native LexAI token (lex_{user_id}_{sig})
        if clean_token.startswith("lex_"):
            parts = clean_token.split("_")
            if len(parts) < 3:
                return None
            user_id = parts[1]
            return db.query(User).filter(User.id == user_id).first()

        return None
    except Exception as e:
        logger.warning(f"Error decoding token: {e}")
        return None
