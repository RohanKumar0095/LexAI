import pytest
from fastapi.testclient import TestClient


def test_user_a_cannot_read_or_modify_user_b_profile(client: TestClient, user_a, user_b):
    # Both users call /users/me with their own tokens and should only get their own profile
    res_a = client.get("/api/v1/users/me", headers=user_a["headers"])
    assert res_a.status_code == 200
    assert res_a.json()["id"] == user_a["id"]

    res_b = client.get("/api/v1/users/me", headers=user_b["headers"])
    assert res_b.status_code == 200
    assert res_b.json()["id"] == user_b["id"]
    assert res_b.json()["id"] != user_a["id"]

    # User A updates profile; verify User B's profile remains untouched
    client.patch(
        "/api/v1/users/me",
        json={"full_name": "Renamed Alpha"},
        headers=user_a["headers"]
    )
    verify_b = client.get("/api/v1/users/me", headers=user_b["headers"])
    assert verify_b.json()["full_name"] == "User Beta"


def test_user_a_cannot_access_user_b_conversations(client: TestClient, user_a, user_b):
    # User B creates a private conversation
    res_b = client.post(
        "/api/v1/conversations",
        json={"title": "User B Confidential Consultation"},
        headers=user_b["headers"]
    )
    assert res_b.status_code == 201
    conv_b_id = res_b.json()["id"]

    # User A tries to list conversations: should NOT contain User B's conversation
    list_a = client.get("/api/v1/conversations", headers=user_a["headers"])
    assert list_a.status_code == 200
    conv_ids_a = [c["id"] for c in list_a.json()["items"]]
    assert conv_b_id not in conv_ids_a

    # User A tries to GET User B's conversation directly: expect 404
    get_res = client.get(f"/api/v1/conversations/{conv_b_id}", headers=user_a["headers"])
    assert get_res.status_code == 404

    # User A tries to PATCH User B's conversation: expect 404
    patch_res = client.patch(
        f"/api/v1/conversations/{conv_b_id}",
        json={"title": "Hijacked Title"},
        headers=user_a["headers"]
    )
    assert patch_res.status_code == 404

    # User A tries to DELETE User B's conversation: expect 404
    del_res = client.delete(f"/api/v1/conversations/{conv_b_id}", headers=user_a["headers"])
    assert del_res.status_code == 404

    # Verify User B can still access their conversation unchanged
    verify_b = client.get(f"/api/v1/conversations/{conv_b_id}", headers=user_b["headers"])
    assert verify_b.status_code == 200
    assert verify_b.json()["title"] == "User B Confidential Consultation"


def test_user_a_cannot_access_or_send_messages_in_user_b_conversation(client: TestClient, user_a, user_b):
    # User B creates conversation and message
    conv_res = client.post(
        "/api/v1/conversations",
        json={"title": "User B Case Details"},
        headers=user_b["headers"]
    )
    conv_b_id = conv_res.json()["id"]

    msg_b = client.post(
        f"/api/v1/conversations/{conv_b_id}/messages",
        json={"role": "user", "content": "Sensitive User B evidence statement"},
        headers=user_b["headers"]
    )
    assert msg_b.status_code == 201

    # User A tries to read messages in User B's conversation: expect 404
    get_msgs_a = client.get(f"/api/v1/conversations/{conv_b_id}/messages", headers=user_a["headers"])
    assert get_msgs_a.status_code == 404

    # User A tries to post a message into User B's conversation: expect 404
    post_msg_a = client.post(
        f"/api/v1/conversations/{conv_b_id}/messages",
        json={"role": "user", "content": "Unauthorized injection attempt"},
        headers=user_a["headers"]
    )
    assert post_msg_a.status_code == 404


def test_user_a_cannot_access_or_delete_user_b_search_history(client: TestClient, user_a, user_b):
    # User B records a search
    search_b = client.post(
        "/api/v1/search-history",
        json={"query": "Confidential corporate tax fraud precedents"},
        headers=user_b["headers"]
    )
    search_b_id = search_b.json()["id"]

    # User A lists search history: must NOT see User B's search
    list_a = client.get("/api/v1/search-history", headers=user_a["headers"])
    assert list_a.status_code == 200
    assert search_b_id not in [s["id"] for s in list_a.json()["items"]]

    # User A tries to get User B's search item directly: expect 404
    get_a = client.get(f"/api/v1/search-history/{search_b_id}", headers=user_a["headers"])
    assert get_a.status_code == 404

    # User A tries to delete User B's search item: expect 404
    del_a = client.delete(f"/api/v1/search-history/{search_b_id}", headers=user_a["headers"])
    assert del_a.status_code == 404

    # User A deletes all their own searches: User B's searches must still exist
    client.delete("/api/v1/search-history", headers=user_a["headers"])
    list_b = client.get("/api/v1/search-history", headers=user_b["headers"])
    assert list_b.status_code == 200
    assert len(list_b.json()["items"]) == 1
    assert list_b.json()["items"][0]["id"] == search_b_id


def test_user_a_cannot_access_or_modify_user_b_memories(client: TestClient, user_a, user_b):
    # User B creates a memory
    mem_b = client.post(
        "/api/v1/memories",
        json={"content": "Private User B legal history fact", "memory_type": "sensitive"},
        headers=user_b["headers"]
    )
    mem_b_id = mem_b.json()["id"]

    # User A lists memories: must not see User B's memory
    list_a = client.get("/api/v1/memories", headers=user_a["headers"])
    assert list_a.status_code == 200
    assert mem_b_id not in [m["id"] for m in list_a.json()["items"]]

    # User A tries to modify User B's memory: expect 404
    patch_a = client.patch(
        f"/api/v1/memories/{mem_b_id}",
        json={"content": "Corrupted memory"},
        headers=user_a["headers"]
    )
    assert patch_a.status_code == 404

    # User A tries to delete User B's memory: expect 404
    del_a = client.delete(f"/api/v1/memories/{mem_b_id}", headers=user_a["headers"])
    assert del_a.status_code == 404

    # User A deletes all own memories: User B's memory remains intact
    client.delete("/api/v1/memories", headers=user_a["headers"])
    list_b = client.get("/api/v1/memories", headers=user_b["headers"])
    assert list_b.status_code == 200
    assert len(list_b.json()["items"]) == 1
    assert list_b.json()["items"][0]["id"] == mem_b_id
