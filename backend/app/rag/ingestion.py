import os
import json
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
from sqlalchemy.orm import Session

from backend.app.rag.parser import DocumentParser, ParsedDocument
from backend.app.rag.chunker import LegalChunker
from backend.app.rag.embeddings import EmbeddingService, get_embedding_service
from backend.app.rag.vector_store import VectorStore, get_vector_store
from backend.app.models.legal import LegalDocument, LegalChunk
from backend.app.schemas.legal import LegalChunkCreate

logger = logging.getLogger(__name__)


class IngestionPipeline:
    """
    End-to-end Legal Document Ingestion Pipeline.
    Parses PDF -> Chunks -> Embeds -> Saves to PostgreSQL & ChromaDB.
    """

    def __init__(
        self,
        parser: Optional[DocumentParser] = None,
        chunker: Optional[LegalChunker] = None,
        embedding_service: Optional[EmbeddingService] = None,
        vector_store: Optional[VectorStore] = None,
    ):
        self.parser = parser or DocumentParser()
        self.chunker = chunker or LegalChunker()
        self.embedding_service = embedding_service or get_embedding_service()
        self.vector_store = vector_store or get_vector_store()

    def ingest_pdf(self, file_path: str, db: Session, source_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Ingests a single PDF file into PostgreSQL and ChromaDB with upsert semantics.
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        logger.info(f"Starting ingestion for: {path.name}")
        
        # 1. Parse PDF
        parsed_doc: ParsedDocument = self.parser.parse_pdf(str(path))
        doc_meta = parsed_doc.metadata
        if source_url:
            doc_meta["source_url"] = source_url

        doc_id = parsed_doc.document_id

        # 2. Chunk Document
        chunks: List[LegalChunkCreate] = self.chunker.chunk_document(parsed_doc)
        if not chunks:
            raise ValueError(f"No extractable chunks found in {path.name}")

        # 3. Generate Embeddings
        chunk_texts = [c.chunk_text for c in chunks]
        logger.info(f"Generating embeddings for {len(chunks)} chunks...")
        embeddings = self.embedding_service.embed_documents(chunk_texts)

        # 4. Store in PostgreSQL (Upsert document & chunks)
        existing_doc = db.query(LegalDocument).filter(LegalDocument.id == doc_id).first()
        if existing_doc:
            logger.info(f"Updating existing document metadata for doc_id '{doc_id}'")
            existing_doc.title = doc_meta.get("title", existing_doc.title)
            existing_doc.court = doc_meta.get("court", existing_doc.court)
            existing_doc.case_name = doc_meta.get("case_name", existing_doc.case_name)
            existing_doc.citation = doc_meta.get("citation", existing_doc.citation)
            existing_doc.judgment_date = doc_meta.get("judgment_date", existing_doc.judgment_date)
            existing_doc.source_url = doc_meta.get("source_url", existing_doc.source_url)
            
            # Delete old chunks for this doc in PostgreSQL to maintain consistency
            db.query(LegalChunk).filter(LegalChunk.document_id == doc_id).delete()
        else:
            new_doc = LegalDocument(
                id=doc_id,
                title=doc_meta.get("title", path.stem),
                document_type=doc_meta.get("document_type", "judgment"),
                source=doc_meta.get("source", "Supreme Court of India"),
                source_url=doc_meta.get("source_url"),
                court=doc_meta.get("court"),
                case_name=doc_meta.get("case_name"),
                citation=doc_meta.get("citation"),
                judgment_date=doc_meta.get("judgment_date"),
                jurisdiction=doc_meta.get("jurisdiction", "India"),
                language="en",
            )
            db.add(new_doc)

        # Insert new chunks in PostgreSQL
        for c in chunks:
            raw_meta_dict = c.metadata.model_dump()
            db_chunk = LegalChunk(
                id=c.id,
                document_id=c.document_id,
                chunk_index=c.chunk_index,
                chunk_text=c.chunk_text,
                section_reference=c.section_reference,
                paragraph_reference=c.paragraph_reference,
                chunk_type=c.chunk_type,
                metadata_json=json.dumps(raw_meta_dict)
            )
            db.add(db_chunk)
        
        db.commit()
        logger.info(f"Persisted {len(chunks)} chunks in PostgreSQL for document {doc_id}")

        # 5. Store in ChromaDB (Delete old if needed, then upsert)
        try:
            self.vector_store.delete_document_chunks(doc_id)
            self.vector_store.upsert_chunks(chunks, embeddings)
            logger.info(f"Persisted {len(chunks)} vectors in ChromaDB for document {doc_id}")
        except Exception as e:
            logger.error(f"Error persisting vectors to ChromaDB: {e}", exc_info=True)
            raise

        return {
            "document_id": doc_id,
            "title": doc_meta.get("title"),
            "chunks_count": len(chunks),
            "status": "success",
            "file": path.name
        }


def get_ingestion_pipeline() -> IngestionPipeline:
    return IngestionPipeline()
