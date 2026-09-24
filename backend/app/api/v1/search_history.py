from uuid import UUID
from fastapi import APIRouter, Depends, Query, status, Response
from supabase import Client
from backend.app.schemas.search_history import (
    SearchHistoryCreate,
    SearchHistoryOut,
    SearchHistoryListResponse,
)
from backend.app.core.security import get_current_user, get_user_db_client, AuthenticatedUser
from backend.app.services.search_history_service import SearchHistoryService


router = APIRouter(prefix="/search-history", tags=["Search History"])


@router.post(
    "",
    response_model=SearchHistoryOut,
    status_code=status.HTTP_201_CREATED,
    summary="Record search query",
    description="Records a legal search query executed by the authenticated user."
)
def create_search_history(
    data: SearchHistoryCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return SearchHistoryService.create_search(current_user.id, data, client)


@router.get(
    "",
    response_model=SearchHistoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List search history",
    description="Retrieves the authenticated user's search history with pagination."
)
def list_search_history(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return SearchHistoryService.list_searches(current_user.id, page, page_size, client)


@router.get(
    "/{search_id}",
    response_model=SearchHistoryOut,
    status_code=status.HTTP_200_OK,
    summary="Get search history entry",
    description="Retrieves a specific search history entry. User must be the owner."
)
def get_search_history(
    search_id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return SearchHistoryService.get_search(current_user.id, search_id, client)


@router.delete(
    "/{search_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete search history entry",
    description="Deletes a specific search history entry owned by the user."
)
def delete_search_history_item(
    search_id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    SearchHistoryService.delete_search(current_user.id, search_id, client)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Clear all search history",
    description="Deletes all search history items belonging to the authenticated user."
)
def delete_all_search_history(
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    SearchHistoryService.delete_all_searches(current_user.id, client)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
