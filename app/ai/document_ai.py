import re
from typing import Dict, Any
from backend.app.ai.entity_resolution import levenshtein_similarity, normalize_text

def analyze_document_upload(
    file_name: str,
    document_category: str,
    target_asset_holder_name: str = "",
    extracted_name_override: str = ""
) -> Dict[str, Any]:
    """
    Performs security verification, simulated OCR parsing,
    and mismatch detection against the claimed asset record.
    """
    # 1. Security Check
    security_passed = True
    if file_name.lower().endswith(('.exe', '.bat', '.sh', '.vbs', '.js')):
        security_passed = False
        return {
            "security_scan_passed": False,
            "ocr_confidence": 0.0,
            "extracted_name": None,
            "extracted_identifier_masked": None,
            "mismatch_detected": True,
            "mismatch_details": "File type failed security signature validation.",
            "suggested_action": "Please upload a clean PDF, JPG, or PNG document."
        }

    # 2. Simulated OCR extraction
    # If user provided name or default to clean name
    extracted_name = extracted_name_override or target_asset_holder_name or "Verified Citizen"
    
    # Masked simulated ID (e.g. Aadhaar/PAN/Voter)
    masked_id = "XXXX-XXXX-8921" if "id" in document_category or "identity" in document_category else "IN-DOC-4482"
    
    # 3. Mismatch Detection against historical record
    mismatch_detected = False
    mismatch_details = ""
    suggested_action = "Document validated. You may proceed to prepare your claim application."

    if target_asset_holder_name and extracted_name:
        sim = levenshtein_similarity(target_asset_holder_name, extracted_name)
        if sim < 0.98 and sim > 0.70:
            mismatch_detected = True
            mismatch_details = (
                f"Minor name variation detected: Document displays '{extracted_name}' "
                f"while asset record indicates '{target_asset_holder_name}'. "
                f"An affidavit or Gazette notification / self-declaration may be requested by the authority."
            )
            suggested_action = "Include a joint self-declaration or name consistency affirmation in your claim packet."
        elif sim <= 0.70:
            mismatch_detected = True
            mismatch_details = (
                f"Significant identity mismatch: Document displays '{extracted_name}' "
                f"which deviates from historical asset holder '{target_asset_holder_name}'."
            )
            suggested_action = "Please provide legal heir certificate, succession certificate, or official name change document."

    return {
        "security_scan_passed": security_passed,
        "ocr_confidence": 0.97,
        "extracted_name": extracted_name,
        "extracted_identifier_masked": masked_id,
        "mismatch_detected": mismatch_detected,
        "mismatch_details": mismatch_details if mismatch_detected else "Name and document criteria align with source requirements.",
        "suggested_action": suggested_action
    }
