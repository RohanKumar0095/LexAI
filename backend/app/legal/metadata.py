import re
from typing import Dict, Any, Optional


def extract_legal_metadata_from_text(text: str) -> Dict[str, Any]:
    """
    Extracts high-level legal metadata from judgment/statute header or text.
    Detects Court, Case Name, Citation, Date, and Jurisdiction.
    """
    metadata: Dict[str, Any] = {
        "court": None,
        "case_name": None,
        "citation": None,
        "judgment_date": None,
        "jurisdiction": "India",
        "document_type": "judgment",
    }
    
    # 1. Detect Court
    if re.search(r"supreme\s+court\s+of\s+india", text, re.IGNORECASE):
        metadata["court"] = "Supreme Court of India"
    elif match := re.search(r"high\s+court\s+of\s+([a-zA-Z\s]+)", text, re.IGNORECASE):
        court_name = match.group(0).strip()
        metadata["court"] = court_name
    elif "tribunal" in text.lower() or "nclat" in text.lower() or "nclt" in text.lower():
        metadata["court"] = "National Company Law Tribunal"
        metadata["document_type"] = "order"
    elif "act," in text.lower() or "act 20" in text.lower() or "act 19" in text.lower() or "code," in text.lower():
        metadata["document_type"] = "act"

    # 2. Detect Case Name (e.g. "State of X vs. Y" or "X v. Y" or "Appellant ... vs. Respondent")
    case_patterns = [
        r"([A-Z][A-Za-z0-9\s,\.\(\)]+)\s+(?:VERSUS|VS\.?|V\.)\s+([A-Z][A-Za-z0-9\s,\.\(\)]+)",
        r"(?:IN THE MATTER OF:?)\s*([A-Za-z0-9\s,\.\(\)]+)",
    ]
    for pattern in case_patterns:
        if match := re.search(pattern, text[:2500]):
            case_title = match.group(0).strip()
            # Truncate if too long/messy
            if len(case_title) < 200:
                metadata["case_name"] = case_title
                break

    # 3. Detect Citation (e.g., (2023) 4 SCC 123, 2024 INSC 123, AIR 2022 SC 456)
    citation_patterns = [
        r"\(\d{4}\)\s*\d+\s*SCC\s*\d+",
        r"\d{4}\s*INSC\s*\d+",
        r"AIR\s*\d{4}\s*SC\s*\d+",
        r"AIR\s*\d{4}\s*[A-Za-z]+\s*\d+",
        r"\d{4}\s*SCC\s*OnLine\s*[A-Za-z]+\s*\d+",
    ]
    for pattern in citation_patterns:
        if match := re.search(pattern, text[:3000], re.IGNORECASE):
            metadata["citation"] = match.group(0).strip()
            break

    # 4. Detect Judgment Date
    date_patterns = [
        r"(?:DATE\s*OF\s*JUDGMENT|DECIDED\s*ON|DATED|JUDGMENT\s*DATE)\s*[:\-]?\s*([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+[0-9]{4}|[0-9]{1,2}[\/\.\-][0-9]{1,2}[\/\.\-][0-9]{4})",
        r"([0-9]{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December),?\s+[0-9]{4})",
    ]
    for pattern in date_patterns:
        if match := re.search(pattern, text[:3000], re.IGNORECASE):
            metadata["judgment_date"] = match.group(1).strip()
            break

    return metadata
