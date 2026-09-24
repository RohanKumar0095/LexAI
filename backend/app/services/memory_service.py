import math
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, status
from supabase import Client
from backend.app.schemas.memory import (
    MemoryCreate,
    MemoryUpdate,
    MemoryOut,
    MemoryListResponse,
)


class MemoryService:
    @staticmethod
    def create_memory(
        user_id: UUID, data: MemoryCreate, client: Client
    ) -> MemoryOut:
        try:
            payload = {
                "user_id": str(user_id),
                "content": data.content,
                "memory_type": data.memory_type,
                "metadata": data.metadata or {},
                "is_active": data.is_active,
            }
            if data.source_conversation_id:
                payload["source_conversation_id"] = str(data.source_conversation_id)
                
            response = client.table("user_memories").insert(payload).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to record user memory."
                )
                
            item = response.data[0]
            return MemoryOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                memory_type=item.get("memory_type"),
                content=item["content"],
                source_conversation_id=UUID(item["source_conversation_id"]) if item.get("source_conversation_id") else None,
                metadata=item.get("metadata"),
                is_active=item.get("is_active", True),
                created_at=item.get("created_at"),
                updated_at=item.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user memory."
            )

    @staticmethod
    def list_memories(
        user_id: UUID, page: int, page_size: int, is_active: Optional[bool], client: Client
    ) -> MemoryListResponse:
        try:
            page_size = min(max(1, page_size), 100)
            page = max(1, page)
            offset = (page - 1) * page_size
            
            query = (
                client.table("user_memories")
                .select("*", count="exact")
                .eq("user_id", str(user_id))
            )
            
            if is_active is not None:
                query = query.eq("is_active", is_active)
                
            query = query.order("created_at", desc=True).range(offset, offset + page_size - 1)
            response = query.execute()
            
            total = response.count if response.count is not None else len(response.data or [])
            total_pages = math.ceil(total / page_size) if total > 0 else 1
            
            items = [
                MemoryOut(
                    id=UUID(item["id"]),
                    user_id=UUID(item["user_id"]),
                    memory_type=item.get("memory_type"),
                    content=item["content"],
                    source_conversation_id=UUID(item["source_conversation_id"]) if item.get("source_conversation_id") else None,
                    metadata=item.get("metadata"),
                    is_active=item.get("is_active", True),
                    created_at=item.get("created_at"),
                    updated_at=item.get("updated_at")
                )
                for item in (response.data or [])
            ]
            
            return MemoryListResponse(
                items=items,
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to list user memories."
            )

    @staticmethod
    def update_memory(
        user_id: UUID, memory_id: UUID, data: MemoryUpdate, client: Client
    ) -> MemoryOut:
        try:
            payload = {}
            if data.content is not None:
                payload["content"] = data.content
            if data.memory_type is not None:
                payload["memory_type"] = data.memory_type
            if data.is_active is not None:
                payload["is_active"] = data.is_active
            if data.metadata is not None:
                payload["metadata"] = data.metadata
                
            if not payload:
                # Retrieve current state
                response = (
                    client.table("user_memories")
                    .select("*")
                    .eq("id", str(memory_id))
                    .eq("user_id", str(user_id))
                    .maybe_single()
                    .execute()
                )
                if not response.data:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Memory not found or update not authorized."
                    )
                item = response.data
                return MemoryOut(
                    id=UUID(item["id"]),
                    user_id=UUID(item["user_id"]),
                    memory_type=item.get("memory_type"),
                    content=item["content"],
                    source_conversation_id=UUID(item["source_conversation_id"]) if item.get("source_conversation_id") else None,
                    metadata=item.get("metadata"),
                    is_active=item.get("is_active", True),
                    created_at=item.get("created_at"),
                    updated_at=item.get("updated_at")
                )
                
            payload["updated_at"] = datetime.now(timezone.utc).isoformat()
            
            response = (
                client.table("user_memories")
                .update(payload)
                .eq("id", str(memory_id))
                .eq("user_id", str(user_id))
                .execute()
            )
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Memory not found or update not authorized."
                )
                
            item = response.data[0]
            return MemoryOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                memory_type=item.get("memory_type"),
                content=item["content"],
                source_conversation_id=UUID(item["source_conversation_id"]) if item.get("source_conversation_id") else None,
                metadata=item.get("metadata"),
                is_active=item.get("is_active", True),
                created_at=item.get("created_at"),
                updated_at=item.get("updated_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update memory."
            )

    @staticmethod
    def delete_memory(
        user_id: UUID, memory_id: UUID, client: Client
    ) -> None:
        try:
            check = (
                client.table("user_memories")
                .select("id")
                .eq("id", str(memory_id))
                .eq("user_id", str(user_id))
                .maybe_single()
                .execute()
            )
            if not check.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Memory not found or delete not authorized."
                )
                
            client.table("user_memories").delete().eq("id", str(memory_id)).eq("user_id", str(user_id)).execute()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete memory."
            )

    @staticmethod
    def delete_all_memories(
        user_id: UUID, client: Client
    ) -> None:
        try:
            client.table("user_memories").delete().eq("user_id", str(user_id)).execute()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to clear memories."
            )
