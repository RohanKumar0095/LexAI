import pytest
from unittest.mock import MagicMock, patch
import numpy as np
from backend.app.rag.embeddings import EmbeddingService


def test_embedding_service_singleton():
    service1 = EmbeddingService()
    service2 = EmbeddingService()
    assert service1 is service2


def test_embed_documents_and_query_with_mock():
    with patch("sentence_transformers.SentenceTransformer") as MockTransformer:
        mock_model = MagicMock()
        mock_model.encode.return_value = np.array([[0.1, 0.2, 0.3]])
        MockTransformer.return_value = mock_model

        service = EmbeddingService()
        service._model = mock_model

        # Test embed_documents
        embeddings = service.embed_documents(["Legal section text"])
        assert len(embeddings) == 1
        assert len(embeddings[0]) == 3

        # Test embed_query
        mock_model.encode.return_value = np.array([0.1, 0.2, 0.3])
        q_emb = service.embed_query("bail under Section 438")
        assert len(q_emb) == 3
