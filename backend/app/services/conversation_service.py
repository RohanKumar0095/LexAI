import math
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from supabase import Client
from backend.app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationOut,
    ConversationListResponse,
)


class ConversationService:
    @staticmethod
    def create_conversation(
        user_id: UUID, data: ConversationCreate, client: Client
    ) -> ConversationOut:
        try:
            payload = {
                "user_id": str(user_id),
                "title": data.title or "New Legal Conversation",
            }
            response = client.table("conversations").insert(payload).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create conversation."
                )
                
            item = response.data[0]
            return ConversationOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                title=item.get("title"),
                created_at=item.get("created_at"),
                updated_at=item.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create conversation."
            )

    @staticmethod
    def list_conversations(
        user_id: UUID, page: int, page_size: int, client: Client
    ) -> ConversationListResponse:
        try:
            # Enforce max page size
            page_size = min(max(1, page_size), 100)
            page = max(1, page)
            offset = (page - 1) * page_size
            
            # Query count and paginated items
            query = (
                client.table("conversations")
                .select("*", count="exact")
                .eq("user_id", str(user_id))
                .order("updated_at", desc=True)
                .range(offset, offset + page_size - 1)
            )
            response = query.execute()
            
            total = response.count if response.count is not None else len(response.data or [])
            total_pages = math.ceil(total / page_size) if total > 0 else 1
            
            items = [
                ConversationOut(
                    id=UUID(item["id"]),
                    user_id=UUID(item["user_id"]),
                    title=item.get("title"),
                    created_at=item.get("created_at"),
                    updated_at=item.get("updated_at")
                )
                for item in (response.data or [])
            ]
            
            return ConversationListResponse(
                items=items,
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to list conversations."
            )

    @staticmethod
    def get_conversation(
        user_id: UUID, conversation_id: UUID, client: Client
    ) -> ConversationOut:
        try:
            response = (
                client.table("conversations")
                .select("*")
                .eq("id", str(conversation_id))
                .eq("user_id", str(user_id))
                .maybe_single()
                .execute()
            )
            
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found or access not authorized."
                )
                
            item = response.data
            return ConversationOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                title=item.get("title"),
                created_at=item.get("created_at"),
                updated_at=item.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve conversation."
            )

    @staticmethod
    def update_conversation(
        user_id: UUID, conversation_id: UUID, data: ConversationUpdate, client: Client
    ) -> ConversationOut:
        try:
            payload = {}
            if data.title is not None:
                payload["title"] = data.title
                
            if not payload:
                return ConversationService.get_conversation(user_id, conversation_id, client)
                
            response = (
                client.table("conversations")
                .update(payload)
                .eq("id", str(conversation_id))
                .eq("user_id", str(user_id))
                .execute()
            )
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found or update not authorized."
                )
                
            item = response.data[0]
            return ConversationOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                title=item.get("title"),
                created_at=item.get("created_at"),
                updated_at=item.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update conversation."
            )

    @staticmethod
    def delete_conversation(
        user_id: UUID, conversation_id: UUID, client: Client
    ) -> None:
        try:
            # Verify existence first
            check = (
                client.table("conversations")
                .select("id")
                .eq("id", str(conversation_id))
                .eq("user_id", str(user_id))
                .maybe_single()
                .execute()
            )
            if not check.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found or delete not authorized."
                )
                
            client.table("conversations").delete().eq("id", str(conversation_id)).eq("user_id", str(user_id)).execute()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete conversation."
            )
