import json
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.core.database import Base
from backend.app.models.legal import LegalDocument, LegalChunk
from backend.app.rag.keyword_search import KeywordSearchService


@pytest.fixture
def in_memory_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    doc = LegalDocument(
        id="doc_100",
        title="Bail Matters under BNSS",
        court="Supreme Court of India",
        case_name="Kishore vs State",
        citation="2024 INSC 500",
        document_type="judgment"
    )
    session.add(doc)

    meta_dict = {
        "document_id": "doc_100",
        "chunk_id": "doc_100_c0",
        "chunk_index": 0,
        "case_name": "Kishore vs State",
        "court": "Supreme Court of India",
        "section_reference": "Section 482 BNSS",
        "page_number": 1
    }
    chunk = LegalChunk(
        id="doc_100_c0",
        document_id="doc_100",
        chunk_index=0,
        chunk_text="The High Court exercise of inherent powers under Section 482 BNSS to quash FIR.",
        section_reference="Section 482 BNSS",
        metadata_json=json.dumps(meta_dict)
    )
    session.add(chunk)
    session.commit()

    yield session
    session.close()


def test_keyword_search(in_memory_db):
    service = KeywordSearchService(db_session=in_memory_db)
    results = service.search(query="Section 482 BNSS quash FIR", top_k=5)

    assert len(results) >= 1
    assert results[0].chunk_id == "doc_100_c0"
    assert "Section 482 BNSS" in results[0].chunk_text
    assert results[0].source_type == "keyword"
