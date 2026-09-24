import pytest
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import Depends
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.security import (
    get_current_user,
    get_user_db_client,
    AuthenticatedUser,
)
from backend.app.core.supabase import (
    get_supabase_client,
    get_supabase_user_client,
    get_supabase_admin_client,
)


class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.profiles: Dict[str, Dict[str, Any]] = {}
        self.conversations: Dict[str, Dict[str, Any]] = {}
        self.messages: Dict[str, Dict[str, Any]] = {}
        self.search_history: Dict[str, Dict[str, Any]] = {}
        self.user_memories: Dict[str, Dict[str, Any]] = {}

    def clear(self):
        self.users.clear()
        self.profiles.clear()
        self.conversations.clear()
        self.messages.clear()
        self.search_history.clear()
        self.user_memories.clear()


test_db = InMemoryDatabase()


def get_utc_now_iso():
    return datetime.now(timezone.utc).isoformat()


class MockQueryBuilder:
    def __init__(self, table_name: str, db: InMemoryDatabase, user_token: Optional[str] = None):
        self.table_name = table_name
        self.db = db
        self.user_token = user_token
        self.filters: List[tuple] = []
        self._order_by: Optional[str] = None
        self._desc: bool = False
        self._range: Optional[tuple] = None
        self._count_exact: bool = False
        self._action: str = "select"
        self._payload: Any = None
        self._is_maybe_single: bool = False

    def select(self, columns: str = "*", count: Optional[str] = None):
        self._action = "select"
        if count == "exact":
            self._count_exact = True
        return self

    def insert(self, payload: Any):
        self._action = "insert"
        self._payload = payload
        return self

    def update(self, payload: Any):
        self._action = "update"
        self._payload = payload
        return self

    def delete(self):
        self._action = "delete"
        return self

    def eq(self, column: str, value: Any):
        self.filters.append((column, str(value)))
        return self

    def order(self, column: str, desc: bool = False):
        self._order_by = column
        self._desc = desc
        return self

    def range(self, start: int, end: int):
        self._range = (start, end)
        return self

    def maybe_single(self):
        self._is_maybe_single = True
        return self

    def execute(self):
        table = getattr(self.db, self.table_name)
        
        if self._action == "insert":
            payloads = self._payload if isinstance(self._payload, list) else [self._payload]
            inserted = []
            now = get_utc_now_iso()
            for p in payloads:
                item_id = p.get("id") or str(uuid.uuid4())
                row = {
                    "id": item_id,
                    "created_at": p.get("created_at") or now,
                    "updated_at": p.get("updated_at") or now,
                    **p
                }
                table[item_id] = row
                inserted.append(row)
            return type("Response", (), {"data": inserted, "count": len(inserted)})()

        elif self._action == "select":
            results = list(table.values())
            for col, val in self.filters:
                results = [r for r in results if str(r.get(col, "")) == str(val)]
                
            if self._order_by:
                results = sorted(
                    results,
                    key=lambda x: str(x.get(self._order_by, "")),
                    reverse=self._desc
                )
                
            total_count = len(results)
            
            if self._range:
                start, end = self._range
                results = results[start:end + 1]
                
            if self._is_maybe_single:
                data = results[0] if results else None
                return type("Response", (), {"data": data, "count": 1 if data else 0})()
                
            return type("Response", (), {"data": results, "count": total_count if self._count_exact else None})()

        elif self._action == "update":
            matching_ids = []
            for item_id, row in list(table.items()):
                matches = True
                for col, val in self.filters:
                    if str(row.get(col, "")) != str(val):
                        matches = False
                        break
                if matches:
                    matching_ids.append(item_id)
                    
            updated = []
            now = get_utc_now_iso()
            for item_id in matching_ids:
                table[item_id].update(self._payload)
                if "updated_at" not in self._payload and "updated_at" in table[item_id]:
                    table[item_id]["updated_at"] = now
                updated.append(table[item_id])
                
            return type("Response", (), {"data": updated, "count": len(updated)})()

        elif self._action == "delete":
            matching_ids = []
            for item_id, row in list(table.items()):
                matches = True
                for col, val in self.filters:
                    if str(row.get(col, "")) != str(val):
                        matches = False
                        break
                if matches:
                    matching_ids.append(item_id)
            for item_id in matching_ids:
                del table[item_id]
            return type("Response", (), {"data": None, "count": len(matching_ids)})()


