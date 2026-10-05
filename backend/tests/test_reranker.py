import pytest
from unittest.mock import MagicMock
from backend.app.rag.reranker import CrossEncoderReranker
from backend.app.schemas.rag import RetrievedChunk
from backend.app.schemas.legal import LegalChunkMetadata


def test_cross_encoder_reranker_mock():
    meta = LegalChunkMetadata(document_id="doc1", chunk_id="chunk1", chunk_index=0)
    chunk1 = RetrievedChunk(chunk_id="c1", document_id="doc1", chunk_text="Irrelevant text", metadata=meta, score=0.5)
    chunk2 = RetrievedChunk(chunk_id="c2", document_id="doc1", chunk_text="Crucial legal ruling on anticipatory bail", metadata=meta, score=0.4)

    reranker = CrossEncoderReranker(model_name=None)
    mock_model = MagicMock()
    mock_model.predict.return_value = [0.1, 0.95]
    reranker._model = mock_model

    ranked = reranker.rerank(query="anticipatory bail", chunks=[chunk1, chunk2], top_k=2)

    assert len(ranked) == 2
    # chunk2 should now be first because its cross-encoder score is 0.95 vs 0.1
    assert ranked[0].chunk_id == "c2"
    assert ranked[0].score == 0.95
    assert ranked[0].source_type == "reranked"
