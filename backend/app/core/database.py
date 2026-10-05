import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

def _create_engine_with_fallback(primary_url: str):
    connect_args = {}
    if "sqlite" in primary_url:
        connect_args = {"check_same_thread": False}
    try:
        eng = create_engine(primary_url, pool_pre_ping=True, connect_args=connect_args)
        # Verify connection
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info(f"Connected successfully to database: {primary_url.split('@')[-1] if '@' in primary_url else primary_url}")
        return eng
    except Exception as e:
        logger.warning(
            f"Could not connect to configured database ({e}). "
            f"Falling back to persistent SQLite at 'sqlite:///./backend/lexai_legal.db'."
        )
        fallback_url = "sqlite:///./backend/lexai_legal.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})


db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = _create_engine_with_fallback(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """Check if the database connection is healthy."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        return False
