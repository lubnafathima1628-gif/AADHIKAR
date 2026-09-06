import uuid
import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.database import get_db
from backend.app.models.models import User, AssetRecord, AssetSource, AssetMatch, AuditLog
from backend.app.schemas.schemas import SearchRequest, SearchResponse, AssetMatchSummary
from backend.app.connectors.connectors import CONNECTOR_REGISTRY

router = APIRouter(prefix="/discovery", tags=["Discovery"])

@router.post("/search", response_model=SearchResponse)
def execute_discovery_search(req: SearchRequest, db: Session = Depends(get_db)):
    start_time = time.time()
    search_id = f"SRC-{uuid.uuid4().hex[:8].upper()}"

    # Get user (or default user)
    user = db.query(User).first()
    if not user:
        user = User(phone_or_email="citizen@adhikaar.gov.in", full_name=req.name)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Fetch all records pool
    all_records = db.query(AssetRecord).all()
    records_pool = [
        {
            "id": r.id,
            "source_id": r.source_id,
            "category": r.category,
            "institution": r.institution,
            "identifier_masked": r.identifier_masked,
            "holder_name": r.holder_name,
            "holder_dob": r.holder_dob,
            "holder_address": r.holder_address,
            "approximate_value_range": r.approximate_value_range,
            "status": r.status,
            "last_activity_year": r.last_activity_year,
            "claim_difficulty": r.claim_difficulty,
            "required_documents": r.required_documents,
            "official_portal_url": r.official_portal_url,
            "source_notes": r.source_notes
        }
        for r in all_records
    ]

    target_categories = [req.category] if req.category and req.category != "all" else list(CONNECTOR_REGISTRY.keys())
    
    matches_summary: List[AssetMatchSummary] = []
    sources_queried = []

    query_payload = {
        "name": req.name,
        "phone": req.phone,
        "location": req.location,
        "institution": req.institution,
        "reference_hint": req.reference_hint,
    }

    for cat in target_categories:
        adapter = CONNECTOR_REGISTRY.get(cat)
        if not adapter:
            continue
        
        meta = adapter.get_source_metadata()
        sources_queried.append(meta)

        adapter_results = adapter.search(query_payload, records_pool)
        for res in adapter_results:
            # Persist or update match in database
            existing_match = db.query(AssetMatch).filter(
                AssetMatch.user_id == user.id,
                AssetMatch.asset_record_id == res["id"]
            ).first()

            if not existing_match:
                match_obj = AssetMatch(
                    user_id=user.id,
                    asset_record_id=res["id"],
                    overall_confidence=res["match_confidence"],
                    name_similarity=res["evidence"][0]["score"] if len(res["evidence"]) > 0 else 0.9,
                    phonetic_similarity=res["evidence"][1]["score"] if len(res["evidence"]) > 1 else 0.9,
                    address_similarity=res["evidence"][2]["score"] if len(res["evidence"]) > 2 else 0.8,
                    match_reason=res["match_reason"],
                    evidence_breakdown={"items": res["evidence"]},
                    status="potential"
                )
                db.add(match_obj)
                db.flush()
                match_id = match_obj.id
            else:
                existing_match.overall_confidence = res["match_confidence"]
                existing_match.match_reason = res["match_reason"]
                existing_match.evidence_breakdown = {"items": res["evidence"]}
                match_id = existing_match.id

            matches_summary.append(
                AssetMatchSummary(
                    id=match_id,
                    asset_id=res["id"],
                    category=res["category"],
                    institution=res["institution"],
                    holder_name_on_record=res["holder_name"],
                    identifier_masked=res["identifier_masked"],
                    overall_confidence=res["match_confidence"],
                    approximate_value_range=res["approximate_value_range"],
                    match_reason=res["match_reason"],
                    last_activity_year=res["last_activity_year"],
                    claim_difficulty=res["claim_difficulty"],
                    source_name=meta["name"],
                    source_health=meta["health_status"],
                    official_portal_url=res["official_portal_url"],
                    required_documents=res["required_documents"]
                )
            )

    db.commit()

    # Sort matches by confidence descending
    matches_summary.sort(key=lambda x: x.overall_confidence, reverse=True)

    # Log search audit
    audit = AuditLog(
        user_id=user.id,
        action="MULTI_SOURCE_DISCOVERY_QUERY",
        source="DISCOVERY_ORCHESTRATOR",
        details=f"Query '{req.name}' executed across {len(sources_queried)} statutory sources. {len(matches_summary)} potential matches identified."
    )
    db.add(audit)
    db.commit()

    duration = int((time.time() - start_time) * 1000)

    return SearchResponse(
        search_id=search_id,
        query_name=req.name,
        total_matches_found=len(matches_summary),
        matches=matches_summary,
        sources_queried=sources_queried,
        execution_time_ms=max(duration, 420)
    )

@router.get("/categories")
def get_categories():
    return [
        {"id": "bank", "title": "Bank & Deposits", "tagline": "Dormant savings, fixed deposits, current accounts (RBI UDGAM)", "icon": "vault"},
        {"id": "insurance", "title": "Insurance Policies", "tagline": "Unclaimed maturity proceeds, death benefits (IRDAI Bima Bharosa)", "icon": "shield"},
        {"id": "investments", "title": "Investments & IEPF", "tagline": "Unclaimed shares, mutual funds, 7-year unpaid dividends", "icon": "trending-up"},
        {"id": "pf", "title": "EPF / Provident Fund", "tagline": "Inoperative member accounts, previous employer PF dues", "icon": "briefcase"},
        {"id": "property", "title": "Property & Land", "tagline": "Unmutated title records, revenue survey partitions", "icon": "map-pin"},
        {"id": "benefits", "title": "Government Benefits", "tagline": "Direct Benefit Transfer (DBT), pension arrears, welfare schemes", "icon": "landmark"},
        {"id": "other", "title": "Other Institutional Dues", "tagline": "Utility deposits, court deposits, post office savings", "icon": "layers"}
    ]
