import logging
import json
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text, or_
from backend.app.models.legal import LegalChunk, LegalDocument
from backend.app.schemas.legal import LegalChunkMetadata
from backend.app.schemas.rag import RetrievedChunk
from backend.app.legal.case_matching import extract_search_keywords

logger = logging.getLogger(__name__)


class KeywordSearchService:
    """
    Keyword Search Service using PostgreSQL Full-Text Search (tsvector / ts_rank).
    Includes portable fallback for standard SQL / SQLite in testing environments.
    """

    def __init__(self, db_session: Optional[Session] = None):
        self.db = db_session

    def search(self, query: str, top_k: int = 20, db: Optional[Session] = None) -> List[RetrievedChunk]:
        """
        Performs full-text keyword search across legal chunks in PostgreSQL.
        """
        session = db or self.db
        if session is None:
            logger.warning("No database session provided for keyword search.")
            return []

        if not query or not query.strip():
            return []

        cleaned_query = query.strip()
        results: List[RetrievedChunk] = []

        # Detect if connected to PostgreSQL or SQLite
        dialect_name = session.bind.dialect.name if session.bind else "postgresql"

        if dialect_name == "postgresql":
            # PostgreSQL Full Text Search with ts_rank and plainto_tsquery
            pg_sql = text("""
                SELECT 
                    c.id, c.document_id, c.chunk_index, c.chunk_text,
                    c.section_reference, c.paragraph_reference, c.chunk_type, c.metadata_json,
                    d.title, d.court, d.case_name, d.citation, d.judgment_date, d.source_url,
                    ts_rank(to_tsvector('english', c.chunk_text), plainto_tsquery('english', :query)) AS rank_score
                FROM legal_chunks c
                JOIN legal_documents d ON c.document_id = d.id
                WHERE to_tsvector('english', c.chunk_text) @@ plainto_tsquery('english', :query)
                   OR c.chunk_text ILIKE :like_query
                   OR c.section_reference ILIKE :like_query
                ORDER BY rank_score DESC
                LIMIT :limit
            """)
            try:
                rows = session.execute(
                    pg_sql,
                    {"query": cleaned_query, "like_query": f"%{cleaned_query}%", "limit": top_k}
                ).fetchall()

                for row in rows:
                    raw_meta = json.loads(row.metadata_json) if row.metadata_json else {}
                    
                    chunk_meta = LegalChunkMetadata(
                        document_id=row.document_id,
                        chunk_id=row.id,
                        chunk_index=row.chunk_index,
                        case_name=row.case_name or row.title,
                        court=row.court,
                        judgment_date=row.judgment_date,
                        citation=row.citation,
                        section_reference=row.section_reference,
                        paragraph_reference=row.paragraph_reference,
                        document_type="judgment",
                        source_url=row.source_url,
                        page_number=raw_meta.get("page_number")
                    )

                    score = float(row.rank_score) if row.rank_score is not None else 0.5
                    # Normalize rank score roughly between 0.0 and 1.0
                    norm_score = min(1.0, max(0.1, score))

                    results.append(RetrievedChunk(
                        chunk_id=row.id,
                        document_id=row.document_id,
                        chunk_text=row.chunk_text,
                        metadata=chunk_meta,
                        score=norm_score,
                        source_type="keyword"
                    ))
                return results
            except Exception as e:
                logger.warning(f"PostgreSQL FTS query failed or fallback needed: {e}")

        # Fallback for SQLite or when Postgres FTS fails
        try:
            extracted = extract_search_keywords(cleaned_query)
            tokens = extracted if extracted else [t for t in cleaned_query.split() if len(t) > 2]
            tokens = tokens[:6]  # Focus on top distinctive keywords to avoid excessive table scan overhead
            filters = [LegalChunk.chunk_text.ilike(f"%{t}%") for t in tokens]
            if not filters:
                filters = [LegalChunk.chunk_text.ilike(f"%{cleaned_query}%")]

            query_obj = (
                session.query(LegalChunk, LegalDocument)
                .join(LegalDocument, LegalChunk.document_id == LegalDocument.id)
                .filter(or_(*filters))
                .limit(top_k)
            )

            for chunk, doc in query_obj.all():
                raw_meta = json.loads(chunk.metadata_json) if chunk.metadata_json else {}
                
                # Simple term overlap score calculation
                text_lower = chunk.chunk_text.lower()
                matches = sum(1 for t in tokens if t.lower() in text_lower)
                score = min(1.0, matches / max(1, len(tokens)))

                chunk_meta = LegalChunkMetadata(
                    document_id=chunk.document_id,
                    chunk_id=chunk.id,
                    chunk_index=chunk.chunk_index,
                    case_name=doc.case_name or doc.title,
                    court=doc.court,
                    judgment_date=doc.judgment_date,
                    citation=doc.citation,
                    section_reference=chunk.section_reference,
                    paragraph_reference=chunk.paragraph_reference,
                    document_type=doc.document_type,
                    source_url=doc.source_url,
                    page_number=raw_meta.get("page_number")
                )

                results.append(RetrievedChunk(
                    chunk_id=chunk.id,
                    document_id=chunk.document_id,
                    chunk_text=chunk.chunk_text,
                    metadata=chunk_meta,
                    score=score,
                    source_type="keyword"
                ))

            results.sort(key=lambda x: x.score, reverse=True)
            return results[:top_k]
        except Exception as e:
            logger.error(f"Fallback keyword search error: {e}", exc_info=True)
            return []


def get_keyword_search_service(db: Optional[Session] = None) -> KeywordSearchService:
    return KeywordSearchService(db)
