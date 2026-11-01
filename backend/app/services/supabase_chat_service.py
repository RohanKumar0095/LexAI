import logging
import time
import uuid
import json
import urllib.request
import urllib.error
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)


class SupabaseChatService:
    """
    Authoritative server-side service for managing user chat history in Supabase.
    - Validates Supabase auth tokens directly against the Supabase Auth server.
    - Executes conversation and message persistence via Supabase REST API using the backend service key.
    - Enforces strict user ownership on every read, write, update, and delete operation.
    """

    def __init__(self):
        settings = get_settings()
        self.url = (settings.SUPABASE_URL or "").rstrip("/")
        # In this project, SUPABASE_JWT_SECRET contains the project secret key (sb_secret_...)
        self.service_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_JWT_SECRET or ""
        # In-memory TTL cache for verified tokens: token_hash -> { user_id, email, expires_at }
        self._token_cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl_seconds = 300  # 5 minutes

    def is_configured(self) -> bool:
        return bool(self.url and self.service_key and not self.url.startswith("https://your-project"))

    def _get_headers(self, return_representation: bool = True) -> Dict[str, str]:
        headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
        }
        if return_representation:
            headers["Prefer"] = "return=representation"
        return headers

    def verify_token(self, authorization_header: Optional[str]) -> Optional[Dict[str, str]]:
        """
        Verifies the Supabase access token from the Authorization header.
        Queries Supabase Auth (/auth/v1/user) to validate the identity and extract the user's UUID.
        Cached in memory for 5 minutes to avoid redundant network roundtrips.
        """
        if not authorization_header or not self.is_configured():
            return None

        clean_token = authorization_header.replace("Bearer ", "").strip()
        if not clean_token or clean_token.count(".") != 2:
            return None

        now = time.time()
        # Check cache
        cache_entry = self._token_cache.get(clean_token)
        if cache_entry and cache_entry.get("expires_at", 0) > now:
            return {
                "user_id": cache_entry["user_id"],
                "email": cache_entry.get("email", ""),
            }

        # Query Supabase Auth endpoint
        auth_url = f"{self.url}/auth/v1/user"
        req = urllib.request.Request(
            auth_url,
            headers={
                "apikey": self.service_key,
                "Authorization": f"Bearer {clean_token}",
            },
            method="GET"
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                if res.status == 200:
                    user_data = json.loads(res.read().decode("utf-8"))
                    user_id = user_data.get("id")
                    email = user_data.get("email", "")
                    if user_id:
                        self._token_cache[clean_token] = {
                            "user_id": user_id,
                            "email": email,
                            "expires_at": now + self._cache_ttl_seconds,
                        }
                        return {"user_id": user_id, "email": email}
        except urllib.error.HTTPError as e:
            logger.warning(f"Supabase token verification rejected ({e.code}): {e.reason}")
        except Exception as e:
            logger.error(f"Error during Supabase token verification: {e}")

        return None

    def list_conversations(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all conversations belonging to the verified user_id,
        ordered by most recent activity (updated_at DESC).
        """
        if not self.is_configured() or not user_id:
            return []

        endpoint = (
            f"{self.url}/rest/v1/conversations"
            f"?user_id=eq.{user_id}&order=updated_at.desc&select=id,user_id,title,created_at,updated_at"
        )
        req = urllib.request.Request(endpoint, headers=self._get_headers(False), method="GET")

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                if res.status == 200:
                    return json.loads(res.read().decode("utf-8"))
        except Exception as e:
            logger.error(f"Failed to fetch conversations for user {user_id}: {e}")

        return []

    def get_conversation(self, user_id: str, conversation_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches a specific conversation with its messages for the authenticated user.
        Strictly enforces that conversations.user_id == user_id.
        Sorts messages chronologically by created_at.
        """
        if not self.is_configured() or not user_id or not conversation_id:
            return None

        endpoint = (
            f"{self.url}/rest/v1/conversations"
            f"?id=eq.{conversation_id}&user_id=eq.{user_id}&select=*,messages(*)"
        )
        req = urllib.request.Request(endpoint, headers=self._get_headers(False), method="GET")

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                if res.status == 200:
                    data = json.loads(res.read().decode("utf-8"))
                    if data and len(data) > 0:
                        conv = data[0]
                        # Sort embedded messages chronologically
                        if "messages" in conv and isinstance(conv["messages"], list):
                            conv["messages"].sort(key=lambda m: m.get("created_at") or "")
                        return conv
        except Exception as e:
            logger.error(f"Failed to fetch conversation {conversation_id} for user {user_id}: {e}")

        return None

    def create_or_get_conversation(
        self,
        user_id: str,
        title: str = "New Legal Inquiry",
        conversation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates a new conversation record in Supabase or returns an existing one if valid.
        Ensures the conversation is linked to the authenticated user's UUID.
        """
        if not self.is_configured() or not user_id:
            raise RuntimeError("Supabase chat persistence is not properly configured.")

        # If a conversation_id is provided, check if it already exists for this user
        if conversation_id:
            existing = self.get_conversation(user_id, conversation_id)
            if existing:
                return existing

        canonical_id = conversation_id if conversation_id and self._is_valid_uuid(conversation_id) else str(uuid.uuid4())
        now_iso = datetime.now(timezone.utc).isoformat()

        payload = {
            "id": canonical_id,
            "user_id": user_id,
            "title": title.strip() or "Legal Inquiry",
            "created_at": now_iso,
            "updated_at": now_iso
        }

        endpoint = f"{self.url}/rest/v1/conversations"
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers=self._get_headers(return_representation=True),
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                data = json.loads(res.read().decode("utf-8"))
                return data[0] if isinstance(data, list) and len(data) > 0 else payload
        except urllib.error.HTTPError as e:
            # If conflict on retry, fetch existing
            if e.code == 409:
                existing = self.get_conversation(user_id, canonical_id)
                if existing:
                    return existing
            logger.error(f"Failed to create conversation in Supabase: {e.code} {e.reason}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error creating conversation: {e}")
            raise

    def save_message(
        self,
        user_id: str,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
        message_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Saves a message (user or assistant) to Supabase under the specified conversation.
        Verifies that conversation_id belongs to user_id.
        Updates conversation's updated_at timestamp.
        """
        if not self.is_configured() or not user_id or not conversation_id:
            raise RuntimeError("Missing configuration or identifiers for message persistence.")

        # 1. Enforce ownership: Ensure conversation exists and belongs to this user
        conv = self.get_conversation(user_id, conversation_id)
        if not conv:
            raise PermissionError(f"Conversation {conversation_id} not found or not owned by user {user_id}")

        canonical_msg_id = message_id if message_id and self._is_valid_uuid(message_id) else str(uuid.uuid4())
        now_iso = datetime.now(timezone.utc).isoformat()

        payload = {
            "id": canonical_msg_id,
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "metadata": metadata or {},
            "created_at": now_iso
        }

        # Insert message
        msg_endpoint = f"{self.url}/rest/v1/messages"
        req = urllib.request.Request(
            msg_endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers=self._get_headers(return_representation=True),
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=5) as res:
            saved_data = json.loads(res.read().decode("utf-8"))
            saved_msg = saved_data[0] if isinstance(saved_data, list) and len(saved_data) > 0 else payload

        # Update conversation's updated_at timestamp
        try:
            update_endpoint = f"{self.url}/rest/v1/conversations?id=eq.{conversation_id}&user_id=eq.{user_id}"
            update_req = urllib.request.Request(
                update_endpoint,
                data=json.dumps({"updated_at": now_iso}).encode("utf-8"),
                headers=self._get_headers(return_representation=False),
                method="PATCH"
            )
            urllib.request.urlopen(update_req, timeout=3)
        except Exception as e:
            logger.warning(f"Failed to touch conversation updated_at: {e}")

        return saved_msg

    def update_conversation_title(self, user_id: str, conversation_id: str, title: str) -> Optional[Dict[str, Any]]:
        """
        Updates the title of a conversation owned by the authenticated user.
        """
        if not self.is_configured() or not user_id or not conversation_id:
            return None

        now_iso = datetime.now(timezone.utc).isoformat()
        payload = {
            "title": title.strip() or "Legal Inquiry",
            "updated_at": now_iso
        }

        endpoint = f"{self.url}/rest/v1/conversations?id=eq.{conversation_id}&user_id=eq.{user_id}"
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers=self._get_headers(return_representation=True),
            method="PATCH"
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                data = json.loads(res.read().decode("utf-8"))
                return data[0] if isinstance(data, list) and len(data) > 0 else None
        except Exception as e:
            logger.error(f"Failed to update conversation title: {e}")
            return None

    def delete_conversation(self, user_id: str, conversation_id: str) -> bool:
        """
        Deletes a conversation and all its associated messages (cascading).
        Strictly enforces that conversations.user_id == user_id.
        """
        if not self.is_configured() or not user_id or not conversation_id:
            return False

        endpoint = f"{self.url}/rest/v1/conversations?id=eq.{conversation_id}&user_id=eq.{user_id}"
        req = urllib.request.Request(
            endpoint,
            headers=self._get_headers(return_representation=True),
            method="DELETE"
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                data = json.loads(res.read().decode("utf-8"))
                return len(data) > 0
        except Exception as e:
            logger.error(f"Failed to delete conversation {conversation_id}: {e}")
            return False

    def clear_all_conversations(self, user_id: str) -> bool:
        """
        Deletes all conversations belonging to the authenticated user.
        """
        if not self.is_configured() or not user_id:
            return False

        endpoint = f"{self.url}/rest/v1/conversations?user_id=eq.{user_id}"
        req = urllib.request.Request(
            endpoint,
            headers=self._get_headers(return_representation=True),
            method="DELETE"
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                return res.status in (200, 204)
        except Exception as e:
            logger.error(f"Failed to clear conversations for user {user_id}: {e}")
            return False

    @staticmethod
    def _is_valid_uuid(val: str) -> bool:
        try:
            uuid.UUID(str(val))
            return True
        except (ValueError, AttributeError, TypeError):
            return False


_cached_supabase_chat_service: Optional[SupabaseChatService] = None


def get_supabase_chat_service() -> SupabaseChatService:
    global _cached_supabase_chat_service
    if _cached_supabase_chat_service is None:
        _cached_supabase_chat_service = SupabaseChatService()
    return _cached_supabase_chat_service
