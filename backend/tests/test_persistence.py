import pytest
from fastapi.testclient import TestClient


def test_full_lifecycle_and_data_persistence(client: TestClient):
    # 1. User signs up
    signup_payload = {
        "email": "lifecycle.user@lexai.in",
        "password": "SecurePassword123!",
        "full_name": "Lifecycle Tester"
    }
    signup_res = client.post("/api/v1/auth/signup", json=signup_payload)
    assert signup_res.status_code == 201

    # 2. User logs in
    login_res = client.post("/api/v1/auth/login", json={
        "email": signup_payload["email"],
        "password": signup_payload["password"]
    })
    assert login_res.status_code == 200
    token1 = login_res.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # 3. Create conversation
    conv_res = client.post(
        "/api/v1/conversations",
        json={"title": "Persistent Property Dispute"},
        headers=headers1
    )
    assert conv_res.status_code == 201
    conv_id = conv_res.json()["id"]

    # 4. Create messages in conversation
    msg_res = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={"role": "user", "content": "What are tenant rights against unlawful eviction in Delhi?"},
        headers=headers1
    )
    assert msg_res.status_code == 201
    msg_id = msg_res.json()["id"]

    # 5. Create search history
    search_res = client.post(
        "/api/v1/search-history",
        json={"query": "Delhi Rent Control Act eviction grounds", "conversation_id": conv_id},
        headers=headers1
    )
    assert search_res.status_code == 201
    search_id = search_res.json()["id"]

    # 6. Create memory
    mem_res = client.post(
        "/api/v1/memories",
        json={
            "content": "Tenant has 11-month registered lease agreement expiring in Nov 2026",
            "memory_type": "lease_fact",
            "source_conversation_id": conv_id
        },
        headers=headers1
    )
    assert mem_res.status_code == 201
    mem_id = mem_res.json()["id"]

    # 7. User logs out
    logout_res = client.post("/api/v1/auth/logout", headers=headers1)
    assert logout_res.status_code == 200

    # 8. User logs in again (new session)
    relogin_res = client.post("/api/v1/auth/login", json={
        "email": signup_payload["email"],
        "password": signup_payload["password"]
    })
    assert relogin_res.status_code == 200
    token2 = relogin_res.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # 9. Verify all previously stored data still exists and is accessible
    # Check Profile
    profile_res = client.get("/api/v1/users/me", headers=headers2)
    assert profile_res.status_code == 200
    assert profile_res.json()["full_name"] == "Lifecycle Tester"

    # Check Conversation
    get_conv = client.get(f"/api/v1/conversations/{conv_id}", headers=headers2)
    assert get_conv.status_code == 200
    assert get_conv.json()["title"] == "Persistent Property Dispute"

    # Check Messages
    get_msgs = client.get(f"/api/v1/conversations/{conv_id}/messages", headers=headers2)
    assert get_msgs.status_code == 200
    assert get_msgs.json()["total"] == 1
    assert get_msgs.json()["items"][0]["id"] == msg_id

    # Check Search History
    get_searches = client.get("/api/v1/search-history", headers=headers2)
    assert get_searches.status_code == 200
    assert get_searches.json()["total"] == 1
    assert get_searches.json()["items"][0]["id"] == search_id

    # Check Memories
    get_memories = client.get("/api/v1/memories", headers=headers2)
    assert get_memories.status_code == 200
    assert get_memories.json()["total"] == 1
    assert get_memories.json()["items"][0]["id"] == mem_id
