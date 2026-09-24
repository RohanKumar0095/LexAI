from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query, status, Response
from supabase import Client
from backend.app.schemas.memory import (
    MemoryCreate,
    MemoryUpdate,
    MemoryOut,
    MemoryListResponse,
)
from backend.app.core.security import get_current_user, get_user_db_client, AuthenticatedUser
from backend.app.services.memory_service import MemoryService


router = APIRouter(prefix="/memories", tags=["User Memories"])


@router.get(
    "",
    response_model=MemoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List user memories",
    description="Lists stored memories for the authenticated user, with optional active filter and pagination."
)
def list_memories(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return MemoryService.list_memories(current_user.id, page, page_size, is_active, client)


@router.post(
    "",
    response_model=MemoryOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create user memory",
    description="Creates a new memory entry for the authenticated user."
)
def create_memory(
    data: MemoryCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return MemoryService.create_memory(current_user.id, data, client)


@router.patch(
    "/{memory_id}",
    response_model=MemoryOut,
    status_code=status.HTTP_200_OK,
    summary="Update user memory",
    description="Updates a memory entry owned by the authenticated user."
)
def update_memory(
    memory_id: UUID,
    data: MemoryUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return MemoryService.update_memory(current_user.id, memory_id, data, client)


@router.delete(
    "/{memory_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user memory",
    description="Deletes a specific memory entry owned by the authenticated user."
)
def delete_memory(
    memory_id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    MemoryService.delete_memory(current_user.id, memory_id, client)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Clear all memories",
    description="Deletes all memories belonging to the authenticated user."
)
def delete_all_memories(
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    MemoryService.delete_all_memories(current_user.id, client)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
