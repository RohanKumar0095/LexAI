from fastapi import APIRouter, Depends, status
from supabase import Client
from backend.app.schemas.user import ProfileOut, ProfileUpdate
from backend.app.core.security import get_current_user, get_user_db_client, AuthenticatedUser
from backend.app.services.user_service import UserService


router = APIRouter(prefix="/users", tags=["User Profiles"])


@router.get(
    "/me",
    response_model=ProfileOut,
    status_code=status.HTTP_200_OK,
    summary="Get user profile",
    description="Retrieves the application profile for the authenticated user."
)
def get_user_profile(
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return UserService.get_profile(current_user.id, client)


@router.patch(
    "/me",
    response_model=ProfileOut,
    status_code=status.HTTP_200_OK,
    summary="Update user profile",
    description="Updates the profile (full name, avatar URL) of the authenticated user."
)
def update_user_profile(
    update_data: ProfileUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    client: Client = Depends(get_user_db_client)
):
    return UserService.update_profile(current_user.id, update_data, client)
