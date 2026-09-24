import pytest
from fastapi.testclient import TestClient


def test_create_memory(client: TestClient, user_a):
    payload = {
        "content": "User prefers brief legal summaries in bullet points.",
        "memory_type": "user_preference",
        "is_active": True,
        "metadata": {"source": "onboarding"}
    }
    response = client.post("/api/v1/memories", json=payload, headers=user_a["headers"])
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == user_a["id"]
    assert data["content"] == payload["content"]
    assert data["memory_type"] == "user_preference"
    assert data["is_active"] is True


def test_list_memories_and_filter(client: TestClient, user_a):
    # Active memory
    client.post(
        "/api/v1/memories",
        json={"content": "Active fact: Owns residential property in Maharashtra", "is_active": True},
        headers=user_a["headers"]
    )
    # Inactive memory
    client.post(
        "/api/v1/memories",
        json={"content": "Old fact: Previous lease ended in 2022", "is_active": False},
        headers=user_a["headers"]
    )

    # All memories
    res_all = client.get("/api/v1/memories", headers=user_a["headers"])
    assert res_all.status_code == 200
    assert res_all.json()["total"] == 2

    # Filter is_active=true
    res_active = client.get("/api/v1/memories?is_active=true", headers=user_a["headers"])
    assert res_active.status_code == 200
    assert len(res_active.json()["items"]) == 1
    assert res_active.json()["items"][0]["is_active"] is True


def test_update_memory(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/memories",
        json={"content": "Drafting consumer complaint for defective laptop", "is_active": True},
        headers=user_a["headers"]
    )
    mem_id = create_res.json()["id"]

    patch_res = client.patch(
        f"/api/v1/memories/{mem_id}",
        json={"content": "Resolved: Consumer complaint settled amicably", "is_active": False},
        headers=user_a["headers"]
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["content"] == "Resolved: Consumer complaint settled amicably"
    assert patch_res.json()["is_active"] is False


def test_delete_memory(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/memories",
        json={"content": "Temporary memory to delete"},
        headers=user_a["headers"]
    )
    mem_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/memories/{mem_id}", headers=user_a["headers"])
    assert del_res.status_code == 204


def test_delete_all_memories(client: TestClient, user_a):
    for i in range(3):
        client.post(
            "/api/v1/memories",
            json={"content": f"Memory to wipe #{i}"},
            headers=user_a["headers"]
        )

    del_all = client.delete("/api/v1/memories", headers=user_a["headers"])
    assert del_all.status_code == 204

    list_res = client.get("/api/v1/memories", headers=user_a["headers"])
    assert list_res.status_code == 200
    assert list_res.json()["total"] == 0
