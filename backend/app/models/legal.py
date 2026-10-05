import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(512), nullable=False, index=True)
    document_type = Column(String(100), default="judgment", index=True)  # judgment, act, circular, rule
    source = Column(String(256), default="Supreme Court of India")
    source_url = Column(String(1024), nullable=True)
    court = Column(String(256), nullable=True, index=True)
    case_name = Column(String(512), nullable=True, index=True)
    citation = Column(String(256), nullable=True, index=True)
    judgment_date = Column(String(64), nullable=True)
    jurisdiction = Column(String(128), default="India")
    language = Column(String(32), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    chunks = relationship("LegalChunk", back_populates="document", cascade="all, delete-orphan")


class LegalChunk(Base):
    __tablename__ = "legal_chunks"

    id = Column(String(128), primary_key=True, index=True)  # Deterministic: doc_id + '_' + str(chunk_index)
    document_id = Column(String(64), ForeignKey("legal_documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    section_reference = Column(String(256), nullable=True, index=True)
    paragraph_reference = Column(String(128), nullable=True)
    chunk_type = Column(String(64), default="body")  # heading, body, headnote, order
    metadata_json = Column(Text, nullable=True)  # Stored as serialized JSON string for db portability
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("LegalDocument", back_populates="chunks")

    __table_args__ = (
        Index("idx_legal_chunks_doc_idx", "document_id", "chunk_index"),
    )
