import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.rag_service import get_rag_service, RAGService
from backend.app.schemas.rag import HealthResponse, ChatResponse, RetrievedChunk, LegalSource
from backend.app.schemas.legal import LegalChunkMetadata
from backend.app.core.database import Base, engine
import backend.app.models  # ensure models registered

Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "LexAI India" in data["service"]


def test_rag_health_endpoint():
    mock_service = MagicMock(spec=RAGService)
    mock_service.get_health_status.return_value = HealthResponse(
        status="healthy",
        database_connected=True,
        chroma_connected=True,
        embedding_model_loaded=True,
        gemini_configured=True,
        details={"chunks": 10}
    )

    app.dependency_overrides[get_rag_service] = lambda: mock_service

    response = client.get("/api/v1/rag/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True

    app.dependency_overrides.clear()


def test_rag_search_endpoint():
    mock_service = MagicMock(spec=RAGService)
    meta = LegalChunkMetadata(document_id="doc1", chunk_id="c1", chunk_index=0, case_name="State vs A")
    chunk = RetrievedChunk(chunk_id="c1", document_id="doc1", chunk_text="Sample text", metadata=meta, score=0.88)
    mock_service.search_chunks.return_value = [chunk]

    app.dependency_overrides[get_rag_service] = lambda: mock_service

    response = client.post("/api/v1/rag/search", json={"query": "bail application", "top_k": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 1
    assert data["results"][0]["chunk_id"] == "c1"

    app.dependency_overrides.clear()


def test_rag_chat_endpoint():
    mock_service = MagicMock(spec=RAGService)
    src = LegalSource(
        document_id="doc1",
        chunk_id="c1",
        case_name="State vs A",
        citation="2024 SC 1",
        snippet="Sample snippet"
    )
    mock_service.process_chat.return_value = ChatResponse(
        query="What is the law on bail?",
        answer="Bail is a rule and jail is an exception.",
        sources=[src]
    )

    app.dependency_overrides[get_rag_service] = lambda: mock_service

    response = client.post("/api/v1/rag/chat", json={"query": "What is the law on bail?"})
    assert response.status_code == 200
    data = response.json()
    assert "Bail is a rule" in data["answer"]
    assert len(data["sources"]) == 1
    assert data["sources"][0]["citation"] == "2024 SC 1"

    app.dependency_overrides.clear()


def test_daily_law_endpoint():
    response = client.get("/api/v1/rag/daily-law")
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "section" in data


def test_document_analyze_endpoint():
    response = client.post("/api/v1/documents/analyze", json={
        "file_name": "Residential_Rent_Agreement.pdf",
        "file_type": "Agreement"
    })
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert len(data["clauses"]) > 0
    assert len(data["riskFlags"]) > 0


def test_complaints_generate_endpoint():
    response = client.post("/api/v1/complaints/generate", json={
        "type": "Consumer Complaint",
        "situation": "Defective electronics delivery",
        "involvedParty": "ABC Electronics",
        "desiredAction": "Refund amount"
    })
    assert response.status_code == 200
    data = response.json()
    assert "draft" in data
    assert len(data["draft"]) > 50


def test_roadmap_endpoint():
    response = client.get("/api/v1/roadmaps/police-stop-roadmap")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "police-stop-roadmap"
    assert len(data["steps"]) >= 3


def test_auth_flow():
    import uuid
    test_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    
    # 1. Signup
    signup_res = client.post("/api/v1/auth/signup", json={
        "email": test_email,
        "password": "Password123!",
        "full_name": "Test User"
    })
    assert signup_res.status_code == 201
    auth_data = signup_res.json()
    assert "access_token" in auth_data
    token = auth_data["access_token"]
    assert auth_data["user"]["email"] == test_email

    # 2. Get Me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == test_email

    # 3. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 4. Logout
    logout_res = client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200

