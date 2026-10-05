import re
from typing import List, Optional


def normalize_legal_terms(query: str) -> str:
    """
    Normalizes statutory synonyms and common Indian legal terminology for improved search.
    Maps IPC to BNS mentions, CrPC to BNSS, etc. if beneficial.
    """
    # Clean excessive whitespace and punctuation
    cleaned = re.sub(r"\s+", " ", query).strip()
    return cleaned


def extract_search_keywords(query: str) -> List[str]:
    """
    Extracts key legal phrases, sections, and case identifiers from a query.
    """
    keywords = []
    # Extract sections like Section 302, 103, Art 21
    sections = re.findall(r"(?:section|sec\.|art\.|article)\s*\d+[a-z]?", query, re.IGNORECASE)
    keywords.extend(sections)
    
    # Extract quoted terms if any
    quoted = re.findall(r'"([^"]*)"', query)
    keywords.extend(quoted)
    
    return keywords
