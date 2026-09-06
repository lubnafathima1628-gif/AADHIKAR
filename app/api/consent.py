from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from backend.app.database import get_db
from backend.app.models.models import Consent, User, AuditLog
from backend.app.schemas.schemas import UpdateConsentRequest

router = APIRouter(prefix="/consent", tags=["Consent & Privacy"])

@router.get("", response_model=List[Dict[str, Any]])
def get_consents(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return []
    consents = db.query(Consent).filter(Consent.user_id == user.id).all()
    return [
        {
            "id": c.id,
            "source_category": c.source_category,
            "source_name": c.source_name,
            "is_granted": c.is_granted,
            "purpose": c.purpose,
            "granted_at": c.granted_at.strftime("%Y-%m-%d %H:%M"),
            "revoked_at": c.revoked_at.strftime("%Y-%m-%d %H:%M") if c.revoked_at else None
        }
        for c in consents
    ]

@router.post("/toggle/{consent_id}")
def toggle_consent(consent_id: int, db: Session = Depends(get_db)):
    consent = db.query(Consent).filter(Consent.id == consent_id).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Consent record not found.")

    consent.is_granted = not consent.is_granted
    if not consent.is_granted:
        consent.revoked_at = datetime.utcnow()
    else:
        consent.revoked_at = None
        consent.granted_at = datetime.utcnow()

    # Audit log
    audit = AuditLog(
        user_id=consent.user_id,
        action="CONSENT_STATE_UPDATED",
        source="PRIVACY_DASHBOARD",
        details=f"Consent for '{consent.source_name}' changed to {consent.is_granted}."
    )
    db.add(audit)
    db.commit()

    return {"success": True, "is_granted": consent.is_granted}

@router.get("/audit-logs", response_model=List[Dict[str, Any]])
def get_audit_logs(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return []
    logs = db.query(AuditLog).filter(AuditLog.user_id == user.id).order_by(AuditLog.created_at.desc()).limit(20).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "source": l.source,
            "details": l.details,
            "created_at": l.created_at.strftime("%Y-%m-%d %H:%M:%S UTC")
        }
        for l in logs
    ]
