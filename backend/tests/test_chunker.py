import pytest
from backend.app.rag.chunker import LegalChunker
from backend.app.rag.parser import ParsedDocument, ParsedPage


def test_chunker_structure_and_references():
    doc_id = "doc_test_123"
    pages = [
        ParsedPage(
            page_number=1,
            text="SUPREME COURT OF INDIA\n\n1. In the present case under Section 302 of the Indian Penal Code, the prosecution alleged..."
        ),
        ParsedPage(
            page_number=2,
            text="ORDER\n\n2. We accordingly allow the appeal and set aside the conviction under Section 302 IPC."
        )
    ]
    parsed_doc = ParsedDocument(
        document_id=doc_id,
        title="Test Judgment",
        pages=pages,
        full_text="\n\n".join(p.text for p in pages),
        metadata={
            "case_name": "Ramesh vs State",
            "court": "Supreme Court of India",
            "citation": "2024 INSC 123",
            "judgment_date": "10 Jan 2024",
            "document_type": "judgment"
        },
        file_path="/tmp/test.pdf"
    )

    chunker = LegalChunker(chunk_size=500, chunk_overlap=50)
    chunks = chunker.chunk_document(parsed_doc)

    assert len(chunks) >= 2
    assert chunks[0].document_id == doc_id
    assert chunks[0].id == f"{doc_id}_c0"
    assert chunks[0].metadata.page_number == 1
    assert chunks[0].metadata.case_name == "Ramesh vs State"
    assert "Section 302" in (chunks[0].section_reference or "")


def test_chunker_order_detection():
    doc_id = "doc_test_456"
    pages = [
        ParsedPage(
            page_number=1,
            text="ORDER\n\nThe petition is dismissed with costs."
        )
    ]
    parsed_doc = ParsedDocument(
        document_id=doc_id,
        title="Test Order",
        pages=pages,
        full_text=pages[0].text,
        metadata={"title": "Test Order"},
        file_path="/tmp/order.pdf"
    )
    chunker = LegalChunker(chunk_size=500, chunk_overlap=0)
    chunks = chunker.chunk_document(parsed_doc)

    assert len(chunks) == 1
    assert chunks[0].chunk_type == "order"
