import os
import sys
import argparse
import logging
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.core.config import get_settings
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.legal import LegalDocument
from backend.app.rag.ingestion import get_ingestion_pipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("ingest_documents")


def run_ingestion(data_dir: str = "backend/data/raw", force_reindex: bool = False):
    """
    Scans the specified directory for PDF documents and ingests them into the RAG pipeline.
    """
    settings = get_settings()
    logger.info(f"Starting Legal Document Ingestion from: {data_dir}")

    # Ensure database schema is up to date
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified.")
    except Exception as e:
        logger.error(f"Database table verification failed: {e}")
        return

    raw_path = Path(data_dir)
    if not raw_path.exists():
        logger.info(f"Directory '{data_dir}' does not exist. Creating it now...")
        raw_path.mkdir(parents=True, exist_ok=True)

    pdf_files = list(raw_path.glob("*.pdf")) + list(raw_path.glob("*.PDF"))
    if not pdf_files:
        logger.warning(
            f"No PDF files found in '{data_dir}'.\n"
            f"Please place Indian legal judgments or statutory PDF files in '{data_dir}' and rerun."
        )
        return

    logger.info(f"Found {len(pdf_files)} PDF documents to process.")

    db = SessionLocal()
    pipeline = get_ingestion_pipeline()

    success_count = 0
    skipped_count = 0
    failed_count = 0

    for pdf_path in pdf_files:
        print("\n" + "=" * 60)
        print(f"Processing: {pdf_path.name}")
        print("=" * 60)
        
        try:
            # Check if document is already indexed if not forcing reindex
            # We use content hash or path check
            content_bytes = pdf_path.read_bytes()
            doc_id = pipeline.parser.compute_document_id(str(pdf_path), content_bytes)
            
            existing = db.query(LegalDocument).filter(LegalDocument.id == doc_id).first()
            if existing and not force_reindex:
                logger.info(f"Skipping already indexed document '{pdf_path.name}' (ID: {doc_id}). Use --reindex to force.")
                skipped_count += 1
                continue

            result = pipeline.ingest_pdf(str(pdf_path), db=db)
            print(f"[SUCCESS] Ingested document: {result['title']}")
            print(f"          Document ID: {result['document_id']}")
            print(f"          Chunks count: {result['chunks_count']}")
            success_count += 1
        except Exception as e:
            logger.error(f"[FAILED] Error ingesting {pdf_path.name}: {e}", exc_info=True)
            failed_count += 1

    db.close()

    print("\n" + "=" * 60)
    print("INGESTION SUMMARY:")
    print(f"  Total Files:   {len(pdf_files)}")
    print(f"  Successful:    {success_count}")
    print(f"  Skipped:       {skipped_count}")
    print(f"  Failed:        {failed_count}")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest PDF legal documents into LexAI RAG system.")
    parser.add_argument("--data-dir", type=str, default="backend/data/raw", help="Path to raw PDFs directory")
    parser.add_argument("--reindex", action="store_true", help="Force re-indexing of already processed documents")
    args = parser.parse_args()

    run_ingestion(data_dir=args.data_dir, force_reindex=args.reindex)
