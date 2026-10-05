import pytest
import tempfile
from backend.app.rag.vector_store import VectorStore
from backend.app.schemas.legal import LegalChunkCreate, LegalChunkMetadata


def test_vector_store_operations(tmp_path):
    chroma_dir = str(tmp_path / "test_chroma")
    vstore = VectorStore(chroma_path=chroma_dir, collection_name="test_collection")

    assert vstore.is_healthy()
    assert vstore.count() == 0

    meta = LegalChunkMetadata(
        document_id="doc_1",
        chunk_id="doc_1_c0",
        chunk_index=0,
        case_name="State vs Anil",
        court="Supreme Court",
        citation="2024 SC 100",
        section_reference="Section 302 IPC"
    )
    chunk = LegalChunkCreate(
        id="doc_1_c0",
        document_id="doc_1",
        chunk_index=0,
        chunk_text="The accused was convicted under Section 302 IPC for murder.",
        section_reference="Section 302 IPC",
        metadata=meta
    )

    # Upsert chunk
    embedding = [0.1] * 384
    vstore.upsert_chunks([chunk], [embedding])

    assert vstore.count() == 1

    # Search
    results = vstore.search(query_embedding=[0.1] * 384, top_k=5)
    assert len(results) == 1
    assert results[0].chunk_id == "doc_1_c0"
    assert results[0].metadata.case_name == "State vs Anil"

    # Delete
    vstore.delete_document_chunks("doc_1")
    assert vstore.count() == 0
