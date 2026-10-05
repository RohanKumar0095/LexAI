# LexAI India — Full-Stack Legal Intelligence Platform

A production-grade legal intelligence and citizen rights platform combining a modern **React 19 + TypeScript + Vite** frontend (`frontend/`) with a grounded **FastAPI + ChromaDB + SentenceTransformers + Gemini** Legal RAG backend (`backend/`).

---

## 1. System Architecture

```
[ User in Browser ]
        │
        ▼
[ React 19 Frontend (Vite Port 5173) ]
        │
        ├── AuthContext / authApi.ts ──────────► POST /api/v1/auth/*
        │                                             │
        └── useChat / apiService.ts ───────────► POST /api/v1/rag/chat
                                                      │
                                                      ▼
                                       [ FastAPI Backend (Port 8001) ]
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
            [ SQLite / PostgreSQL ]                                        [ LegalRAGService ]
            - Users, PBKDF2 Sessions                                                 │
                                                                                     ▼
                                                                           [ LegalRAGPipeline ]
                                                                                     │
                                                                                     ├─► Vector Search (ChromaDB - 1,177 Chunks)
                                                                                     ├─► Keyword Search (BM25 FTS)
                                                                                     ├─► Reciprocal Rank Fusion (RRF)
                                                                                     ├─► Cross-Encoder Neural Reranker
                                                                                     │
                                                                                     ▼
                                                                           [ Gemini LLM Service ]
                                                                           Model: gemini-3.5-flash-lite
                                                                                     │
                                                                                     ▼
                                                                           [ Grounded Legal Answer + Sources ]
                                                                                     │
                                                                                     ▼
                                                                   [ JSON Response to React Frontend ]
```

---

## 2. Project Structure

```
LEX-AI/
├── .gitignore                                 # Git exclusions (Python, Node, build, secrets)
├── README.md                                  # Platform documentation
│
├── backend/                                   # FastAPI Backend Application
│   ├── .env                                   # Backend environment variables
│   ├── .env.example                           # Backend environment template
│   ├── requirements.txt                       # Python dependencies
│   ├── lexai_legal.db                         # SQLite local database
│   │
│   ├── app/                                   # Backend source code
│   │   ├── main.py                            # FastAPI app, lifespan, CORS & routers
│   │   ├── api/v1/                            # API endpoints (chat, auth, documents, complaints, roadmaps)
│   │   ├── core/                              # Pydantic configuration & database session
│   │   ├── legal/                             # Legal citations, sections, and metadata rules
│   │   ├── llm/                               # Google Gemini GenAI service
│   │   ├── models/                            # SQLAlchemy models (User, LegalDocument, LegalChunk)
│   │   ├── rag/                               # Legal RAG (chunker, embeddings, retriever, reranker, parser)
│   │   ├── schemas/                           # Pydantic validation models
│   │   └── services/                          # Business and orchestration services
│   │
│   ├── chroma/                                # ChromaDB vector store (1,177 legal chunks)
│   ├── data/raw/                              # Source statutory PDFs (BNSS 2023, Supreme Court appeals)
│   ├── scripts/                               # CLI batch ingestion & index scripts
│   └── tests/                                 # Automated Pytest suite (25 tests)
│
└── frontend/                                  # React 19 Frontend Application
    ├── .env                                   # Frontend environment config (VITE_API_BASE_URL)
    ├── .env.example                           # Frontend environment template
    ├── package.json                           # React 19, Vite & Tailwind dependencies
    ├── vite.config.ts                         # Vite configuration
    ├── tsconfig.json                          # TypeScript configuration
    ├── index.html                             # Single-page HTML entry point
    │
    ├── public/                                # Public web assets
    │   └── assets/logo.jpg
    │
    └── src/
        ├── main.tsx                           # React DOM root entry point
        ├── App.tsx                            # Root application routing & auth guards
        ├── App.css / index.css                # Global Tailwind styling
        │
        ├── components/                        # Marketing landing page & UI design system
        ├── context/                           # AuthContext (token persistence & guest mode)
        ├── services/                          # Centralized HTTP services
        │   ├── apiClient.ts                   # Centralized API base URL & request headers
        │   └── authApi.ts                     # Authoritative user authentication service
        │
        └── features/workspace/                # Legal AI Workspace Feature Module
            ├── WorkspaceApp.tsx               # Workspace app shell & panel controller
            ├── components/                    # ChatScreen, AppShell, Sidebar, panels
            │   ├── chat/                      # ChatScreen, ChatInput, ChatMessage
            │   ├── home/                      # DailyLawCard, WelcomeSection
            │   ├── layout/                    # AppShell, Sidebar, MobileSidebar
            │   └── panels/                    # DocumentAi, Complaint, Roadmap, SOS, etc.
            ├── hooks/                         # useChat, useSidebar, useTheme
            ├── services/                      # Modular workspace APIs
            │   ├── apiService.ts              # Consolidated workspace API
            │   ├── chatApi.ts                 # Chat queries & RAG synthesis
            │   ├── dailyLawApi.ts             # Featured statutory rights
            │   ├── documentApi.ts             # Contract & clause risk analysis
            │   ├── complaintApi.ts            # Statutory legal complaint drafting
            │   └── roadmapApi.ts              # Legal roadmap procedures
            ├── types/                         # TypeScript interfaces (chat, legal, user)
            └── data/                          # Fallback & offline sample data
```

