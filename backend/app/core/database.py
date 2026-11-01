import logging
from pathlib import Path
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_SQLITE_PATH = (BACKEND_DIR / "lexai_legal.db").resolve()


def _normalize_db_url(url: str) -> str:
    """
    Normalizes database connection string:
    - Normalizes 'postgres://' to 'postgresql://'.
    - If 'postgresql://' without explicit driver is given and psycopg (v3) is missing,
      automatically selects 'psycopg2' if installed.
    - Resolves relative SQLite paths against the backend directory to avoid CWD issues.
    """
    if not url:
        return f"sqlite:///{DEFAULT_SQLITE_PATH.as_posix()}"

    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    if url.startswith("postgresql://") and "+" not in url.split("://")[0]:
        try:
            import psycopg  # noqa: F401
        except ImportError:
            try:
                import psycopg2  # noqa: F401
                url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
            except ImportError:
                pass

    if url.startswith("sqlite:///"):
        subpath = url.replace("sqlite:///", "")
        if subpath.startswith("./"):
            subpath = subpath[2:]
        resolved_candidate = Path(subpath).resolve()
        if resolved_candidate.exists():
            return f"sqlite:///{resolved_candidate.as_posix()}"
        if DEFAULT_SQLITE_PATH.exists():
            return f"sqlite:///{DEFAULT_SQLITE_PATH.as_posix()}"

    return url


def _create_engine_with_fallback(primary_url: str):
    primary_url = _normalize_db_url(primary_url)
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
        fallback_path = DEFAULT_SQLITE_PATH.as_posix() if DEFAULT_SQLITE_PATH.exists() else "./backend/lexai_legal.db"
        logger.warning(
            f"Could not connect to configured database ({e}). "
            f"Falling back to persistent SQLite at 'sqlite:///{fallback_path}'."
        )
        fallback_url = f"sqlite:///{fallback_path}"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})


db_url = _normalize_db_url(settings.DATABASE_URL)
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
