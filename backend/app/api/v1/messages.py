from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from supabase import Client
from backend.app.schemas.message import (
    MessageCreate,
    MessageOut,
    MessageListResponse,
)
from backend.app.core.security import get_current_user, get_user_db_client, AuthenticatedUser
from backend.app.services.message_service import MessageService


router = APIRouter(prefix="/conversations", tags=["Messages"])


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create message",
    description="Creates a new message in a conversation. User must own the conversation."
)
def create_message(
    conversation_id: UUID,
    data: MessageCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return MessageService.create_message(current_user.id, conversation_id, data, client)


@router.get(
    "/{conversation_id}/messages",
    response_model=MessageListResponse,
    status_code=status.HTTP_200_OK,
    summary="List messages",
    description="Retrieves paginated messages belonging to a conversation. User must own the conversation."
)
def list_messages(
    conversation_id: UUID,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page (max 100)"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return MessageService.list_messages(current_user.id, conversation_id, page, page_size, client)
