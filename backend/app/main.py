from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.core.config import settings
from backend.app.api.v1.router import api_router


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API foundation for LexAI: Supabase Auth, Profiles, Conversations, Messages, Search History, and Memories.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS using FRONTEND_URL
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
# Remove duplicates while preserving order
unique_origins = list(dict.fromkeys([o for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=unique_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def read_root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


# Include Version 1 API routes
app.include_router(api_router, prefix=settings.API_V1_STR)
