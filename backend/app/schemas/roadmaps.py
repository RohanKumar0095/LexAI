from typing import List, Optional
from pydantic import BaseModel


class RoadmapStep(BaseModel):
    number: int
    title: str
    description: str
    details: Optional[str] = None
    documents: Optional[List[str]] = None
    rights: Optional[List[str]] = None
    notes: Optional[str] = None


class RoadmapResponse(BaseModel):
    id: str
    title: str
    steps: List[RoadmapStep]
