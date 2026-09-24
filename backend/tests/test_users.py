import pytest
from fastapi.testclient import TestClient


def test_get_own_profile(client: TestClient, user_a):
    response = client.get("/api/v1/users/me", headers=user_a["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_a["id"]
    assert data["full_name"] == "User Alpha"


def test_update_own_profile(client: TestClient, user_a):
    update_payload = {
        "full_name": "Advocate User Alpha",
        "avatar_url": "https://example.com/avatar.png"
    }
    response = client.patch("/api/v1/users/me", json=update_payload, headers=user_a["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_a["id"]
    assert data["full_name"] == "Advocate User Alpha"
    assert data["avatar_url"] == "https://example.com/avatar.png"

    # Verify persistence
    get_res = client.get("/api/v1/users/me", headers=user_a["headers"])
    assert get_res.status_code == 200
    assert get_res.json()["full_name"] == "Advocate User Alpha"


def test_profile_unauthenticated(client: TestClient):
    res1 = client.get("/api/v1/users/me")
    assert res1.status_code == 401

    res2 = client.patch("/api/v1/users/me", json={"full_name": "Ghost"})
    assert res2.status_code == 401
