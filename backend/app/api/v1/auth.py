from fastapi import APIRouter, Depends, status
from backend.app.schemas.auth import (
    SignUpRequest,
    LoginRequest,
    AuthResponse,
    UserOut,
    LogoutResponse,
)
from backend.app.core.security import get_current_user, AuthenticatedUser
from backend.app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Sign up a new user",
    description="Registers a new user account with Supabase Auth using email and password."
)
def signup(request: SignUpRequest):
    return AuthService.sign_up(request)


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in user",
    description="Authenticates user credentials against Supabase Auth and returns active session tokens."
)
def login(request: LoginRequest):
    return AuthService.login(request)


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Log out user",
    description="Terminates the user's active session."
)
def logout(current_user: AuthenticatedUser = Depends(get_current_user)):
    return AuthService.logout(current_user.token)


@router.get(
    "/me",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
    description="Returns the identity and metadata of the currently authenticated session."
)
def get_me(current_user: AuthenticatedUser = Depends(get_current_user)):
    user_meta = current_user.user_metadata or {}
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=user_meta.get("full_name") or user_meta.get("name"),
        avatar_url=user_meta.get("avatar_url")
    )
