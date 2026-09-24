import pytest
from fastapi.testclient import TestClient


def test_create_search_history(client: TestClient, user_a):
    payload = {"query": "Anticipatory bail procedure under BNSS"}
    response = client.post("/api/v1/search-history", json=payload, headers=user_a["headers"])
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == user_a["id"]
    assert data["query"] == "Anticipatory bail procedure under BNSS"


def test_list_search_history_and_pagination(client: TestClient, user_a):
    for i in range(4):
        client.post(
            "/api/v1/search-history",
            json={"query": f"Legal Query #{i+1}"},
            headers=user_a["headers"]
        )

    res = client.get("/api/v1/search-history?page=1&page_size=2", headers=user_a["headers"])
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) == 2
    assert data["total"] == 4
    assert data["total_pages"] == 2


def test_get_search_history_item(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/search-history",
        json={"query": "Cyber fraud reporting time limits"},
        headers=user_a["headers"]
    )
    search_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/search-history/{search_id}", headers=user_a["headers"])
    assert get_res.status_code == 200
    assert get_res.json()["id"] == search_id
    assert get_res.json()["query"] == "Cyber fraud reporting time limits"


def test_delete_search_history_item(client: TestClient, user_a):
    create_res = client.post(
        "/api/v1/search-history",
        json={"query": "Delete item test"},
        headers=user_a["headers"]
    )
    search_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/search-history/{search_id}", headers=user_a["headers"])
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/search-history/{search_id}", headers=user_a["headers"])
    assert get_res.status_code == 404


def test_delete_all_search_history(client: TestClient, user_a):
    for i in range(3):
        client.post(
            "/api/v1/search-history",
            json={"query": f"Query to clear #{i}"},
            headers=user_a["headers"]
        )

    del_all = client.delete("/api/v1/search-history", headers=user_a["headers"])
    assert del_all.status_code == 204

    list_res = client.get("/api/v1/search-history", headers=user_a["headers"])
    assert list_res.status_code == 200
    assert len(list_res.json()["items"]) == 0
    assert list_res.json()["total"] == 0
