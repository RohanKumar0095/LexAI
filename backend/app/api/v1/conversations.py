from uuid import UUID
from fastapi import APIRouter, Depends, Query, status, Response
from supabase import Client
from backend.app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationOut,
    ConversationListResponse,
)
from backend.app.core.security import get_current_user, get_user_db_client, AuthenticatedUser
from backend.app.services.conversation_service import ConversationService


router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.post(
    "",
    response_model=ConversationOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create conversation",
    description="Creates a new conversation session owned by the authenticated user."
)
def create_conversation(
    data: ConversationCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return ConversationService.create_conversation(current_user.id, data, client)


@router.get(
    "",
    response_model=ConversationListResponse,
    status_code=status.HTTP_200_OK,
    summary="List conversations",
    description="Lists all conversations belonging to the authenticated user with pagination."
)
def list_conversations(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return ConversationService.list_conversations(current_user.id, page, page_size, client)


@router.get(
    "/{conversation_id}",
    response_model=ConversationOut,
    status_code=status.HTTP_200_OK,
    summary="Get conversation",
    description="Retrieves a single conversation by ID. User must be the owner."
)
def get_conversation(
    conversation_id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return ConversationService.get_conversation(current_user.id, conversation_id, client)


@router.patch(
    "/{conversation_id}",
    response_model=ConversationOut,
    status_code=status.HTTP_200_OK,
    summary="Update conversation",
    description="Updates conversation attributes (e.g. title). User must be the owner."
)
def update_conversation(
    conversation_id: UUID,
    data: ConversationUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return ConversationService.update_conversation(current_user.id, conversation_id, data, client)


@router.delete(
    "/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete conversation",
    description="Deletes a conversation and its messages. User must be the owner."
)
def delete_conversation(
    conversation_id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    ConversationService.delete_conversation(current_user.id, conversation_id, client)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
