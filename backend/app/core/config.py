from pathlib import Path
from typing import Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Determine the absolute path to the backend directory
# Path: <project-root>/backend/app/core/config.py -> parent(core) -> parent(app) -> parent(backend)
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_ENV_PATH = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "LexAI Backend Foundation"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase Configuration - Current / Preferred Key Names
    SUPABASE_URL: str = ""
    SUPABASE_PUBLISHABLE_KEY: str = ""
    SUPABASE_SECRET_KEY: str = ""
    
    # Supabase Configuration - Legacy Fallbacks
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Frontend URL for CORS
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    model_config = SettingsConfigDict(
        # Check backend/.env first, then cwd .env as fallback, plus system env vars
        env_file=(str(BACKEND_ENV_PATH), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @model_validator(mode="after")
    def resolve_key_fallbacks(self) -> "Settings":
        # Resolve Publishable Key <-> Anon Key
        if not self.SUPABASE_PUBLISHABLE_KEY and self.SUPABASE_ANON_KEY:
            self.SUPABASE_PUBLISHABLE_KEY = self.SUPABASE_ANON_KEY
        elif self.SUPABASE_PUBLISHABLE_KEY and not self.SUPABASE_ANON_KEY:
            self.SUPABASE_ANON_KEY = self.SUPABASE_PUBLISHABLE_KEY

        # Resolve Secret Key <-> Service Role Key
        if not self.SUPABASE_SECRET_KEY and self.SUPABASE_SERVICE_ROLE_KEY:
            self.SUPABASE_SECRET_KEY = self.SUPABASE_SERVICE_ROLE_KEY
        elif self.SUPABASE_SECRET_KEY and not self.SUPABASE_SERVICE_ROLE_KEY:
            self.SUPABASE_SERVICE_ROLE_KEY = self.SUPABASE_SECRET_KEY

        return self

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and (self.SUPABASE_PUBLISHABLE_KEY or self.SUPABASE_ANON_KEY))


settings = Settings()
