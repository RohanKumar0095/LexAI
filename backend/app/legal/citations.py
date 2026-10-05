import re
from typing import List, Dict, Any, Optional


def extract_section_references(text: str) -> List[str]:
    """
    Extracts statutory sections (e.g. Section 103 BNS, Section 302 IPC, Section 138 NI Act, Article 21).
    """
    patterns = [
        r"(?:Section|Sec\.|u/s|u/ss)\s*([0-9]+[A-Za-z]?(?:\([0-9a-zA-Z]+\))*)\s*(?:of\s+the\s+)?([A-Za-z\s\(\)]+Act|[A-Za-z\s\(\)]+Code|IPC|BNS|BNSS|CrPC|CPC|IEA|BSA)?",
        r"(?:Article|Art\.)\s*([0-9]+[A-Za-z]?(?:\([0-9a-zA-Z]+\))*)\s*(?:of\s+the\s+Constitution)?",
        r"(?:Order\s+[0-9IVXLCDM]+\s+Rule\s+[0-9IVXLCDM]+)",
    ]
    references = []
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            ref = match.group(0).strip()
            # Clean up whitespace
            ref = re.sub(r"\s+", " ", ref)
            if len(ref) < 80 and ref not in references:
                references.append(ref)
    return references


def format_citation(source_dict: Dict[str, Any]) -> str:
    """
    Formats a legal citation string cleanly.
    """
    parts = []
    case_name = source_dict.get("case_name") or source_dict.get("title")
    if case_name:
        parts.append(case_name)
    
    court = source_dict.get("court")
    if court:
        parts.append(court)
        
    citation = source_dict.get("citation")
    if citation:
        parts.append(f"Citation: {citation}")
        
    date = source_dict.get("judgment_date")
    if date:
        parts.append(f"Date: {date}")

    sec = source_dict.get("section_reference")
    if sec:
        parts.append(f"Section/Provision: {sec}")

    page = source_dict.get("page_number")
    if page:
        parts.append(f"Page: {page}")

    return " | ".join(parts)
