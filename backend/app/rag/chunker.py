import re
import json
import logging
from typing import List, Dict, Any, Optional
from backend.app.rag.parser import ParsedDocument
from backend.app.schemas.legal import LegalChunkCreate, LegalChunkMetadata
from backend.app.legal.citations import extract_section_references

logger = logging.getLogger(__name__)


class LegalChunker:
    """
    Structure-aware legal chunker.
    Splits legal documents respecting paragraphs, numbered points, statutory sections,
    and headings while maintaining page and metadata context.
    """

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def _split_into_logical_units(self, text: str) -> List[str]:
        """
        Splits text along paragraph boundaries, numbered legal points, and headings.
        """
        # Patterns for legal boundaries:
        # Double newlines, or numbered paragraphs like "\n1. ", "\n(a) ", "\nPara 10: "
        paragraphs = re.split(r"\n\s*\n|(?<=\n)(?=(?:[0-9]{1,3}\.|\([a-z0-9]\)|Para\s+[0-9]+|Section\s+[0-9]+|ORDER|JUDGMENT|HELD))\s*", text)
        units = []
        for p in paragraphs:
            cleaned = p.strip()
            if cleaned:
                units.append(cleaned)
        return units

    def _detect_chunk_type(self, chunk_text: str) -> str:
        if re.search(r"^(?:HELD|ORDER|JUDGMENT|DISPOSITION|CONCLUSION)", chunk_text, re.IGNORECASE):
            return "order"
        elif re.search(r"^(?:HEADNOTE|FACTS|BRIEF\s*FACTS)", chunk_text, re.IGNORECASE):
            return "headnote"
        return "body"

    def chunk_document(self, parsed_doc: ParsedDocument) -> List[LegalChunkCreate]:
        """
        Processes a parsed document into structured, contextual legal chunks.
        """
        chunks: List[LegalChunkCreate] = []
        chunk_index = 0

        doc_meta = parsed_doc.metadata
        doc_id = parsed_doc.document_id
        case_name = doc_meta.get("case_name") or doc_meta.get("title")
        court = doc_meta.get("court")
        citation = doc_meta.get("citation")
        judgment_date = doc_meta.get("judgment_date")

        for page in parsed_doc.pages:
            page_num = page.page_number
            units = self._split_into_logical_units(page.text)

            current_chunk_text = ""
            current_paragraphs = []

            for unit in units:
                # If adding unit exceeds chunk_size, emit current chunk
                if current_chunk_text and (len(current_chunk_text) + len(unit) + 2 > self.chunk_size):
                    chunk_text = current_chunk_text.strip()
                    
                    # Extract section references and paragraph numbers in this chunk
                    sec_refs = extract_section_references(chunk_text)
                    sec_ref_str = ", ".join(sec_refs) if sec_refs else None
                    
                    # Detect paragraph reference like "Para 14" or "14."
                    para_match = re.search(r"(?:Para(?:graph)?\s*([0-9]+)|^([0-9]{1,3})\.)", chunk_text, re.MULTILINE)
                    para_ref_str = f"Para {para_match.group(1) or para_match.group(2)}" if para_match else None

                    # Detect chunk type (heading, order, headnote, body)
                    chunk_type = self._detect_chunk_type(chunk_text)

                    chunk_id = f"{doc_id}_c{chunk_index}"
                    
                    chunk_metadata = LegalChunkMetadata(
                        document_id=doc_id,
                        chunk_id=chunk_id,
                        chunk_index=chunk_index,
                        case_name=case_name,
                        court=court,
                        judgment_date=judgment_date,
                        citation=citation,
                        section_reference=sec_ref_str,
                        paragraph_reference=para_ref_str,
                        document_type=doc_meta.get("document_type", "judgment"),
                        source_url=doc_meta.get("source_url"),
                        page_number=page_num,
                        extra={"title": doc_meta.get("title")}
                    )

                    chunks.append(LegalChunkCreate(
                        id=chunk_id,
                        document_id=doc_id,
                        chunk_index=chunk_index,
                        chunk_text=chunk_text,
                        section_reference=sec_ref_str,
                        paragraph_reference=para_ref_str,
                        chunk_type=chunk_type,
                        metadata=chunk_metadata
                    ))
                    chunk_index += 1

                    # Apply overlap from the end of current_chunk_text
                    if self.chunk_overlap > 0 and len(current_chunk_text) > self.chunk_overlap:
                        overlap_point = max(0, len(current_chunk_text) - self.chunk_overlap)
                        current_chunk_text = current_chunk_text[overlap_point:].strip() + "\n\n" + unit
                    else:
                        current_chunk_text = unit
                else:
                    if current_chunk_text:
                        current_chunk_text += "\n\n" + unit
                    else:
                        current_chunk_text = unit

            # Emit remaining text on the page
            if current_chunk_text.strip():
                chunk_text = current_chunk_text.strip()
                sec_refs = extract_section_references(chunk_text)
                sec_ref_str = ", ".join(sec_refs) if sec_refs else None
                
                para_match = re.search(r"(?:Para(?:graph)?\s*([0-9]+)|^([0-9]{1,3})\.)", chunk_text, re.MULTILINE)
                para_ref_str = f"Para {para_match.group(1) or para_match.group(2)}" if para_match else None
                chunk_type = self._detect_chunk_type(chunk_text)

                chunk_id = f"{doc_id}_c{chunk_index}"
                chunk_metadata = LegalChunkMetadata(
                    document_id=doc_id,
                    chunk_id=chunk_id,
                    chunk_index=chunk_index,
                    case_name=case_name,
                    court=court,
                    judgment_date=judgment_date,
                    citation=citation,
                    section_reference=sec_ref_str,
                    paragraph_reference=para_ref_str,
                    document_type=doc_meta.get("document_type", "judgment"),
                    source_url=doc_meta.get("source_url"),
                    page_number=page_num,
                    extra={"title": doc_meta.get("title")}
                )

                chunks.append(LegalChunkCreate(
                    id=chunk_id,
                    document_id=doc_id,
                    chunk_index=chunk_index,
                    chunk_text=chunk_text,
                    section_reference=sec_ref_str,
                    paragraph_reference=para_ref_str,
                    chunk_type=chunk_type,
                    metadata=chunk_metadata
                ))
                chunk_index += 1

        logger.info(f"Generated {len(chunks)} legal chunks for document {doc_id}")
        return chunks
