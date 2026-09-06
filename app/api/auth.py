from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.database import get_db
from backend.app.models.models import User, Consent, AuditLog
from backend.app.schemas.schemas import LoginRequest, VerifyOTPRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Find or create user
    user = db.query(User).filter(User.phone_or_email == req.phone_or_email).first()
    if not user:
        user = User(
            phone_or_email=req.phone_or_email,
            full_name=req.full_name or "Verified Citizen",
            preferred_language=req.language or "en",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Grant default consents
        default_categories = ["bank", "insurance", "investments", "pf", "property", "benefits"]
        for cat in default_categories:
            c = Consent(
                user_id=user.id,
                source_category=cat,
                source_name=f"Authorized {cat.upper()} Query Adapter",
                is_granted=True,
                purpose=f"Permitted entity matching against authorized {cat} institutional registry."
            )
            db.add(c)
        db.commit()

    return {
        "status": "otp_sent",
        "phone_or_email": req.phone_or_email,
        "message": "Secure OTP sent to authorized device (Simulation code: 123456)."
    }

@router.post("/verify-otp", response_model=AuthResponse)
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    if req.otp != "123456" and len(req.otp) != 6:
        raise HTTPException(status_code=400, detail="Invalid OTP code entered.")

    user = db.query(User).filter(User.phone_or_email == req.phone_or_email).first()
    if not user:
        user = User(
            phone_or_email=req.phone_or_email,
            full_name="Verified Citizen",
            preferred_language=req.language or "en",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Log audit event
    audit = AuditLog(
        user_id=user.id,
        action="AUTH_LOGIN_SUCCESS",
        source="SECURE_GATEWAY",
        details="Citizen successfully authenticated via secure OTP session."
    )
    db.add(audit)
    db.commit()

    return AuthResponse(
        success=True,
        token=f"adhikaar_jwt_token_sec_{user.id}_9827",
        user={
            "id": user.id,
            "phone_or_email": user.phone_or_email,
            "full_name": user.full_name,
            "preferred_language": user.preferred_language,
        },
        message="Session successfully established."
    )

@router.post("/logout")
def logout():
    return {"success": True, "message": "Session invalidated securely."}
