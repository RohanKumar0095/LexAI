import pytest
from unittest.mock import MagicMock
from backend.app.rag.pipeline import LegalRAGPipeline
from backend.app.schemas.rag import RetrievedChunk, ChatResponse
from backend.app.schemas.legal import LegalChunkMetadata


def test_pipeline_with_mocked_components():
    mock_retriever = MagicMock()
    mock_reranker = MagicMock()
    mock_llm = MagicMock()

    meta = LegalChunkMetadata(
        document_id="doc_99",
        chunk_id="doc_99_c0",
        chunk_index=0,
        case_name="State of Maharashtra vs Mayer Hans George",
        court="Supreme Court of India",
        citation="AIR 1965 SC 722",
        section_reference="Section 23 FERA"
    )
    chunk = RetrievedChunk(
        chunk_id="doc_99_c0",
        document_id="doc_99",
        chunk_text="Mens rea is an essential ingredient of a criminal offence unless excluded by statute.",
        metadata=meta,
        score=0.92
    )

    mock_retriever.retrieve.return_value = [chunk]
    mock_reranker.rerank.return_value = [chunk]
    mock_llm.generate_answer.return_value = "Mens rea is essential in criminal law unless expressly excluded."

    pipeline = LegalRAGPipeline(
        retriever=mock_retriever,
        reranker=mock_reranker,
        llm=mock_llm
    )

    response = pipeline.run(query="What is the role of mens rea in statutory offences?")

    assert isinstance(response, ChatResponse)
    assert "Mens rea" in response.answer
    assert len(response.sources) == 1
    assert response.sources[0].citation == "AIR 1965 SC 722"
    assert response.sources[0].case_name == "State of Maharashtra vs Mayer Hans George"


def test_pipeline_no_evidence_fallback():
    mock_retriever = MagicMock()
    mock_reranker = MagicMock()
    mock_llm = MagicMock()

    mock_retriever.retrieve.return_value = []
    mock_reranker.rerank.return_value = []

    pipeline = LegalRAGPipeline(
        retriever=mock_retriever,
        reranker=mock_reranker,
        llm=mock_llm
    )

    response = pipeline.run(query="Unindexed random topic")

    assert "does not currently contain" in response.answer
    assert len(response.sources) == 0
    assert not mock_llm.generate_answer.called
