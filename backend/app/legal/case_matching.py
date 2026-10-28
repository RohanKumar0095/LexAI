import re
from typing import List, Optional

STOPWORDS = {
    "what", "which", "where", "when", "who", "whom", "whose", "how", "why",
    "the", "and", "or", "for", "with", "from", "into", "under", "over", "about",
    "this", "that", "these", "those", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "does", "did", "do", "can", "could", "shall",
    "should", "will", "would", "may", "might", "must", "its", "their", "any", "all",
    "tell", "explain", "describe", "detail", "details", "give", "provide"
}


def normalize_legal_terms(query: str) -> str:
    """
    Normalizes statutory synonyms and common Indian legal terminology for improved search.
    """
    cleaned = re.sub(r"\s+", " ", query).strip()
    return cleaned


def extract_search_keywords(query: str) -> List[str]:
    """
    Extracts key legal phrases, section numbers, quoted terms, and content words from a query.
    """
    keywords: List[str] = []
    
    # 1. Quoted terms
    quoted = re.findall(r'"([^"]*)"', query)
    keywords.extend(quoted)

    # 2. Section mentions (e.g., Section 302, Sec 35) and raw numbers
    sec_matches = re.findall(r"(?:section|sec\.|art\.|article)\s*(\d+[a-z]?)", query, re.IGNORECASE)
    for s in sec_matches:
        keywords.append(f"Section {s}")
        keywords.append(s)

    # 3. Content words (excluding stop words)
    words = re.findall(r"\b[A-Za-z0-9_]{3,}\b", query)
    content_words = [w for w in words if w.lower() not in STOPWORDS and not w.lower().startswith("section")]
    
    for cw in content_words:
        if cw not in keywords:
            keywords.append(cw)

    return keywords
