import math
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException, status
from supabase import Client
from backend.app.schemas.search_history import (
    SearchHistoryCreate,
    SearchHistoryOut,
    SearchHistoryListResponse,
)


class SearchHistoryService:
    @staticmethod
    def create_search(
        user_id: UUID, data: SearchHistoryCreate, client: Client
    ) -> SearchHistoryOut:
        try:
            payload = {
                "user_id": str(user_id),
                "query": data.query,
            }
            if data.conversation_id:
                payload["conversation_id"] = str(data.conversation_id)
                
            response = client.table("search_history").insert(payload).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to record search history."
                )
                
            item = response.data[0]
            return SearchHistoryOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                conversation_id=UUID(item["conversation_id"]) if item.get("conversation_id") else None,
                query=item["query"],
                created_at=item.get("created_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create search history entry."
            )

    @staticmethod
    def list_searches(
        user_id: UUID, page: int, page_size: int, client: Client
    ) -> SearchHistoryListResponse:
        try:
            page_size = min(max(1, page_size), 100)
            page = max(1, page)
            offset = (page - 1) * page_size
            
            query = (
                client.table("search_history")
                .select("*", count="exact")
                .eq("user_id", str(user_id))
                .order("created_at", desc=True)
                .range(offset, offset + page_size - 1)
            )
            response = query.execute()
            
            total = response.count if response.count is not None else len(response.data or [])
            total_pages = math.ceil(total / page_size) if total > 0 else 1
            
            items = [
                SearchHistoryOut(
                    id=UUID(item["id"]),
                    user_id=UUID(item["user_id"]),
                    conversation_id=UUID(item["conversation_id"]) if item.get("conversation_id") else None,
                    query=item["query"],
                    created_at=item.get("created_at")
                )
                for item in (response.data or [])
            ]
            
            return SearchHistoryListResponse(
                items=items,
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to list search history."
            )

    @staticmethod
    def get_search(
        user_id: UUID, search_id: UUID, client: Client
    ) -> SearchHistoryOut:
        try:
            response = (
                client.table("search_history")
                .select("*")
                .eq("id", str(search_id))
                .eq("user_id", str(user_id))
                .maybe_single()
                .execute()
            )
            
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Search history entry not found or access not authorized."
                )
                
            item = response.data
            return SearchHistoryOut(
                id=UUID(item["id"]),
                user_id=UUID(item["user_id"]),
                conversation_id=UUID(item["conversation_id"]) if item.get("conversation_id") else None,
                query=item["query"],
                created_at=item.get("created_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve search history entry."
            )

    @staticmethod
    def delete_search(
        user_id: UUID, search_id: UUID, client: Client
    ) -> None:
        try:
            check = (
                client.table("search_history")
                .select("id")
                .eq("id", str(search_id))
                .eq("user_id", str(user_id))
                .maybe_single()
                .execute()
            )
            if not check.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Search history entry not found or delete not authorized."
                )
                
            client.table("search_history").delete().eq("id", str(search_id)).eq("user_id", str(user_id)).execute()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete search history entry."
            )

    @staticmethod
    def delete_all_searches(
        user_id: UUID, client: Client
    ) -> None:
        try:
            client.table("search_history").delete().eq("user_id", str(user_id)).execute()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to clear search history."
            )
