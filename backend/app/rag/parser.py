import os
import re
import hashlib
import logging
from typing import List, Dict, Any, Tuple
from pathlib import Path
import fitz  # PyMuPDF
from backend.app.legal.metadata import extract_legal_metadata_from_text
from backend.app.schemas.legal import LegalDocumentCreate

logger = logging.getLogger(__name__)


class ParsedPage:
    def __init__(self, page_number: int, text: str):
        self.page_number = page_number
        self.text = text


class ParsedDocument:
    def __init__(self, document_id: str, title: str, pages: List[ParsedPage], full_text: str, metadata: Dict[str, Any], file_path: str):
        self.document_id = document_id
        self.title = title
        self.pages = pages
        self.full_text = full_text
        self.metadata = metadata
        self.file_path = file_path


class DocumentParser:
    """
    Legal Document Parser using PyMuPDF.
    Extracts text, preserves page numbers, cleans artifacts, and extracts legal metadata.
    """

    @staticmethod
    def compute_document_id(file_path: str, content_bytes: bytes) -> str:
        """
        Generate a stable, deterministic document ID based on content hash.
        """
        hasher = hashlib.sha256()
        hasher.update(content_bytes)
        return f"doc_{hasher.hexdigest()[:16]}"

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Cleans extraction artifacts, normalizes whitespace and line breaks.
        """
        if not text:
            return ""
        
        # Replace non-breaking spaces and unusual whitespace
        text = text.replace("\xa0", " ").replace("\u200b", "")
        
        # Fix hyphenated words broken across lines (e.g. "con- \n stitution" -> "constitution")
        text = re.sub(r"(\w+)-\s*\n\s*(\w+)", r"\1\2", text)
        
        # Replace multiple consecutive spaces with a single space
        text = re.sub(r"[ \t]+", " ", text)
        
        # Normalize multiple newlines to max 2 newlines (paragraph boundary)
        text = re.sub(r"\n{3,}", "\n\n", text)
        
        return text.strip()

    def parse_pdf(self, file_path: str) -> ParsedDocument:
        """
        Parses a PDF legal document.
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        if path.suffix.lower() != ".pdf":
            raise ValueError(f"Unsupported file format: {path.suffix}. Expected .pdf")

        logger.info(f"Parsing PDF document: {path.name}")
        try:
            content_bytes = path.read_bytes()
            doc_id = self.compute_document_id(str(path), content_bytes)

            doc = fitz.open(stream=content_bytes, filetype="pdf")
            pages: List[ParsedPage] = []
            full_text_list = []

            for page_idx in range(len(doc)):
                page = doc[page_idx]
                page_text = page.get_text("text")
                cleaned_page_text = self.clean_text(page_text)
                if cleaned_page_text:
                    pages.append(ParsedPage(page_number=page_idx + 1, text=cleaned_page_text))
                    full_text_list.append(cleaned_page_text)

            doc.close()

            full_text = "\n\n".join(full_text_list)
            if not full_text.strip():
                raise ValueError(f"PDF {path.name} contains no extractable text (it might be scanned/image-only).")

            # Extract legal metadata from extracted text
            legal_meta = extract_legal_metadata_from_text(full_text[:5000])
            
            # Title fallback
            title = legal_meta.get("case_name") or path.stem.replace("_", " ").title()

            metadata = {
                "document_id": doc_id,
                "title": title,
                "document_type": legal_meta.get("document_type", "judgment"),
                "source": legal_meta.get("court") or "Supreme Court of India",
                "court": legal_meta.get("court"),
                "case_name": legal_meta.get("case_name"),
                "citation": legal_meta.get("citation"),
                "judgment_date": legal_meta.get("judgment_date"),
                "jurisdiction": legal_meta.get("jurisdiction", "India"),
                "language": "en",
                "total_pages": len(pages),
                "file_path": str(path.resolve()),
            }

            return ParsedDocument(
                document_id=doc_id,
                title=title,
                pages=pages,
                full_text=full_text,
                metadata=metadata,
                file_path=str(path.resolve())
            )
        except Exception as e:
            logger.error(f"Error parsing PDF {file_path}: {e}", exc_info=True)
            raise
