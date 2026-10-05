import pytest
from unittest.mock import MagicMock
from backend.app.rag.hybrid_retriever import HybridRetriever
from backend.app.schemas.rag import RetrievedChunk
from backend.app.schemas.legal import LegalChunkMetadata


def test_hybrid_fusion_and_deduplication():
    mock_vector_store = MagicMock()
    mock_embedding_service = MagicMock()
    mock_keyword_search = MagicMock()

    meta1 = LegalChunkMetadata(document_id="doc1", chunk_id="chunk1", chunk_index=0, case_name="Case A")
    meta2 = LegalChunkMetadata(document_id="doc2", chunk_id="chunk2", chunk_index=0, case_name="Case B")

    # Chunk 1 appears in both vector and keyword results
    vec_chunk1 = RetrievedChunk(chunk_id="chunk1", document_id="doc1", chunk_text="Text 1", metadata=meta1, score=0.9, source_type="vector")
    # Chunk 2 appears only in keyword results
    kw_chunk2 = RetrievedChunk(chunk_id="chunk2", document_id="doc2", chunk_text="Text 2", metadata=meta2, score=0.8, source_type="keyword")
    kw_chunk1 = RetrievedChunk(chunk_id="chunk1", document_id="doc1", chunk_text="Text 1", metadata=meta1, score=0.7, source_type="keyword")

    mock_embedding_service.embed_query.return_value = [0.1] * 384
    mock_vector_store.search.return_value = [vec_chunk1]
    mock_keyword_search.search.return_value = [kw_chunk1, kw_chunk2]

    retriever = HybridRetriever(
        vector_store=mock_vector_store,
        embedding_service=mock_embedding_service,
        keyword_search=mock_keyword_search,
        vector_weight=0.6,
        keyword_weight=0.4
    )

    results = retriever.retrieve(query="murder section 302", top_k=5)

    assert len(results) == 2
    # chunk1 should be ranked highest due to appearing in both with strong scores
    assert results[0].chunk_id == "chunk1"
    assert "hybrid" in results[0].source_type
    assert results[1].chunk_id == "chunk2"
