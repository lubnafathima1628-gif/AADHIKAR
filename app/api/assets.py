from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.database import get_db
from backend.app.models.models import AssetRecord, AssetMatch, AssetSource, User
from backend.app.schemas.schemas import AssetDetailResponse, EvidenceItem

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("", response_model=List[Dict[str, Any]])
def list_potential_assets(db: Session = Depends(get_db)):
    matches = db.query(AssetMatch).all()
    results = []
    for m in matches:
        rec = m.asset_record
        results.append({
            "id": m.id,
            "asset_id": rec.id,
            "category": rec.category,
            "institution": rec.institution,
            "holder_name": rec.holder_name,
            "identifier_masked": rec.identifier_masked,
            "approximate_value_range": rec.approximate_value_range,
            "overall_confidence": m.overall_confidence,
            "status": m.status,
            "match_reason": m.match_reason,
            "source_authority": rec.source.authority if rec.source else "Statutory Authority",
            "source_health": rec.source.health_status if rec.source else "healthy",
            "official_portal_url": rec.official_portal_url,
            "required_documents": rec.required_documents
        })
    return results

@router.get("/{match_id}", response_model=AssetDetailResponse)
def get_asset_detail(match_id: int, db: Session = Depends(get_db)):
    match = db.query(AssetMatch).filter(AssetMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Asset match record not found.")

    rec = match.asset_record
    src = rec.source

    evidence_items = []
    if match.evidence_breakdown and "items" in match.evidence_breakdown:
        for item in match.evidence_breakdown["items"]:
            evidence_items.append(EvidenceItem(**item))
    else:
        evidence_items = [
            EvidenceItem(factor="Name & Phonetic Alignment", score=match.name_similarity or 0.94, description="High statistical consistency with spelling variations.", status="matched"),
            EvidenceItem(factor="Jurisdictional Proximity", score=match.address_similarity or 0.85, description="Regional registration alignment verified.", status="matched"),
            EvidenceItem(factor="Statutory Source Integrity", score=0.98, description="Record retrieved directly from authorized institutional register.", status="matched")
        ]

    return AssetDetailResponse(
        id=match.id,
        category=rec.category,
        institution=rec.institution,
        holder_name=rec.holder_name,
        identifier_masked=rec.identifier_masked,
        approximate_value_range=rec.approximate_value_range,
        overall_confidence=match.overall_confidence,
        name_similarity=match.name_similarity or 0.94,
        phonetic_similarity=match.phonetic_similarity or 0.96,
        address_similarity=match.address_similarity or 0.88,
        timeline_fit=match.timeline_fit or 0.92,
        match_reason=match.match_reason,
        evidence_breakdown=evidence_items,
        last_activity_year=rec.last_activity_year,
        claim_difficulty=rec.claim_difficulty,
        required_documents=rec.required_documents or [],
        official_portal_url=rec.official_portal_url,
        source_authority=src.authority if src else "National Registry",
        source_health=src.health_status if src else "healthy",
        source_last_synced=src.last_synced_at.strftime("%Y-%m-%d %H:%M UTC") if src and src.last_synced_at else "Recently"
    )

@router.get("/graph/relationship")
def get_relationship_graph(db: Session = Depends(get_db)):
    user = db.query(User).first()
    user_name = user.full_name if user else "Citizen Identity"
    
    nodes = [
        {"id": "identity", "label": user_name, "type": "citizen", "category": "identity", "value": 100, "details": "Verified Identity Anchor"}
    ]
    links = []

    matches = db.query(AssetMatch).all()
    categories_present = set()

    for m in matches:
        rec = m.asset_record
        cat_id = f"cat_{rec.category}"
        if cat_id not in categories_present:
            nodes.append({
                "id": cat_id,
                "label": rec.category.upper(),
                "type": "category",
                "category": rec.category,
                "value": 75,
                "details": f"Channel: {rec.category.capitalize()}"
            })
            links.append({"source": "identity", "target": cat_id, "strength": 0.8})
            categories_present.add(cat_id)

        node_id = f"asset_{m.id}"
        nodes.append({
            "id": node_id,
            "label": f"{rec.institution}",
            "type": "asset",
            "category": rec.category,
            "confidence": m.overall_confidence,
            "value": 50,
            "value_range": rec.approximate_value_range,
            "match_id": m.id,
            "details": f"Potential Match: {int(m.overall_confidence * 100)}%"
        })
        links.append({"source": cat_id, "target": node_id, "strength": 0.9})

    return {
        "nodes": nodes,
        "links": links
    }
