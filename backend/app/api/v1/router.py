from fastapi import APIRouter
from backend.app.api.v1 import (
    auth,
    users,
    conversations,
    messages,
    search_history,
    memories,
)


api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(conversations.router)
api_router.include_router(messages.router)
api_router.include_router(search_history.router)
api_router.include_router(memories.router)
