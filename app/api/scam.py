from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import ScamAnalysis, User, AuditLog
from backend.app.schemas.schemas import ScamCheckRequest, ScamCheckResponse
from backend.app.ai.scam_analyzer import evaluate_scam_threat

router = APIRouter(prefix="/scam", tags=["Scam Shield"])

@router.post("/analyze", response_model=ScamCheckResponse)
def analyze_scam_message(req: ScamCheckRequest, db: Session = Depends(get_db)):
    result = evaluate_scam_threat(req.content, req.input_type or "text")
    
    user = db.query(User).first()
    analysis = ScamAnalysis(
        user_id=user.id if user else None,
        input_type=req.input_type or "text",
        raw_content=req.content[:500],
        risk_level=result["risk_level"],
        risk_score=result["risk_score"],
        detected_flags=result["detected_flags"],
        plain_language_explanation=result["plain_language_explanation"],
        safe_next_action=result["safe_next_action"]
    )
    db.add(analysis)

    if user:
        audit = AuditLog(
            user_id=user.id,
            action="SCAM_SHIELD_ANALYSIS",
            source="SECURITY_SUITE",
            details=f"Threat evaluated: {result['risk_level']} (Score: {result['risk_score']}/100)."
        )
        db.add(audit)

    db.commit()

    return ScamCheckResponse(
        risk_level=result["risk_level"],
        risk_score=result["risk_score"],
        detected_flags=result["detected_flags"],
        plain_language_explanation=result["plain_language_explanation"],
        official_comparison=result["official_comparison"],
        safe_next_action=result["safe_next_action"]
    )
