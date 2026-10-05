import os
from pathlib import Path
from functools import lru_cache
from typing import Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Determine backend directory and .env absolute locations
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_ENV_FILE = BACKEND_DIR / ".env"
ROOT_ENV_FILE = BACKEND_DIR.parent / ".env"

# Explicitly load backend/.env into os.environ so all external SDKs have it
if BACKEND_ENV_FILE.exists():
    load_dotenv(BACKEND_ENV_FILE, override=False)
elif ROOT_ENV_FILE.exists():
    load_dotenv(ROOT_ENV_FILE, override=False)


class Settings(BaseSettings):
    PROJECT_NAME: str = "LexAI India Legal RAG"
    API_V1_STR: str = "/api/v1"
    
    # Database (PostgreSQL)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/lexai_db"
    
    # Gemini Configuration
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    
    # ChromaDB Configuration
    CHROMA_PATH: str = "./backend/chroma"
    CHROMA_COLLECTION_NAME: str = "lexai_legal_chunks"
    
    # Embedding Model
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Reranker Model (optional cross-encoder)
    RERANKER_MODEL: Optional[str] = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    
    # Retrieval Configuration
    RETRIEVAL_TOP_K: int = 20
    RERANK_TOP_K: int = 5
    VECTOR_WEIGHT: float = 0.6
    KEYWORD_WEIGHT: float = 0.4
    
    # Frontend & CORS
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Chunking Configuration
    DEFAULT_CHUNK_SIZE: int = 1000
    DEFAULT_CHUNK_OVERLAP: int = 200

    model_config = SettingsConfigDict(
        env_file=(str(BACKEND_ENV_FILE), str(ROOT_ENV_FILE), ".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def __init__(self, **values):
        super().__init__(**values)
        # Ensure GEMINI_API_KEY is synchronized to os.environ if present
        if self.GEMINI_API_KEY and not os.environ.get("GEMINI_API_KEY"):
            os.environ["GEMINI_API_KEY"] = self.GEMINI_API_KEY.strip()


@lru_cache()
def get_settings() -> Settings:
    return Settings()
