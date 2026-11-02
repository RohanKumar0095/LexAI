from fastapi import APIRouter

from backend.app.schemas.roadmaps import RoadmapStep, RoadmapResponse
from backend.app.data.roadmaps_data import ROADMAPS_DATA

router = APIRouter()


@router.get("/{roadmap_id}", response_model=RoadmapResponse, summary="Get structured legal roadmap steps")
def get_roadmap(roadmap_id: str):
    """
    Returns legal procedural roadmap steps for a given legal situation.
    """
    data = ROADMAPS_DATA.get(roadmap_id)
    if data:
        return RoadmapResponse(**data)

    clean_title = roadmap_id.replace("-", " ").title()
    return RoadmapResponse(
        id=roadmap_id,
        title=f"Legal Procedural Roadmap: {clean_title}",
        steps=[
            RoadmapStep(
                number=1,
                title="Preserve Evidence & Contemporaneous Records",
                description="Gather all written agreements, receipts, emails, timestamps, and physical documentation.",
                documents=["Invoices", "Written communication", "Bank statements"],
                rights=["Right to preserve own digital evidence under Section 63 BSA (formerly 65B)"],
                notes="Keep duplicate digital backups safely stored.",
            ),
            RoadmapStep(
                number=2,
                title="Determine Legal Forum & Applicable Law",
                description="Identify whether the issue falls under Consumer Redressal, Criminal Law (BNS/BNSS), Civil Tenancy, or RTI.",
                rights=["Right to approach the statutory grievance authority having territorial jurisdiction"],
            ),
            RoadmapStep(
                number=3,
                title="File Grievance or Legal Notice",
                description="Serve formal statutory notice or register grievance on official government portals (e-Daakhil, Cyber Portal, or Police Station).",
                rights=["Right to receive formal acknowledgment receipt / FIR copy free of cost"],
            ),
        ],
    )
