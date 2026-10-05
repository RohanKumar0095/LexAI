import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import get_settings
from backend.app.core.database import Base, engine
import backend.app.models  # register all models (LegalDocument, LegalChunk, User)
from backend.app.api.v1.chat import router as chat_router
from backend.app.api.v1.search import router as search_router
from backend.app.api.v1.documents import router as documents_router
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.complaints import router as complaints_router
from backend.app.api.v1.roadmaps import router as roadmaps_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lexai_backend")

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up LexAI India RAG Backend...")
    try:
        # Create database tables if they do not exist
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not auto-create tables on startup (check database connection): {e}")

    # Pre-warm expensive ML and RAG singletons once during startup
    try:
        logger.info("Pre-warming RAG models and persistent vector store...")
        from backend.app.rag.embeddings import warmup_embedding_service
        from backend.app.rag.vector_store import warmup_vector_store
        from backend.app.rag.reranker import warmup_reranker
        from backend.app.services.rag_service import warmup_rag_service

        warmup_embedding_service()
        warmup_vector_store()
        warmup_reranker()
        warmup_rag_service()
        logger.info("All RAG models, rerankers, and vector stores pre-warmed successfully.")
    except Exception as e:
        logger.warning(f"RAG pre-warmup warning (non-fatal): {e}")

    yield
    logger.info("Shutting down LexAI India RAG Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="LexAI India - Legal RAG Backend powered by FastAPI, ChromaDB, and Gemini",
    lifespan=lifespan
)

# CORS Middleware for LexAI Frontend
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
unique_origins = list(dict.fromkeys([o for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=unique_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(chat_router, prefix=f"{settings.API_V1_STR}/rag", tags=["RAG Chat & Health"])
app.include_router(search_router, prefix=f"{settings.API_V1_STR}/rag", tags=["RAG Search (Debug)"])
app.include_router(documents_router, prefix=f"{settings.API_V1_STR}/documents", tags=["Documents"])
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(complaints_router, prefix=f"{settings.API_V1_STR}/complaints", tags=["Complaints"])
app.include_router(roadmaps_router, prefix=f"{settings.API_V1_STR}/roadmaps", tags=["Roadmaps"])


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "rag_health_url": f"{settings.API_V1_STR}/rag/health"
    }
