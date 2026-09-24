import math
from uuid import UUID
from datetime import datetime, timezone
from fastapi import HTTPException, status
from supabase import Client
from backend.app.schemas.message import (
    MessageCreate,
    MessageOut,
    MessageListResponse,
)


class MessageService:
    @staticmethod
    def _verify_conversation_ownership(
        user_id: UUID, conversation_id: UUID, client: Client
    ) -> None:
        """Helper to ensure the user owns the target conversation."""
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
                detail="Conversation not found or access not authorized."
            )

    @staticmethod
    def create_message(
        user_id: UUID, conversation_id: UUID, data: MessageCreate, client: Client
    ) -> MessageOut:
        try:
            # 1. Verify user owns conversation
            MessageService._verify_conversation_ownership(user_id, conversation_id, client)
            
            # 2. Insert message
            payload = {
                "conversation_id": str(conversation_id),
                "role": data.role.value if hasattr(data.role, "value") else str(data.role),
                "content": data.content,
                "metadata": data.metadata or {},
            }
            response = client.table("messages").insert(payload).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create message."
                )
                
            item = response.data[0]
            
            # 3. Touch conversation updated_at
            try:
                client.table("conversations").update({
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }).eq("id", str(conversation_id)).execute()
            except Exception:
                pass
                
            return MessageOut(
                id=UUID(item["id"]),
                conversation_id=UUID(item["conversation_id"]),
                role=item["role"],
                content=item["content"],
                metadata=item.get("metadata"),
                created_at=item.get("created_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create message."
            )

    @staticmethod
    def list_messages(
        user_id: UUID, conversation_id: UUID, page: int, page_size: int, client: Client
    ) -> MessageListResponse:
        try:
            # 1. Verify user owns conversation
            MessageService._verify_conversation_ownership(user_id, conversation_id, client)
            
            page_size = min(max(1, page_size), 100)
            page = max(1, page)
            offset = (page - 1) * page_size
            
            # 2. Query messages
            query = (
                client.table("messages")
                .select("*", count="exact")
                .eq("conversation_id", str(conversation_id))
                .order("created_at", desc=False)
                .range(offset, offset + page_size - 1)
            )
            response = query.execute()
            
            total = response.count if response.count is not None else len(response.data or [])
            total_pages = math.ceil(total / page_size) if total > 0 else 1
            
            items = [
                MessageOut(
                    id=UUID(item["id"]),
                    conversation_id=UUID(item["conversation_id"]),
                    role=item["role"],
                    content=item["content"],
                    metadata=item.get("metadata"),
                    created_at=item.get("created_at")
                )
                for item in (response.data or [])
            ]
            
            return MessageListResponse(
                items=items,
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to list messages."
            )
