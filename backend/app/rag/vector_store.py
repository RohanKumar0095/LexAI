import os
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
from backend.app.core.config import get_settings
from backend.app.schemas.legal import LegalChunkCreate, LegalChunkMetadata
from backend.app.schemas.rag import RetrievedChunk

logger = logging.getLogger(__name__)


class VectorStore:
    """
    Persistent ChromaDB vector store abstraction for Legal RAG.
    Maintains client and collection caches to avoid reopening on every request.
    """

    _client_cache: dict = {}
    _collection_cache: dict = {}

    def __init__(self, chroma_path: Optional[str] = None, collection_name: Optional[str] = None):
        settings = get_settings()
        self.chroma_path = chroma_path or settings.CHROMA_PATH
        self.collection_name = collection_name or settings.CHROMA_COLLECTION_NAME
        self._client = None
        self._collection = None
        self._initialize()

    def _initialize(self):
        try:
            import chromadb
            from chromadb.config import Settings as ChromaSettings

            Path(self.chroma_path).mkdir(parents=True, exist_ok=True)
            
            # Reuse cached client if available
            if self.chroma_path in VectorStore._client_cache:
                self._client = VectorStore._client_cache[self.chroma_path]
            else:
                self._client = chromadb.PersistentClient(path=self.chroma_path)
                VectorStore._client_cache[self.chroma_path] = self._client

            # Reuse cached collection if available
            coll_key = (self.chroma_path, self.collection_name)
            if coll_key in VectorStore._collection_cache:
                self._collection = VectorStore._collection_cache[coll_key]
            else:
                self._collection = self._client.get_or_create_collection(
                    name=self.collection_name,
                    metadata={"hnsw:space": "cosine"}
                )
                VectorStore._collection_cache[coll_key] = self._collection

            logger.info(f"Initialized/reused ChromaDB at '{self.chroma_path}' with collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}", exc_info=True)
            self._client = None
            self._collection = None

    def is_healthy(self) -> bool:
        if self._collection is None:
            self._initialize()
        return self._collection is not None

    def _sanitize_metadata(self, meta: LegalChunkMetadata) -> Dict[str, Any]:
        """
        Converts LegalChunkMetadata to ChromaDB-compatible flat primitives (str, int, float, bool).
        """
        raw = meta.model_dump()
        sanitized = {}
        for k, v in raw.items():
            if k == "extra":
                continue  # skip nested dict
            if v is None:
                sanitized[k] = ""
            elif isinstance(v, (str, int, float, bool)):
                sanitized[k] = v
            else:
                sanitized[k] = str(v)
        return sanitized

    def upsert_chunks(self, chunks: List[LegalChunkCreate], embeddings: List[List[float]]) -> None:
        """
        Upserts chunk vectors and metadata into ChromaDB.
        """
        if not chunks:
            return
        if self._collection is None:
            self._initialize()
        if self._collection is None:
            raise RuntimeError("ChromaDB vector store is unavailable.")

        ids = [c.id for c in chunks]
        documents = [c.chunk_text for c in chunks]
        metadatas = [self._sanitize_metadata(c.metadata) for c in chunks]

        logger.info(f"Upserting {len(ids)} chunks to ChromaDB collection '{self.collection_name}'")
        self._collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def search(self, query_embedding: List[float], top_k: int = 20) -> List[RetrievedChunk]:
        """
        Searches ChromaDB using cosine distance and returns normalized similarity scores.
        """
        if not query_embedding:
            return []
        if self._collection is None:
            self._initialize()
        if self._collection is None:
            raise RuntimeError("ChromaDB vector store is unavailable.")

        count = self.count()
        if count == 0:
            logger.info("ChromaDB collection is currently empty.")
            return []

        n_results = min(top_k, count)
        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )

        retrieved: List[RetrievedChunk] = []
        if not results or not results.get("ids") or not results["ids"][0]:
            return retrieved

        ids = results["ids"][0]
        documents = results["documents"][0] if results.get("documents") else []
        metadatas = results["metadatas"][0] if results.get("metadatas") else []
        distances = results["distances"][0] if results.get("distances") else []

        for idx, chunk_id in enumerate(ids):
            text = documents[idx] if idx < len(documents) else ""
            raw_meta = metadatas[idx] if idx < len(metadatas) else {}
            dist = distances[idx] if idx < len(distances) else 1.0
            
            # Cosine distance to similarity: similarity = 1 - distance (or max(0, 1 - dist))
            score = max(0.0, 1.0 - float(dist))

            chunk_meta = LegalChunkMetadata(
                document_id=str(raw_meta.get("document_id", "")),
                chunk_id=chunk_id,
                chunk_index=int(raw_meta.get("chunk_index", 0)),
                case_name=raw_meta.get("case_name") or None,
                court=raw_meta.get("court") or None,
                judgment_date=raw_meta.get("judgment_date") or None,
                citation=raw_meta.get("citation") or None,
                section_reference=raw_meta.get("section_reference") or None,
                paragraph_reference=raw_meta.get("paragraph_reference") or None,
                document_type=str(raw_meta.get("document_type", "judgment")),
                source_url=raw_meta.get("source_url") or None,
                page_number=int(raw_meta["page_number"]) if raw_meta.get("page_number") and str(raw_meta["page_number"]).isdigit() else None,
            )

            retrieved.append(RetrievedChunk(
                chunk_id=chunk_id,
                document_id=chunk_meta.document_id,
                chunk_text=text,
                metadata=chunk_meta,
                score=score,
                source_type="vector"
            ))

        return retrieved

    def delete_document_chunks(self, document_id: str) -> None:
        """
        Deletes all chunks belonging to a document ID.
        """
        if self._collection is None:
            self._initialize()
        if self._collection is not None:
            try:
                self._collection.delete(where={"document_id": document_id})
                logger.info(f"Deleted Chroma chunks for document '{document_id}'")
            except Exception as e:
                logger.warning(f"Error deleting chunks for document {document_id}: {e}")

    def count(self) -> int:
        if self._collection is None:
            self._initialize()
        if self._collection is None:
            return 0
        try:
            return self._collection.count()
        except Exception:
            return 0


_shared_vector_store: Optional[VectorStore] = None


def get_vector_store() -> VectorStore:
    global _shared_vector_store
    if _shared_vector_store is None:
        _shared_vector_store = VectorStore()
    return _shared_vector_store


def warmup_vector_store() -> VectorStore:
    """Pre-initializes the vector store and collection once at startup."""
    return get_vector_store()
