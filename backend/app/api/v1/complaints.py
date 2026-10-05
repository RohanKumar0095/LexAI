import logging
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.llm.gemini import get_gemini_service

logger = logging.getLogger(__name__)

router = APIRouter()


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


@router.post("/generate", response_model=ComplaintDraftResponse, summary="Generate structured legal complaint or notice draft")
def generate_complaint(request: ComplaintDraftRequest):
    """
    Generates a formal legal draft (Consumer Complaint, Police Complaint, Legal Notice, RTI, Cyber Complaint)
    grounded on Indian statutory formats.
    """
    gemini = get_gemini_service()
    if gemini.is_available():
        try:
            prompt = f"""Draft a formal, professional Indian legal document of type '{request.type}'.
Particulars:
- Type of Instrument: {request.type}
- Subject / Situation: {request.situation}
- Opposite Party / Respondent: {request.involvedParty}
- Date of Incident: {request.date or 'Recent'}
- Location / Jurisdiction: {request.location or 'India'}
- Detailed Facts: {request.description or 'As stated above'}
- Desired Relief / Prayer: {request.desiredAction or 'Full redressal, restitution, and compensation'}

Requirements:
- Use standard Indian legal drafting conventions (BEFORE THE APPROPRIATE FORUM / AUTHORITY, IN THE MATTER OF, MOST RESPECTFULLY SHOWETH, FACTS, GROUNDS, PRAYER / RELIEF, VERIFICATION).
- Cite relevant Indian statutory provisions (e.g., Section 35 Consumer Protection Act 2019, Section 173 BNSS 2023, Section 6(1) RTI Act 2005, Section 106 Transfer of Property Act 1882, or Section 66D IT Act 2000).
- Produce the complete legal text draft ready to be customized and filed."""

            draft_text = gemini.generate_answer(
                system_prompt="You are a senior advocate in India specializing in precise legal pleadings and formal complaints drafting.",
                prompt=prompt
            )
            if draft_text and len(draft_text) > 100:
                return ComplaintDraftResponse(draft=draft_text)
        except Exception as e:
            logger.warning(f"Gemini complaint generation fallback: {e}")

    # Robust fallback template generator tailored to document type
    date_val = request.date or "Recent"
    loc_val = (request.location or "NEW DELHI").upper()
    opp_party = request.involvedParty
    situation = request.situation
    desc = request.description or situation
    prayer = request.desiredAction or "Provide complete refund and damages of Rs. 25,000 for mental harassment."

    if "police" in request.type.lower() or "fir" in request.type.lower():
        draft = f"""TO,
THE STATION HOUSE OFFICER (SHO),
POLICE STATION: {loc_val}

SUBJECT: COMPLAINT UNDER SECTION 173 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS) REGARDING: {situation.upper()}

Sir/Madam,

1. I, [Complainant Name], residing at [Your Residential Address], contact number [Your Mobile Number], submit this formal information regarding a cognizable offence.

2. That on {date_val}, at or around {loc_val}, the following incident occurred:
   {desc}

3. That the person(s) / party involved in the said illegal act is:
   Name/Organization: {opp_party}
   Address/Details: [Opposite Party Address]

4. That the aforementioned acts constitute cognizable offences under the Bharatiya Nyaya Sanhita, 2023 (BNS).

PRAYER:
In view of the above facts and circumstances, it is most respectfully prayed that you may kindly:
a) Register an FIR under relevant sections of BNS, 2023;
b) Conduct a swift investigation to apprehend the culprits and recover any stolen or misappropriated property;
c) Provide a free copy of the registered FIR to the undersigned as mandated by law.

Date: [Current Date]
Place: {loc_val}

Yours faithfully,

___________________
[Complainant Signature & Name]
[Contact Number]"""

    elif "rti" in request.type.lower():
        draft = f"""APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

TO:
The Central Public Information Officer (CPIO) / Public Information Officer (PIO),
[Name of Public Authority / Department],
{loc_val}

1. Full Name of Applicant: [Your Full Name]
2. Address: [Your Full Address]
3. Particulars of Information Required:
   Subject Matter: {situation}
   Reference / Involved Entity: {opp_party}
   Period to which information relates: {date_val} onwards

4. Description of Information Required:
   a) Detailed status report regarding {desc}.
   b) Certified copies of all file notings, orders, and correspondence concerning the aforesaid matter.
   c) Name, designation, and contact details of the official responsible for the processing of this matter.

5. Application Fee:
   Prescribed fee of Rs. 10/- attached herewith via [IPO / Court Fee Stamp / Online Receipt No: _______].

Date: [Current Date]
Place: {loc_val}

___________________
[Signature of the Applicant]"""

    elif "notice" in request.type.lower():
        draft = f"""LEGAL NOTICE
(DELIVERED VIA REGISTERED SPEED POST / EMAIL)

TO:
{opp_party}
[Address of Opposite Party]

SUBJECT: LEGAL NOTICE REGARDING {situation.upper()}

Sir/Madam,

Under instructions from and on behalf of my client, [Client Name], resident of [Client Address], I hereby serve upon you the following Legal Notice:

1. That my client had entered into transactions/engagement with you on {date_val} at {loc_val}.
2. That details of the grievance and breach on your part are as follows:
   {desc}
3. That your conduct constitutes a breach of contractual duties and statutory provisions of Indian law.

THEREFORE, YOU ARE HEREBY CALLED UPON to:
- {prayer}
within a period of 15 (fifteen) days from the date of receipt of this notice, failing which my client shall be constrained to initiate appropriate civil and criminal proceedings against you in the competent court of jurisdiction entirely at your risk, cost, and consequence.

Copy retained for records and court exhibits.

Date: [Current Date]
Place: {loc_val}

___________________
[Advocate Signature / Client Signature]"""

    else:
        draft = f"""BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, {loc_val}
(Under Section 35 of the Consumer Protection Act, 2019)

COMPLAINT NO. _______ / 2026

IN THE MATTER OF:
[Your Name], S/o or D/o [Parent Name],
Resident of: [Your Full Address]
Email: [Your Email] | Mobile: [Your Phone]
                                                      ...COMPLAINANT
VERSUS

{opp_party},
Address: [Opposite Party Address]
                                                      ...OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE

MOST RESPECTFULLY SHOWETH:
1. That the Complainant is a consumer under Section 2(7) of the Consumer Protection Act, 2019, having purchased goods / availed services from the Opposite Party on {date_val} at {loc_val}.
2. That the Opposite Party is engaged in commercial business under the name: {opp_party}.
3. Facts of the Dispute:
   - Specific Issue: {situation}
   - Narrative of Events: {desc}
4. That despite multiple written grievances and follow-ups, the Opposite Party has refused and neglected to rectify the deficiency.
5. PRAYER:
   It is therefore most respectfully prayed that this Hon'ble Commission may be pleased to direct the Opposite Party to:
   a) {prayer};
   b) Pay Rs. 20,000/- towards mental agony, harassment, and litigation expenses;
   c) Pass any other relief deemed fit in the interest of justice.

Dated: [Current Date]
Place: {loc_val}

                                                      COMPLAINANT
                                                      Through Counsel

VERIFICATION:
I, the Complainant above-named, do hereby verify that the contents of paragraphs 1 to 5 are true and correct to the best of my knowledge and belief.
Verified at {loc_val} on this day."""

    return ComplaintDraftResponse(draft=draft)
