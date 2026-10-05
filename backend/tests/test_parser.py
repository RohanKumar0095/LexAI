import os
import fitz
import pytest
from pathlib import Path
from backend.app.rag.parser import DocumentParser, ParsedDocument
from backend.app.legal.metadata import extract_legal_metadata_from_text


def test_clean_text():
    parser = DocumentParser()
    raw = "This is a test\xa0with non-breaking   spaces and \n\n\n multiple newlines."
    cleaned = parser.clean_text(raw)
    assert "\xa0" not in cleaned
    assert "   " not in cleaned
    assert "\n\n\n" not in cleaned


def test_hyphenation_fix():
    parser = DocumentParser()
    raw = "The Con- \n stitution of India guarantees fundamental rights."
    cleaned = parser.clean_text(raw)
    assert "Constitution" in cleaned


def test_extract_legal_metadata():
    sample_text = """
    IN THE SUPREME COURT OF INDIA
    CRIMINAL APPELLATE JURISDICTION
    
    CRIMINAL APPEAL NO. 123 OF 2023
    
    RAMESH KUMAR VERSUS STATE OF NCT OF DELHI
    
    CITATION: (2023) 4 SCC 123
    DATE OF JUDGMENT: 15th March, 2023
    
    JUDGMENT
    1. This appeal arises out of proceedings under Section 302 IPC.
    """
    meta = extract_legal_metadata_from_text(sample_text)
    assert meta["court"] == "Supreme Court of India"
    assert "RAMESH KUMAR" in (meta["case_name"] or "")
    assert meta["citation"] == "(2023) 4 SCC 123"
    assert "15th March, 2023" in (meta["judgment_date"] or "")


def test_parse_pdf(tmp_path):
    # Create a small synthetic PDF using PyMuPDF for testing
    pdf_path = tmp_path / "test_judgment.pdf"
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (50, 72),
        "SUPREME COURT OF INDIA\nRAMESH VERSUS STATE\nCITATION: 2024 INSC 123\nDATE OF JUDGMENT: 10th January, 2024\n\n1. The appellant was convicted under Section 302 IPC."
    )
    doc.save(str(pdf_path))
    doc.close()

    parser = DocumentParser()
    parsed = parser.parse_pdf(str(pdf_path))

    assert isinstance(parsed, ParsedDocument)
    assert parsed.document_id.startswith("doc_")
    assert len(parsed.pages) == 1
    assert "SUPREME COURT OF INDIA" in parsed.full_text
    assert parsed.metadata["court"] == "Supreme Court of India"
