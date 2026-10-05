from typing import List, Optional, Dict
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


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


ROADMAPS_DATA: Dict[str, Dict] = {
    "police-stop-roadmap": {
        "id": "police-stop-roadmap",
        "title": "Roadmap: Vehicle Stop Rights",
        "steps": [
            {
                "number": 1,
                "title": "Verify Officer Credentials",
                "description": "Ask the traffic officer for their identity card and check their rank. Note the name/badge.",
                "documents": ["Officer Rank Badge / Nameplate"],
                "rights": ["Right to identify the officer before replying"],
                "notes": "A police constable cannot fine you on the spot; only a Sub-Inspector or above can."
            },
            {
                "number": 2,
                "title": "Show Digital / Physical Documents",
                "description": "Show your DL, RC, Insurance, and PUC. You can use DigiLocker or mParivahan.",
                "documents": ["Driving License", "RC", "Insurance Policy", "PUC Certificate"],
                "rights": ["DigiLocker documents are legally valid under IT Act, 2000"],
                "notes": "Do not hand over physical documents to avoid confiscation threats; displaying digital copies is sufficient."
            },
            {
                "number": 3,
                "title": "Handle Challan or Fine",
                "description": "Verify the fine amount and official receipt. Do not pay without an official print or SMS record.",
                "documents": ["Official E-Challan Receipt"],
                "rights": ["Right to pay fine online later or contest it in court"],
                "notes": "If fine is paid on-spot, demand a printed receipt stating the officer's details."
            }
        ]
    },
    "cyber-fraud-roadmap": {
        "id": "cyber-fraud-roadmap",
        "title": "Roadmap: Reporting Cyber Fraud",
        "steps": [
            {
                "number": 1,
                "title": "Immediate Account Block",
                "description": "Contact your bank via official helpline or app to freeze cards, net banking, and UPI payments.",
                "documents": ["Bank Account Passbook/Card details"],
                "rights": ["Zero customer liability if reported within 3 days (RBI guidelines)"],
                "notes": "This stops further money leakage."
            },
            {
                "number": 2,
                "title": "Dial 1930 Cyber Helpline",
                "description": "Report the transaction details (bank, amount, transaction ID) immediately to operators.",
                "documents": ["UPI/Transaction Ref Number"],
                "rights": ["Interbank coordination to freeze funds in fraud accounts"],
                "notes": "Do this in the first 2 hours for best recovery chances."
            },
            {
                "number": 3,
                "title": "Register Complaint on Cyber Portal",
                "description": "Submit an online complaint on cybercrime.gov.in with screenshots of threats and transaction bills.",
                "documents": ["Screenshots of scam messages/links", "Bank statement PDF"],
                "rights": ["Right to receive an online acknowledgement number (Acknowledge slip)"],
                "notes": "This generates an official complaint code for police investigations."
            }
        ]
    },
    "fir-roadmap": {
        "id": "fir-roadmap",
        "title": "Roadmap: Filing an FIR",
        "steps": [
            {
                "number": 1,
                "title": "Identify Correct Jurisdiction",
                "description": "Go to the nearest police station where the incident occurred. If you do not know, go to any station.",
                "documents": [],
                "rights": ["Right to file a Zero FIR at any station (to be transferred later)"],
                "notes": "Police cannot reject filing a serious crime because it is outside their area."
            },
            {
                "number": 2,
                "title": "Draft the Information Statement",
                "description": "Provide details verbally or in writing. If verbal, the officer must write it down.",
                "documents": ["Draft of the incident narration"],
                "rights": ["Right to have the statement read back to you before signing"],
                "notes": "Ensure all key details, dates, and times are written accurately."
            },
            {
                "number": 3,
                "title": "Collect signed copy for free",
                "description": "Obtain the official FIR printout with station stamp and officer signature.",
                "documents": ["Copy of FIR"],
                "rights": ["Right to get a copy of the FIR free of charge immediately (Sec 173 BNSS)"],
                "notes": "Keep this copy safe for all future court or insurance procedures."
            }
        ]
    }
}


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
                notes="Keep duplicate digital backups safely stored."
            ),
            RoadmapStep(
                number=2,
                title="Determine Legal Forum & Applicable Law",
                description="Identify whether the issue falls under Consumer Redressal, Criminal Law (BNS/BNSS), Civil Tenancy, or RTI.",
                rights=["Right to approach the statutory grievance authority having territorial jurisdiction"]
            ),
            RoadmapStep(
                number=3,
                title="File Grievance or Legal Notice",
                description="Serve formal statutory notice or register grievance on official government portals (e-Daakhil, Cyber Portal, or Police Station).",
                rights=["Right to receive formal acknowledgment receipt / FIR copy free of cost"]
            )
        ]
    )