class MockAuth:
    def __init__(self, db: InMemoryDatabase):
        self.db = db

    def sign_up(self, credentials: dict):
        email = credentials.get("email")
        password = credentials.get("password")
        options = credentials.get("options", {})
        data = options.get("data", {})
        
        for user in self.db.users.values():
            if user["email"] == email:
                raise Exception("User already registered")
                
        user_id = str(uuid.uuid4())
        token = f"test-jwt-token-{user_id}"
        user_obj = {
            "id": user_id,
            "email": email,
            "password": password,
            "user_metadata": data
        }
        self.db.users[token] = user_obj
        
        # Profile creation trigger simulation
        self.db.profiles[user_id] = {
            "id": user_id,
            "full_name": data.get("full_name") or data.get("name"),
            "avatar_url": data.get("avatar_url"),
            "created_at": get_utc_now_iso(),
            "updated_at": get_utc_now_iso(),
        }
        
        user_wrapper = type("User", (), {
            "id": user_id,
            "email": email,
            "user_metadata": data
        })()
        session_wrapper = type("Session", (), {
            "access_token": token,
            "refresh_token": f"test-refresh-{user_id}"
        })()
        
        return type("AuthResponse", (), {"user": user_wrapper, "session": session_wrapper})()

    def sign_in_with_password(self, credentials: dict):
        email = credentials.get("email")
        password = credentials.get("password")
        
        for token, user in self.db.users.items():
            if user["email"] == email and user["password"] == password:
                user_wrapper = type("User", (), {
                    "id": user["id"],
                    "email": user["email"],
                    "user_metadata": user["user_metadata"]
                })()
                session_wrapper = type("Session", (), {
                    "access_token": token,
                    "refresh_token": f"test-refresh-{user['id']}"
                })()
                return type("AuthResponse", (), {"user": user_wrapper, "session": session_wrapper})()
                
        raise Exception("Invalid email or password")

    def get_user(self, token: str):
        user = self.db.users.get(token)
        if not user:
            raise Exception("Invalid token")
        user_wrapper = type("User", (), {
            "id": user["id"],
            "email": user["email"],
            "user_metadata": user["user_metadata"]
        })()
        return type("UserResponse", (), {"user": user_wrapper})()

    def sign_out(self):
        return True


class MockSupabaseClient:
    def __init__(self, db: InMemoryDatabase, user_token: Optional[str] = None):
        self.db = db
        self.user_token = user_token
        self.auth = MockAuth(db)

    def table(self, name: str):
        return MockQueryBuilder(name, self.db, self.user_token)


@pytest.fixture(autouse=True)
def setup_mock_supabase(monkeypatch):
    test_db.clear()
    
    mock_client = MockSupabaseClient(test_db)
    
    def override_get_supabase_client():
        return mock_client

    def override_get_supabase_admin_client():
        return mock_client

    def override_get_user_db_client(current_user: AuthenticatedUser = Depends(get_current_user)):
        return MockSupabaseClient(test_db, user_token=current_user.token if current_user else None)

    monkeypatch.setattr("backend.app.core.supabase.get_supabase_client", override_get_supabase_client)
    monkeypatch.setattr("backend.app.core.supabase.get_supabase_admin_client", override_get_supabase_admin_client)
    monkeypatch.setattr("backend.app.core.supabase.get_supabase_user_client", lambda token: MockSupabaseClient(test_db, user_token=token))
    monkeypatch.setattr("backend.app.core.security.get_supabase_client", override_get_supabase_client)
    monkeypatch.setattr("backend.app.services.auth_service.get_supabase_client", override_get_supabase_client)

    app.dependency_overrides[get_supabase_client] = override_get_supabase_client
    app.dependency_overrides[get_user_db_client] = override_get_user_db_client

    yield

    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def user_a_data():
    return {
        "email": "user_a@example.com",
        "password": "Password123!",
        "full_name": "User Alpha"
    }


@pytest.fixture
def user_b_data():
    return {
        "email": "user_b@example.com",
        "password": "Password123!",
        "full_name": "User Beta"
    }


@pytest.fixture
def user_a(client, user_a_data):
    res = client.post("/api/v1/auth/signup", json=user_a_data)
    assert res.status_code == 201
    data = res.json()
    token = data["access_token"]
    user_id = data["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}
    return {"token": token, "id": user_id, "headers": headers, "email": user_a_data["email"]}


@pytest.fixture
def user_b(client, user_b_data):
    res = client.post("/api/v1/auth/signup", json=user_b_data)
    assert res.status_code == 201
    data = res.json()
    token = data["access_token"]
    user_id = data["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}
    return {"token": token, "id": user_id, "headers": headers, "email": user_b_data["email"]}
