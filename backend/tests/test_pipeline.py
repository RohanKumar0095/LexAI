import json
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
        score=2.5
    )

    mock_retriever.retrieve.return_value = [chunk]
    mock_reranker.rerank.return_value = [chunk]
    
    mock_llm_json = {
        "status": "supported",
        "summary": "Mens rea is essential in criminal law unless expressly excluded.",
        "key_points": [
            {
                "text": "Mens rea is an essential ingredient unless statutory exclusion is present.",
                "source_ids": ["EVIDENCE_1"]
            }
        ],
        "steps": [],
        "conditions": [],
        "exceptions": [],
        "important_notes": [],
        "unavailable_information": []
    }
    mock_llm.generate_answer.return_value = json.dumps(mock_llm_json)

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
    assert response.evidence_state in ["sufficient", "partial"]
    assert response.structured_answer is not None
    assert response.structured_answer.status == "supported"


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

    assert response.answer == "Data not available in the indexed legal documents."
    assert response.evidence_state == "insufficient"
    assert len(response.sources) == 0
    assert not mock_llm.generate_answer.called


def test_pipeline_low_relevance_bypasses_gemini():
    """Verify that chunks below MIN_EVIDENCE_RELEVANCE_SCORE are discarded and Gemini is NEVER called."""
    mock_retriever = MagicMock()
    mock_reranker = MagicMock()
    mock_llm = MagicMock()

    meta = LegalChunkMetadata(
        document_id="doc_irrelevant",
        chunk_id="doc_irrel_c0",
        chunk_index=0
    )
    # Relevance score of -6.5 is well below MIN_EVIDENCE_RELEVANCE_SCORE (-2.5)
    irrelevant_chunk = RetrievedChunk(
        chunk_id="doc_irrel_c0",
        document_id="doc_irrelevant",
        chunk_text="Random text about quantum mechanics or unrelated subject.",
        metadata=meta,
        score=-6.5
    )

    mock_retriever.retrieve.return_value = [irrelevant_chunk]
    mock_reranker.rerank.return_value = [irrelevant_chunk]

    pipeline = LegalRAGPipeline(
        retriever=mock_retriever,
        reranker=mock_reranker,
        llm=mock_llm
    )

    response = pipeline.run(query="What are quantum computing algorithms in Python?")

    assert response.answer == "Data not available in the indexed legal documents."
    assert response.evidence_state == "insufficient"
    assert len(response.sources) == 0
    assert not mock_llm.generate_answer.called


def test_pipeline_partial_evidence_handling():
    """Verify that partial evidence sets partial state and processes unavailable information."""
    mock_retriever = MagicMock()
    mock_reranker = MagicMock()
    mock_llm = MagicMock()

    meta = LegalChunkMetadata(
        document_id="bnss_doc",
        chunk_id="bnss_c1",
        chunk_index=1,
        statute="BNSS",
        section_reference="Section 35"
    )
    # Single chunk with moderate score triggers partial evidence
    chunk = RetrievedChunk(
        chunk_id="bnss_c1",
        document_id="bnss_doc",
        chunk_text="When police may arrest without warrant under Section 35 of BNSS.",
        metadata=meta,
        score=0.5
    )

    mock_retriever.retrieve.return_value = [chunk]
    mock_reranker.rerank.return_value = [chunk]

    mock_llm_json = {
        "status": "partially_supported",
        "summary": "Police arrest powers are defined under Section 35 BNSS.",
        "key_points": [
            {
                "text": "Arrest without warrant is permitted under specific conditions in Section 35.",
                "source_ids": ["EVIDENCE_1"]
            }
        ],
        "steps": [],
        "conditions": ["Cognizable offence committed in presence of police"],
        "exceptions": [],
        "important_notes": [],
        "unavailable_information": ["Bail conditions for arrest under Section 35 are not in the provided text."]
    }
    mock_llm.generate_answer.return_value = json.dumps(mock_llm_json)

    pipeline = LegalRAGPipeline(
        retriever=mock_retriever,
        reranker=mock_reranker,
        llm=mock_llm
    )

    response = pipeline.run(query="What are police arrest powers and bail criteria under Section 35 BNSS?")

    assert response.evidence_state == "partial"
    assert mock_llm.generate_answer.called
    assert len(response.sources) == 1
    assert "Information Not Available in Indexed Documents" in response.answer
    assert response.structured_answer.status == "partially_supported"


