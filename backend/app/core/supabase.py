from typing import Optional
from supabase import create_client, Client
from backend.app.core.config import settings


_supabase_client: Optional[Client] = None
_supabase_admin_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Get or create the public Supabase client using SUPABASE_PUBLISHABLE_KEY (or legacy SUPABASE_ANON_KEY).
    Respects Row Level Security according to the active token.
    """
    global _supabase_client
    if _supabase_client is None:
        key = settings.SUPABASE_PUBLISHABLE_KEY or settings.SUPABASE_ANON_KEY
        if not settings.SUPABASE_URL or not key:
            raise ValueError(
                "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
            )
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            key
        )
    return _supabase_client


def get_supabase_admin_client() -> Client:
    """
    Get or create the privileged Supabase admin client using SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY).
    Bypasses RLS. Strictly restricted to server-side administrative operations.
    """
    global _supabase_admin_client
    if _supabase_admin_client is None:
        key = (
            settings.SUPABASE_SECRET_KEY
            or settings.SUPABASE_SERVICE_ROLE_KEY
            or settings.SUPABASE_PUBLISHABLE_KEY
            or settings.SUPABASE_ANON_KEY
        )
        if not settings.SUPABASE_URL or not key:
            raise ValueError(
                "Supabase admin is not configured. Please set SUPABASE_URL and SUPABASE_SECRET_KEY."
            )
        _supabase_admin_client = create_client(
            settings.SUPABASE_URL,
            key
        )
    return _supabase_admin_client


def get_supabase_user_client(access_token: str) -> Client:
    """
    Create a Supabase client authenticated on behalf of a specific user.
    PostgREST queries sent through this client will execute with the user's JWT,
    enforcing database Row Level Security (RLS) policies.
    """
    key = settings.SUPABASE_PUBLISHABLE_KEY or settings.SUPABASE_ANON_KEY
    if not settings.SUPABASE_URL or not key:
        raise ValueError(
            "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
        )
    
    client = create_client(
        settings.SUPABASE_URL,
        key
    )
    if access_token:
        client.postgrest.auth(access_token)
    return client
