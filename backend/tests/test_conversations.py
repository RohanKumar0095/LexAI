import pytest
from fastapi.testclient import TestClient


def test_create_conversation(client: TestClient, user_a):
    payload = {"title": "BNS Section 103 Inquiry"}
    response = client.post("/api/v1/conversations", json=payload, headers=user_a["headers"])
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == user_a["id"]
    assert data["title"] == "BNS Section 103 Inquiry"
    assert "id" in data


def test_list_conversations_and_pagination(client: TestClient, user_a):
    # Create 5 conversations
    for i in range(5):
        client.post(
            "/api/v1/conversations",
            json={"title": f"Conversation #{i+1}"},
            headers=user_a["headers"]
        )

    # Page 1, size 2
    res = client.get("/api/v1/conversations?page=1&page_size=2", headers=user_a["headers"])
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert data["total_pages"] == 3

    # Page 3, size 2 (should have 1 item)
    res3 = client.get("/api/v1/conversations?page=3&page_size=2", headers=user_a["headers"])
    assert res3.status_code == 200
    data3 = res3.json()
    assert len(data3["items"]) == 1


def test_get_conversation_by_id(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/conversations",
        json={"title": "Specific Case"},
        headers=user_a["headers"]
    )
    conv_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/conversations/{conv_id}", headers=user_a["headers"])
    assert get_res.status_code == 200
    assert get_res.json()["id"] == conv_id
    assert get_res.json()["title"] == "Specific Case"


def test_update_conversation(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/conversations",
        json={"title": "Old Title"},
        headers=user_a["headers"]
    )
    conv_id = create_res.json()["id"]

    patch_res = client.patch(
        f"/api/v1/conversations/{conv_id}",
        json={"title": "Updated Legal Title"},
        headers=user_a["headers"]
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["title"] == "Updated Legal Title"


def test_delete_conversation(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/conversations",
        json={"title": "To Delete"},
        headers=user_a["headers"]
    )
    conv_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/conversations/{conv_id}", headers=user_a["headers"])
    assert del_res.status_code == 204

    # Confirm it's gone
    get_res = client.get(f"/api/v1/conversations/{conv_id}", headers=user_a["headers"])
    assert get_res.status_code == 404
