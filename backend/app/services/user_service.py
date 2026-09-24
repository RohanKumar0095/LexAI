from uuid import UUID
from datetime import datetime, timezone
from fastapi import HTTPException, status
from supabase import Client
from backend.app.schemas.user import ProfileOut, ProfileUpdate


class UserService:
    @staticmethod
    def get_profile(user_id: UUID, client: Client) -> ProfileOut:
        try:
            response = client.table("profiles").select("*").eq("id", str(user_id)).maybe_single().execute()
            data = response.data
            
            if not data:
                # If trigger has not fired yet, create a default profile row
                now = datetime.now(timezone.utc).isoformat()
                insert_res = client.table("profiles").insert({
                    "id": str(user_id),
                    "full_name": None,
                    "avatar_url": None,
                }).execute()
                if insert_res.data and len(insert_res.data) > 0:
                    data = insert_res.data[0]
                else:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="User profile not found."
                    )
            
            return ProfileOut(
                id=UUID(data["id"]),
                full_name=data.get("full_name"),
                avatar_url=data.get("avatar_url"),
                created_at=data.get("created_at"),
                updated_at=data.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve user profile."
            )

    @staticmethod
    def update_profile(user_id: UUID, update_data: ProfileUpdate, client: Client) -> ProfileOut:
        try:
            payload = {}
            if update_data.full_name is not None:
                payload["full_name"] = update_data.full_name
            if update_data.avatar_url is not None:
                payload["avatar_url"] = update_data.avatar_url
                
            if not payload:
                return UserService.get_profile(user_id, client)
            
            response = client.table("profiles").update(payload).eq("id", str(user_id)).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User profile not found or update not authorized."
                )
                
            data = response.data[0]
            return ProfileOut(
                id=UUID(data["id"]),
                full_name=data.get("full_name"),
                avatar_url=data.get("avatar_url"),
                created_at=data.get("created_at"),
                updated_at=data.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user profile."
            )
