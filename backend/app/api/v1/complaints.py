import logging
from typing import Optional
from fastapi import APIRouter
from backend.app.schemas.complaints import ComplaintDraftRequest, ComplaintDraftResponse
from backend.app.llm.gemini import get_gemini_service

logger = logging.getLogger(__name__)

router = APIRouter()

# Re-exports for backward compatibility
__all__ = ["router", "ComplaintDraftRequest", "ComplaintDraftResponse"]


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
    loc_val = request.location or "New Delhi"
    party_val = request.involvedParty
    sit_val = request.situation
    doc_type = request.type.lower()

    if "consumer" in doc_type:
        draft = f"""BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION AT {loc_val.upper()}

COMPLAINT NO. _____ OF 2026

IN THE MATTER OF:
Complainant: [Your Full Name & Address]
Versus
Opposite Party (OP): {party_val}

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE

MOST RESPECTFULLY SHOWETH:
1. That the Complainant is a bonafide consumer having availed goods/services from the Opposite Party on or about {date_val}.
2. That the Opposite Party failed to discharge its contractual and statutory obligations, resulting in severe grievance, specifically: {sit_val}.
3. Particulars of Deficiency: {request.description or 'Defective goods/service not rectified despite repeated requests.'}
4. That the Complainant served notices upon the Opposite Party, but the Opposite Party neglected to redress the grievance.

PRAYER:
Wherefore, in light of the above facts, it is respectfully prayed that this Hon'ble Commission may be pleased to:
a) Direct the Opposite Party to {request.desiredAction or 'refund the complete amount with 12% interest per annum'};
b) Award damages of Rs. 25,000/- towards mental agony and litigation expenses;
c) Pass any further orders deemed just and equitable.

VERIFICATION:
I, the Complainant, verify that contents of Paras 1 to 4 are true to my personal knowledge. Verified at {loc_val} on {date_val}.

[Complainant Signature]"""

    elif "cyber" in doc_type:
        draft = f"""TO: THE STATION HOUSE OFFICER / NODAL OFFICER
CYBER CRIME CELL, {loc_val.upper()}

SUBJECT: COMPLAINT UNDER SECTIONS 66C, 66D OF THE INFORMATION TECHNOLOGY ACT, 2000 AND APPLICABLE PROVISIONS OF BNS 2023 REGARDING CYBER FRAUD

Respected Sir/Madam,

I am filing this formal complaint regarding an online fraudulent activity that occurred on {date_val}.

1. Victim Details: [Your Name, Phone, Aadhaar / ID]
2. Suspect / Opposite Entity: {party_val}
3. Incident Description: {sit_val}. {request.description or ''}
4. Financial / Digital Impact: Loss incurred due to unauthorized transactions/phishing.
5. Evidence Attached: Transaction screenshots, bank statement, UTR/Transaction ID records.

PRAYER:
Kindly register this complaint, facilitate freezing of the recipient fraud accounts through 1930 interbank coordination, and take immediate statutory action under law.

Sincerely,
[Your Name]
Date: {date_val} | Place: {loc_val}"""

    elif "notice" in doc_type or "legal notice" in doc_type:
        draft = f"""LEGAL NOTICE
(Registered A.D. / Speed Post / Email)

Date: {date_val}
To:
{party_val}
Address: [Opposite Party Registered Address]

SUBJECT: LEGAL NOTICE UNDER INSTRUCTIONS OF MY CLIENT REGARDING: {sit_val.upper()}

Sir/Madam,

Under instructions from and on behalf of my client [Client Name], resident of {loc_val}, I hereby serve upon you this formal Legal Notice:

1. That my client had entered into commercial/personal transactions with you regarding: {sit_val}.
2. That despite assurances, you have failed to discharge your obligations: {request.description or 'Unfulfilled contractual commitments'}.
3. That your conduct amounts to clear breach of contract, deficiency, and statutory violation.

NOW THEREFORE, I hereby call upon you to {request.desiredAction or 'comply with your obligations and clear all outstanding dues'} within a period of 15 (fifteen) days from the receipt of this notice, failing which my client shall initiate appropriate civil and criminal proceedings against you before competent courts entirely at your risk, costs, and consequences.

A copy of this notice is retained in my office for future legal action.

[Advocate Name / Signature]
Enrollment No.: D/_____/20__
Enclosure: Proof of dispatch"""

    else:
        # Default Police Complaint / Formal Legal Grievance
        draft = f"""TO: THE STATION HOUSE OFFICER (SHO)
POLICE STATION: {loc_val.upper()}

SUBJECT: WRITTEN COMPLAINT REGARDING {sit_val.upper()} AGAINST {party_val.upper()}

Respected Sir/Madam,

I, [Your Name], residing at {loc_val}, wish to lodge a formal complaint regarding the following incident which transpired on {date_val}:

1. Facts of Incident: {sit_val}.
2. Details of Opposite Party: {party_val}.
3. Specific Allegations: {request.description or 'Action causing wrongful loss and harassment.'}
4. Applicable Legal Provisions: Relevant sections of Bharatiya Nyaya Sanhita, 2023 (BNS).

I request you to register an FIR / Daily Diary Entry under Section 173 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) and provide me a copy free of cost.

Thanking you,
Yours faithfully,

[Your Name & Signature]
Contact: [Your Phone Number]"""

    return ComplaintDraftResponse(draft=draft)