---

## 3. Quick Start Guide

### 3.1 Backend Setup & Run

Activate the Python virtual environment and start the FastAPI server:

```powershell
# In project root
.\venv\Scripts\Activate.ps1

# Start FastAPI server on port 8001
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001 --reload
```

- **Interactive Swagger Documentation**: `http://127.0.0.1:8001/docs`
- **Health Endpoint**: `http://127.0.0.1:8001/api/v1/rag/health`

### 3.2 Frontend Setup & Run

Open a second terminal, navigate to the `frontend` folder, and launch Vite:

```powershell
cd frontend
npm install
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

---

## 4. Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL`: PostgreSQL connection string (falls back to local SQLite at `./backend/lexai_legal.db`).
- `GEMINI_API_KEY`: API key from Google AI Studio.
- `GEMINI_MODEL`: `gemini-3.5-flash-lite`
- `CHROMA_PATH`: `./backend/chroma`
- `CHROMA_COLLECTION_NAME`: `lexai_legal_chunks`
- `EMBEDDING_MODEL`: `sentence-transformers/all-MiniLM-L6-v2`
- `RERANKER_MODEL`: `cross-encoder/ms-marco-MiniLM-L-6-v2`
- `RETRIEVAL_TOP_K`: `20`
- `RERANK_TOP_K`: `5`
- `FRONTEND_URL`: `http://localhost:5173`
- `LEXAI_API_URL`: `http://127.0.0.1:8001`

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`: `http://127.0.0.1:8001`

---

## 5. API Endpoints

| Feature | Frontend Trigger | Backend Endpoint | Method | Technology |
|---|---|---|---|---|
| **Legal RAG Chat** | Chat Input / Send | `/api/v1/rag/chat` | `POST` | ChromaDB + BM25 + Cross-Encoder reranker + Gemini LLM |
| **System Health** | Health status check | `/api/v1/rag/health` | `GET` | ChromaDB vector count + SQLite/Postgres check |
| **Document AI** | Document AI Panel | `/api/v1/documents/analyze` | `POST` | PyMuPDF text parser + Gemini clause risk analysis |
| **Complaint Drafts** | Complaint Generator | `/api/v1/complaints/generate` | `POST` | Statutory drafting generator (Consumer, Police, RTI, Notice) |
| **Legal Roadmaps** | Roadmap Panel | `/api/v1/roadmaps/{id}` | `GET` | Step-by-step procedural guidelines under Indian Law |
| **Daily Law** | Home / Daily Law | `/api/v1/rag/daily-law` | `GET` | Featured statutory rights & practical citizen tips |
| **Authentication** | Login / Signup | `/api/v1/auth/signup`<br>`/api/v1/auth/login`<br>`/api/v1/auth/me` | `POST`<br>`POST`<br>`GET` | Salted PBKDF2 hashing + JWT tokens + Guest mode fallback |

---

## 6. Running Tests

### Backend Test Suite
```powershell
python -m pytest backend/tests -v
```

### Frontend Typecheck & Build
```powershell
cd frontend
npm run build
```
