import os
import sys
import logging
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.core.config import get_settings
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.legal import LegalDocument, LegalChunk
from backend.app.rag.vector_store import get_vector_store
from backend.scripts.ingest_documents import run_ingestion

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("rebuild_index")


def rebuild_index(data_dir: str = "backend/data/raw"):
    """
    Rebuilds the entire index by deleting and re-ingesting all raw documents.
    """
    logger.info("Starting complete index rebuild...")
    settings = get_settings()

    # Re-ingest with force reindex
    run_ingestion(data_dir=data_dir, force_reindex=True)
    logger.info("Index rebuild completed.")


if __name__ == "__main__":
    rebuild_index()
