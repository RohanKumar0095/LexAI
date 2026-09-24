# LexAI Backend Foundation

Backend API foundation for LexAI providing Supabase Email/Password Authentication, User Profiles, Conversations, Messages, Search History, and User Memory with database-level Row Level Security (RLS).

---

## Architecture Overview

```
auth.users (Supabase Auth)
  │
  └── (1:1) public.profiles
              │
              ├── public.conversations
              │     └── public.messages
              │
              ├── public.search_history
              │
              └── public.user_memories
```

- **Framework**: FastAPI (Python 3.11+)
- **Authentication**: Supabase Auth (Email + Password only)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Validation**: Pydantic v2 schemas with strict constraints
- **Testing**: Pytest with automated in-memory test harness and cross-user authorization isolation tests

---

## 1. Supabase Project Setup

1. Log in to [Supabase](https://supabase.com/) and create a new project.
2. Navigate to **Project Settings** > **API**:
   - Copy **Project URL** (`SUPABASE_URL`)
   - Copy **anon public API Key** (`SUPABASE_ANON_KEY`)
   - Copy **service_role secret API Key** (`SUPABASE_SERVICE_ROLE_KEY`) *(Keep server-side only; never expose to frontend)*

3. Navigate to **Authentication** > **Providers** > **Email**:
   - Ensure **Email provider** is **Enabled**.
   - Under **Email Auth Settings**:
     - *Development*: Disable **Confirm email** for instant login during development.
     - *Production*: Enable **Confirm email** to verify real user addresses.

---

## 2. Database Migrations

Apply the migration SQL file to your Supabase PostgreSQL database:

1. Open your Supabase Dashboard > **SQL Editor**.
2. Open and copy the contents of:
   ```
   backend/supabase/migrations/20260924000001_initial_schema.sql
   ```
3. Paste into the SQL Editor and click **Run**.

This will create:
- `public.profiles` table with automatic `auth.users` insert trigger (`handle_new_user()`)
- `public.conversations` table
- `public.messages` table with role check constraint (`user`, `assistant`, `system`)
- `public.search_history` table
- `public.user_memories` table with `is_active` state
- Performance indexes on foreign keys and timestamps
- Row Level Security (RLS) policies enforcing `auth.uid() = user_id`

---

## 3. Environment Configuration

Create `.env` in the `backend/` directory (or root directory):

```bash
cp backend/.env.example backend/.env
```

Configure your credentials in `backend/.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=http://localhost:5173
```

> **Security Note**: Never commit `.env` to version control. `.env` is ignored by `.gitignore`.

---

## 4. Local Development

### Prerequisites
- Python 3.11+
- Virtual environment tool

### Installation

```powershell
# From the project root or backend directory:
python -m venv backend/.venv
backend/.venv/Scripts/pip install -r backend/requirements.txt
```

### Start Backend Server

```powershell
# In PowerShell:
$env:PYTHONPATH = "."
backend\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --port 8000
```

The backend server will run at `http://localhost:8000`.

---

## 5. API Documentation

Interactive OpenAPI documentation is automatically available:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

To authenticate in Swagger UI:
1. Call `POST /api/v1/auth/login` (or `POST /api/v1/auth/signup`).
2. Copy `access_token`.
3. Click the **Authorize** button at the top right of Swagger UI and enter:
   `Bearer <access_token>`

---

## 6. Running Tests

Run the complete 36-test suite covering authentication, profile management, conversations, messages, search history, user memories, cross-user authorization isolation, and data persistence:

```powershell
$env:PYTHONPATH = "."
backend\.venv\Scripts\pytest.exe -c backend\pytest.ini backend\tests -v
```

---

## 7. API Endpoints Reference

### Authentication
- `POST /api/v1/auth/signup`: Email/password registration
- `POST /api/v1/auth/login`: Email/password authentication returning tokens
- `POST /api/v1/auth/logout`: Session termination
- `GET /api/v1/auth/me`: Current session user info

### User Profiles
- `GET /api/v1/users/me`: Get authenticated user profile
- `PATCH /api/v1/users/me`: Update full name and avatar URL

### Conversations
- `POST /api/v1/conversations`: Create conversation
- `GET /api/v1/conversations`: List conversations with pagination (`?page=1&page_size=20`)
- `GET /api/v1/conversations/{id}`: Get single conversation
- `PATCH /api/v1/conversations/{id}`: Update conversation title
- `DELETE /api/v1/conversations/{id}`: Delete conversation

### Messages
- `POST /api/v1/conversations/{id}/messages`: Create message (`role` in `user`, `assistant`, `system`)
- `GET /api/v1/conversations/{id}/messages`: List conversation messages with pagination

### Search History
- `POST /api/v1/search-history`: Record search query
- `GET /api/v1/search-history`: List search history (`?page=1&page_size=20`)
- `GET /api/v1/search-history/{id}`: Get single search query
- `DELETE /api/v1/search-history/{id}`: Delete single search entry
- `DELETE /api/v1/search-history`: Clear all search history for user

### User Memories
- `GET /api/v1/memories`: List memories (`?is_active=true&page=1&page_size=20`)
- `POST /api/v1/memories`: Record user memory
- `PATCH /api/v1/memories/{id}`: Update memory content or active status
- `DELETE /api/v1/memories/{id}`: Delete single memory
- `DELETE /api/v1/memories`: Clear all memories for user
