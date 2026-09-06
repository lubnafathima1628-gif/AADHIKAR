import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.database import get_db
from backend.app.models.models import Claim, ClaimEvent, AssetMatch, User, AuditLog
from backend.app.schemas.schemas import (
    CreateClaimRequest, ClaimReadinessResponse, ApplicationDraftResponse,
    ClaimDetailOut, ClaimTimelineEventOut
)

router = APIRouter(prefix="/claims", tags=["Claims & Recovery"])

@router.post("", response_model=Dict[str, Any])
def create_claim_journey(req: CreateClaimRequest, db: Session = Depends(get_db)):
    match = db.query(AssetMatch).filter(AssetMatch.id == req.match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Asset match not found.")

    rec = match.asset_record
    user = match.user

    # Generate claim reference
    ref_id = f"UA-2026-{uuid.uuid4().int % 90000 + 10000}"

    claim = Claim(
        user_id=user.id if user else 1,
        asset_match_id=match.id,
        claim_reference_id=ref_id,
        current_stage="prepare",
        readiness_score=78,
        official_source=rec.institution,
        tracking_status="in_progress",
        action_required_desc="Upload self-attested address proof to finalize dossier.",
        official_portal_url=rec.official_portal_url
    )
    db.add(claim)
    db.flush()

    # Create milestone events
    events = [
        ClaimEvent(claim_id=claim.id, stage="discover", title="Identity Discovery & Normalization", description="Statistical match resolved across authorized institutional records.", is_completed=True, requires_action=False),
        ClaimEvent(claim_id=claim.id, stage="verify", title="Potential Match Verification", description=f"Identified potential match at {rec.institution} with {int(match.overall_confidence*100)}% confidence.", is_completed=True, requires_action=False),
        ClaimEvent(claim_id=claim.id, stage="prepare", title="Dossier & Document AI Prep", description="Compiling mandatory KYC documents and checking for name variations.", is_completed=False, requires_action=True),
        ClaimEvent(claim_id=claim.id, stage="claim", title="Official Institutional Submission", description=f"Handoff to {rec.source.authority if rec.source else 'Statutory Authority'} via official portal.", is_completed=False, requires_action=False),
        ClaimEvent(claim_id=claim.id, stage="track", title="Regulatory Nodal Review", description="Statutory verification of submitted physical and demat records.", is_completed=False, requires_action=False),
        ClaimEvent(claim_id=claim.id, stage="recover", title="Disbursement & Resolution", description="Direct electronic transfer to verified citizen bank account.", is_completed=False, requires_action=False),
    ]
    for ev in events:
        db.add(ev)

    if user:
        audit = AuditLog(
            user_id=user.id,
            action="CLAIM_JOURNEY_INITIATED",
            source="RECOVERY_ENGINE",
            details=f"Claim #{ref_id} created for {rec.institution} ({rec.category})."
        )
        db.add(audit)

    db.commit()
    db.refresh(claim)

    return {
        "claim_id": claim.id,
        "claim_reference_id": claim.claim_reference_id,
        "readiness_score": claim.readiness_score,
        "current_stage": claim.current_stage,
        "institution": rec.institution
    }

@router.get("", response_model=List[Dict[str, Any]])
def list_claims(db: Session = Depends(get_db)):
    claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    results = []
    for c in claims:
        rec = c.match.asset_record if c.match else None
        results.append({
            "id": c.id,
            "claim_reference_id": c.claim_reference_id,
            "category": rec.category if rec else "Asset",
            "institution": c.official_source,
            "holder_name": rec.holder_name if rec else "Citizen",
            "identifier_masked": rec.identifier_masked if rec else "XXXX",
            "approximate_value_range": rec.approximate_value_range if rec else "Pending",
            "current_stage": c.current_stage,
            "readiness_score": c.readiness_score,
            "tracking_status": c.tracking_status,
            "action_required_desc": c.action_required_desc,
            "official_portal_url": c.official_portal_url,
            "created_at": c.created_at.strftime("%Y-%m-%d")
        })
    return results

@router.get("/{claim_id}/readiness", response_model=ClaimReadinessResponse)
def get_claim_readiness(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim record not found.")

    rec = claim.match.asset_record
    src = rec.source

    return ClaimReadinessResponse(
        claim_id=claim.id,
        claim_reference_id=claim.claim_reference_id,
        readiness_percentage=claim.readiness_score,
        completed_checks=[
            "Identity Normalization & Phonetic Alignment Verified",
            "Statutory Database Reference Validated",
            "Aadhaar / National ID Authentication Linked"
        ],
        pending_checks=[
            "Signed Self-Declaration for Minor Spelling Variant",
            "Branch Verification / Cancelled Cheque Leaf"
        ],
        missing_documents=[
            "Cancelled Cheque Leaf with Printed Account Holder Name",
            "Address Proof matching current domicile"
        ],
        immediate_next_action="Upload a clear scan of your cancelled cheque or passbook first page.",
        official_portal_url=rec.official_portal_url,
        authority_name=src.authority if src else "Official Nodal Authority"
    )

@router.get("/{claim_id}/draft-application", response_model=ApplicationDraftResponse)
def generate_draft_application(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")

    rec = claim.match.asset_record
    user = claim.user
    user_name = user.full_name if user else "Citizen Claimant"

    draft_letter = f"""
APPLICATION FOR RECOVERY OF UNCLAIMED / INOPERATIVE ASSET
To,
The Nodal Officer / Authorized Branch In-Charge
{rec.institution}

Subject: Request for release of unclaimed {rec.category} funds ({rec.identifier_masked}) under statutory guidelines.

Respected Sir / Madam,

I, {user_name}, hereby submit my claim regarding the unclaimed balance / asset recorded under identifier {rec.identifier_masked} ({rec.approximate_value_range}).

I have enclosed the following self-attested documents to establish my identity and title:
1. Aadhaar Card (Masked) & PAN Card
2. Relevant Proof of Account / Policy / Folio Record
3. Bank Mandate & Cancelled Cheque for direct electronic credit
4. Name Consistency Affirmation / Self-Declaration

Kindly verify the details in accordance with applicable statutory guidelines and process the disbursement to my verified bank account.

Yours faithfully,
{user_name}
Date: {datetime.date.today().strftime('%d-%B-%Y')}
    """.strip()

    return ApplicationDraftResponse(
        claim_reference_id=claim.claim_reference_id,
        institution=rec.institution,
        category=rec.category,
        claimant_name=user_name,
        account_reference_masked=rec.identifier_masked,
        checklist=[
            "Print and sign this AI-prepared application letter.",
            "Attach self-attested Aadhaar and PAN copy.",
            "Attach cancelled cheque or bank passbook copy with IFSC.",
            "For IEPF claims: Attach IEPF-5 Form Acknowledgement & Indemnity Bond.",
            "Submit directly via official portal or designated nodal branch."
        ],
        draft_application_letter=draft_letter,
        official_portal_link=rec.official_portal_url,
        submission_instructions="ADHIKAAR prepares your claim packet. Official submission and legal verification are executed directly through the authority portal.",
        disclaimer="AI-generated draft for facilitation. ADHIKAAR does not replace official statutory submission."
    )
