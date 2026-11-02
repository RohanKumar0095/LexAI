from typing import Optional
from pydantic import BaseModel


class ComplaintDraftRequest(BaseModel):
    type: str = "Consumer Complaint"
    situation: str
    date: Optional[str] = ""
    location: Optional[str] = "New Delhi"
    involvedParty: str
    description: Optional[str] = ""
    desiredAction: Optional[str] = ""


class ComplaintDraftResponse(BaseModel):
    draft: str
