from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from backend.app.database import get_db
from backend.app.models.models import DocumentRecord, AssetMatch, User, AuditLog
from backend.app.schemas.schemas import DocumentAnalysisResponse
from backend.app.ai.document_ai import analyze_document_upload

router = APIRouter(prefix="/documents", tags=["Document AI"])

@router.post("/analyze", response_model=DocumentAnalysisResponse)
def analyze_document(
    file_name: str = Form(...),
    document_category: str = Form("identity_proof"),
    asset_match_id: Optional[int] = Form(None),
    extracted_name_input: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).first()
    target_holder_name = ""
    if asset_match_id:
        match = db.query(AssetMatch).filter(AssetMatch.id == asset_match_id).first()
        if match and match.asset_record:
            target_holder_name = match.asset_record.holder_name

    ai_result = analyze_document_upload(
        file_name=file_name,
        document_category=document_category,
        target_asset_holder_name=target_holder_name,
        extracted_name_override=extracted_name_input or ""
    )

    doc_rec = DocumentRecord(
        user_id=user.id if user else 1,
        asset_match_id=asset_match_id,
        file_name=file_name,
        document_category=document_category,
        security_scan_passed=ai_result["security_scan_passed"],
        extracted_name=ai_result["extracted_name"],
        extracted_identifier_masked=ai_result["extracted_identifier_masked"],
        mismatch_detected=ai_result["mismatch_detected"],
        mismatch_details=ai_result["mismatch_details"],
        ocr_confidence=ai_result["ocr_confidence"]
    )
    db.add(doc_rec)
    
    if user:
        audit = AuditLog(
            user_id=user.id,
            action="DOCUMENT_AI_ANALYSIS",
            source="DOCUMENT_WORKSPACE",
            details=f"Document '{file_name}' analyzed with OCR confidence {int(ai_result['ocr_confidence']*100)}%. Mismatch: {ai_result['mismatch_detected']}."
        )
        db.add(audit)

    db.commit()
    db.refresh(doc_rec)

    return DocumentAnalysisResponse(
        document_id=doc_rec.id,
        file_name=file_name,
        document_category=document_category,
        security_scan_passed=ai_result["security_scan_passed"],
        ocr_confidence=ai_result["ocr_confidence"],
        extracted_name=ai_result["extracted_name"],
        extracted_identifier_masked=ai_result["extracted_identifier_masked"],
        mismatch_detected=ai_result["mismatch_detected"],
        mismatch_details=ai_result["mismatch_details"],
        suggested_action=ai_result["suggested_action"]
    )

@router.get("", response_model=List[Dict[str, Any]])
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(DocumentRecord).order_by(DocumentRecord.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "file_name": d.file_name,
            "document_category": d.document_category,
            "security_scan_passed": d.security_scan_passed,
            "extracted_name": d.extracted_name,
            "extracted_identifier_masked": d.extracted_identifier_masked,
            "mismatch_detected": d.mismatch_detected,
            "mismatch_details": d.mismatch_details,
            "ocr_confidence": d.ocr_confidence,
            "created_at": d.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for d in docs
    ]
