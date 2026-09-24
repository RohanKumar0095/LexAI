from uuid import UUID
from typing import Optional, Dict, Any
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from backend.app.core.supabase import get_supabase_client, get_supabase_user_client


security = HTTPBearer(auto_error=False)


class AuthenticatedUser(BaseModel):
    id: UUID
    email: str
    user_metadata: Dict[str, Any] = {}
    token: str


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> AuthenticatedUser:
    """
    FastAPI dependency to extract and validate the Supabase JWT token.
    Resolves the authenticated user identity via Supabase Auth.
    Rejects unauthenticated requests with HTTP 401.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    try:
        supabase = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token or expired session",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user = user_response.user
        return AuthenticatedUser(
            id=UUID(user.id),
            email=user.email or "",
            user_metadata=user.user_metadata or {},
            token=token
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[AuthenticatedUser]:
    """
    Optional authentication dependency. Returns None if unauthenticated.
    """
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None


def get_user_db_client(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> Client:
    """
    FastAPI dependency that returns an authenticated Supabase client for the current user.
    """
    return get_supabase_user_client(current_user.token)
