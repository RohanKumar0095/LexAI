import pytest
from fastapi.testclient import TestClient


def test_signup_success(client: TestClient):
    payload = {
        "email": "testuser@example.com",
        "password": "SecurePassword123!",
        "full_name": "LexAI Tester"
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == payload["email"]
    assert data["user"]["full_name"] == payload["full_name"]


def test_signup_duplicate_email(client: TestClient, user_a_data):
    # First signup
    res1 = client.post("/api/v1/auth/signup", json=user_a_data)
    assert res1.status_code == 201

    # Second signup with same email should fail with 409
    res2 = client.post("/api/v1/auth/signup", json=user_a_data)
    assert res2.status_code == 409


def test_login_success(client: TestClient, user_a_data):
    # Signup
    client.post("/api/v1/auth/signup", json=user_a_data)

    # Login
    login_payload = {
        "email": user_a_data["email"],
        "password": user_a_data["password"]
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == user_a_data["email"]


def test_login_invalid_password(client: TestClient, user_a_data):
    client.post("/api/v1/auth/signup", json=user_a_data)

    login_payload = {
        "email": user_a_data["email"],
        "password": "WrongPassword!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401


def test_login_nonexistent_user(client: TestClient):
    login_payload = {
        "email": "ghost@example.com",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401


def test_get_me_authenticated(client: TestClient, user_a):
    response = client.get("/api/v1/auth/me", headers=user_a["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_a["id"]
    assert data["email"] == user_a["email"]


def test_get_me_unauthenticated(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_get_me_invalid_token(client: TestClient):
    headers = {"Authorization": "Bearer invalid-garbage-token"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401


def test_logout(client: TestClient, user_a):
    response = client.post("/api/v1/auth/logout", headers=user_a["headers"])
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully logged out"
