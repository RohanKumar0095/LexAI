import pytest
from fastapi.testclient import TestClient


def test_create_messages_valid_roles(client: TestClient, user_a):
    conv_res = client.post(
        "/api/v1/conversations",
        json={"title": "Message Roles Test"},
        headers=user_a["headers"]
    )
    conv_id = conv_res.json()["id"]

    # 1. User message
    user_msg = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={"role": "user", "content": "What is the penalty for defamation under BNS?"},
        headers=user_a["headers"]
    )
    assert user_msg.status_code == 201
    assert user_msg.json()["role"] == "user"
    assert user_msg.json()["conversation_id"] == conv_id

    # 2. Assistant message
    asst_msg = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={
            "role": "assistant",
            "content": "Under Section 356 of BNS, defamation is punishable with simple imprisonment...",
            "metadata": {"citations": ["BNS Section 356"]}
        },
        headers=user_a["headers"]
    )
    assert asst_msg.status_code == 201
    assert asst_msg.json()["role"] == "assistant"
    assert asst_msg.json()["metadata"]["citations"] == ["BNS Section 356"]

    # 3. System message
    sys_msg = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={"role": "system", "content": "Conversation initialized with legal framework: BNS 2023."},
        headers=user_a["headers"]
    )
    assert sys_msg.status_code == 201
    assert sys_msg.json()["role"] == "system"


def test_create_message_invalid_role_rejected(client: TestClient, user_a):
    conv_res = client.post(
        "/api/v1/conversations",
        json={"title": "Invalid Role Test"},
        headers=user_a["headers"]
    )
    conv_id = conv_res.json()["id"]

    res = client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        json={"role": "admin", "content": "Invalid role test"},
        headers=user_a["headers"]
    )
    assert res.status_code == 422  # Pydantic validation error


def test_list_messages_in_conversation(client: TestClient, user_a):
    conv_res = client.post(
        "/api/v1/conversations",
        json={"title": "List Messages Test"},
        headers=user_a["headers"]
    )
    conv_id = conv_res.json()["id"]

    for i in range(3):
        client.post(
            f"/api/v1/conversations/{conv_id}/messages",
            json={"role": "user", "content": f"Query #{i+1}"},
            headers=user_a["headers"]
        )

    res = client.get(f"/api/v1/conversations/{conv_id}/messages", headers=user_a["headers"])
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3