def test_unrelated_provision_pruned_from_citations():
    """Verify that unreferenced retrieved chunks (e.g. bail provision retrieved during arrest inquiry) are pruned from active citations."""
    mock_retriever = MagicMock()
    mock_reranker = MagicMock()
    mock_llm = MagicMock()

    meta1 = LegalChunkMetadata(
        document_id="bnss_doc",
        chunk_id="bnss_c107",
        chunk_index=107,
        case_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
        section_reference="Section 35"
    )
    c1 = RetrievedChunk(
        chunk_id="bnss_c107",
        document_id="bnss_doc",
        chunk_text="35. (1) Any police officer may without an order from a Magistrate and without a warrant, arrest any person...",
        metadata=meta1,
        score=6.4
    )

    meta2 = LegalChunkMetadata(
        document_id="bnss_doc",
        chunk_id="bnss_c848",
        chunk_index=848,
        case_name="Bharatiya Nagarik Suraksha Sanhita, 2023",
        section_reference="Section 480"
    )
    c2 = RetrievedChunk(
        chunk_id="bnss_c848",
        document_id="bnss_doc",
        chunk_text="480. (1) In what cases bail to be taken for bailable offences...",
        metadata=meta2,
        score=5.8
    )

    mock_retriever.retrieve.return_value = [c1, c2]
    mock_reranker.rerank.return_value = [c1, c2]

    # LLM transforms only Section 35 and explicitly relies ONLY on EVIDENCE_1
    mock_llm_json = {
        "status": "supported",
        "summary": "Police may arrest without warrant under Section 35.",
        "summary_source_ids": ["EVIDENCE_1"],
        "key_points": [
            {
                "text": "Arrest without warrant is permitted for cognizable offences committed in officer presence.",
                "source_ids": ["EVIDENCE_1"]
            }
        ],
        "steps": [],
        "conditions": [],
        "exceptions": [],
        "important_notes": [],
        "unavailable_information": []
    }
    mock_llm.generate_answer.return_value = json.dumps(mock_llm_json)

    pipeline = LegalRAGPipeline(
        retriever=mock_retriever,
        reranker=mock_reranker,
        llm=mock_llm
    )

    response = pipeline.run(query="When can police arrest without a warrant?")

    assert response.evidence_state == "sufficient"
    # c2 (Section 480 bail) was in accepted evidence, but not relied upon for arrest answer,
    # so response.sources MUST prune c2 and retain ONLY c1!
    assert len(response.sources) == 1
    assert response.sources[0].chunk_id == "bnss_c107"
    assert response.sources[0].section_reference == "Section 35"


def test_citation_provenance_scrubs_invented_sources():
    """Verify that hallucinated/invented source IDs like EVIDENCE_999 are scrubbed."""
    from backend.app.rag.prompt_builder import LegalPromptBuilder
    from backend.app.schemas.rag import LegalSource

    src1 = LegalSource(
        evidence_id="EVIDENCE_1",
        document_id="doc_1",
        chunk_id="c_1"
    )
    raw_llm_json = json.dumps({
        "status": "supported",
        "summary": "Supported statement",
        "key_points": [
            {
                "text": "Point with invented source",
                "source_ids": ["EVIDENCE_1", "EVIDENCE_999", "invented_chunk_id"]
            }
        ],
        "steps": [],
        "conditions": [],
        "exceptions": [],
        "important_notes": [],
        "unavailable_information": []
    })

    ans = LegalPromptBuilder.parse_structured_transformation(raw_llm_json, sources=[src1])
    # EVIDENCE_999 and invented_chunk_id MUST be scrubbed, leaving only EVIDENCE_1
    assert ans.key_points[0].source_ids == ["EVIDENCE_1"]


def test_markdown_no_literal_asterisk_artifacts():
    """Verify that formatted markdown has clean blank lines and no literal asterisk concatenations."""
    from backend.app.rag.prompt_builder import LegalPromptBuilder
    from backend.app.schemas.rag import StructuredLegalAnswer, KeyPointItem

    structured = StructuredLegalAnswer(
        status="supported",
        summary="A clear legal summary.",
        key_points=[
            KeyPointItem(text="Police may arrest without warrant.", source_ids=["EVIDENCE_1"]),
            KeyPointItem(text="Notice must be issued when arrest is not made.", source_ids=["EVIDENCE_1"])
        ],
        steps=[KeyPointItem(text="Officer records reasons in writing.", source_ids=["EVIDENCE_1"])],
        conditions=[KeyPointItem(text="Reasonable suspicion of cognizable offence.", source_ids=["EVIDENCE_1"])],
        exceptions=[],
        important_notes=[],
        unavailable_information=["Bail amounts are not specified in this section."]
    )

    md = LegalPromptBuilder.format_structured_answer_to_markdown(structured)
    # Ensure double newlines after headings so headings and bullets don't concatenate into '### Key Points * ...'
    assert "### Key Legal Findings\n\n* " in md
    assert "### Procedure & Steps\n\n1. " in md
    assert "### Conditions & Requirements\n\n* " in md
    assert "### Information Not Available in Indexed Documents\n\n* ⚠️ " in md

