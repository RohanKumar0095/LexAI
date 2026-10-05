import pytest
from unittest.mock import MagicMock, patch
from backend.app.llm.gemini import GeminiService


def test_gemini_service_availability():
    service_no_key = GeminiService(api_key="")
    assert not service_no_key.is_available()

    service_with_key = GeminiService(api_key="test_dummy_key")
    assert service_with_key.is_available()


def test_gemini_generation_mock():
    service = GeminiService(api_key="test_dummy_key", model="gemini-2.5-flash")
    
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Under Section 302 IPC, murder requires intention or knowledge."
    mock_client.models.generate_content.return_value = mock_response
    service._client = mock_client

    answer = service.generate_answer(
        system_prompt="You are a legal assistant.",
        prompt="Explain Section 302 IPC."
    )

    assert "Section 302 IPC" in answer
    assert mock_client.models.generate_content.called
