from uuid import UUID
from typing import Optional
from fastapi import HTTPException, status
from backend.app.core.supabase import get_supabase_client, get_supabase_user_client
from backend.app.schemas.auth import SignUpRequest, LoginRequest, AuthResponse, UserOut, LogoutResponse


class AuthService:
    @staticmethod
    def sign_up(request: SignUpRequest) -> AuthResponse:
        supabase = get_supabase_client()
        try:
            credentials = {
                "email": request.email,
                "password": request.password,
            }
            if request.full_name:
                credentials["options"] = {
                    "data": {
                        "full_name": request.full_name,
                        "name": request.full_name,
                    }
                }
            
            response = supabase.auth.sign_up(credentials)
            
            if not response or not response.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to register user. Please verify input data."
                )
            
            user = response.user
            session = response.session
            access_token = session.access_token if session else ""
            refresh_token = session.refresh_token if session else None
            
            user_meta = user.user_metadata or {}
            full_name = user_meta.get("full_name") or user_meta.get("name") or request.full_name
            
            return AuthResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                user=UserOut(
                    id=UUID(user.id),
                    email=user.email or request.email,
                    full_name=full_name,
                    avatar_url=user_meta.get("avatar_url")
                )
            )
        except HTTPException:
            raise
        except Exception as e:
            error_msg = str(e)
            error_code = getattr(e, "code", None) or ""
            error_status = getattr(e, "status", None) or 400

            if "already registered" in error_msg.lower() or "user already exists" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A user with this email address already exists."
                )
            if error_code in ("over_email_send_rate_limit", "over_request_rate_limit") or "rate limit" in error_msg.lower() or error_status == 429:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many registration attempts. Please wait a moment and try again."
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sign up failed: {error_msg}"
            )

    @staticmethod
    def login(request: LoginRequest) -> AuthResponse:
        supabase = get_supabase_client()
        try:
            response = supabase.auth.sign_in_with_password({
                "email": request.email,
                "password": request.password
            })
            
            if not response or not response.user or not response.session:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password."
                )
            
            user = response.user
            session = response.session
            user_meta = user.user_metadata or {}
            
            return AuthResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                token_type="bearer",
                user=UserOut(
                    id=UUID(user.id),
                    email=user.email or request.email,
                    full_name=user_meta.get("full_name") or user_meta.get("name"),
                    avatar_url=user_meta.get("avatar_url")
                )
            )
        except HTTPException:
            raise
        except Exception as e:
            error_msg = str(e)
            error_code = getattr(e, "code", None) or ""
            error_status = getattr(e, "status", None) or 401

            # Distinguish specific authentication error cases accurately
            if error_code == "email_not_confirmed" or "email not confirmed" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email address has not been confirmed. Please verify your email before signing in."
                )
            elif (
                error_code in ("over_email_send_rate_limit", "over_request_rate_limit")
                or "rate limit" in error_msg.lower()
                or error_status == 429
            ):
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many login attempts. Please wait a moment and try again."
                )
            elif (
                error_code == "invalid_credentials"
                or "invalid login credentials" in error_msg.lower()
                or "invalid email or password" in error_msg.lower()
            ):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password."
                )

    @staticmethod
    def logout(token: Optional[str] = None) -> LogoutResponse:
        try:
            if token:
                user_client = get_supabase_user_client(token)
                try:
                    user_client.auth.sign_out()
                except Exception:
                    pass
            return LogoutResponse(message="Successfully logged out")
        except Exception:
            return LogoutResponse(message="Successfully logged out")
