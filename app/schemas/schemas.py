from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth & User ---
class LoginRequest(BaseModel):
    phone_or_email: str
    full_name: Optional[str] = None
    language: Optional[str] = "en"

class VerifyOTPRequest(BaseModel):
    phone_or_email: str
    otp: str = "123456"
    language: Optional[str] = "en"

class AuthResponse(BaseModel):
    success: bool
    token: str
    user: Dict[str, Any]
    message: str

# --- Consent ---
class ConsentItem(BaseModel):
    source_category: str
    source_name: str
    is_granted: bool
    purpose: str

class UpdateConsentRequest(BaseModel):
    consents: List[ConsentItem]

# --- Discovery Search ---
class SearchRequest(BaseModel):
    category: Optional[str] = "all" # bank, insurance, investments, pf, property, benefits, all
    name: str
    phone: Optional[str] = None
    dob: Optional[str] = None # YYYY-MM-DD or partial
    location: Optional[str] = None
    institution: Optional[str] = None
    reference_hint: Optional[str] = None
    additional_notes: Optional[str] = None
    language: Optional[str] = "en"

class EvidenceItem(BaseModel):
    factor: str
    score: float
    description: str
    status: str # matched, partial, missing

class AssetMatchSummary(BaseModel):
    id: int
    asset_id: int
    category: str
    institution: str
    holder_name_on_record: str
    identifier_masked: str
    overall_confidence: float
    approximate_value_range: str
    match_reason: str
    last_activity_year: Optional[int]
    claim_difficulty: str
    source_name: str
    source_health: str
    official_portal_url: str
    required_documents: List[str]

class SearchResponse(BaseModel):
    search_id: str
    query_name: str
    total_matches_found: int
    matches: List[AssetMatchSummary]
    sources_queried: List[Dict[str, Any]]
    execution_time_ms: int

# --- Asset Detail & Evidence ---
class AssetDetailResponse(BaseModel):
    id: int
    category: str
    institution: str
    holder_name: str
    identifier_masked: str
    approximate_value_range: str
    overall_confidence: float
    name_similarity: float
    phonetic_similarity: float
    address_similarity: float
    timeline_fit: float
    match_reason: str
    evidence_breakdown: List[EvidenceItem]
    last_activity_year: Optional[int]
    claim_difficulty: str
    required_documents: List[str]
    official_portal_url: str
    source_authority: str
    source_health: str
    source_last_synced: str

# --- Document AI ---
class DocumentAnalysisResponse(BaseModel):
    document_id: int
    file_name: str
    document_category: str
    security_scan_passed: bool
    ocr_confidence: float
    extracted_name: Optional[str]
    extracted_identifier_masked: Optional[str]
    mismatch_detected: bool
    mismatch_details: Optional[str]
    suggested_action: str

# --- Claims & Recovery ---
class CreateClaimRequest(BaseModel):
    match_id: int
    user_notes: Optional[str] = None

class ClaimReadinessResponse(BaseModel):
    claim_id: int
    claim_reference_id: str
    readiness_percentage: int
    completed_checks: List[str]
    pending_checks: List[str]
    missing_documents: List[str]
    immediate_next_action: str
    official_portal_url: str
    authority_name: str

class ApplicationDraftResponse(BaseModel):
    claim_reference_id: str
    institution: str
    category: str
    claimant_name: str
    account_reference_masked: str
    checklist: List[str]
    draft_application_letter: str
    official_portal_link: str
    submission_instructions: str
    disclaimer: str

class ClaimTimelineEventOut(BaseModel):
    stage: str
    title: str
    description: str
    is_completed: bool
    requires_action: bool
    timestamp: str

class ClaimDetailOut(BaseModel):
    id: int
    claim_reference_id: str
    category: str
    institution: str
    current_stage: str
    readiness_score: int
    official_source: str
    tracking_status: str
    action_required_desc: Optional[str]
    official_portal_url: Optional[str]
    created_at: str
    events: List[ClaimTimelineEventOut]

# --- AI Scam Shield ---
class ScamCheckRequest(BaseModel):
    content: str
    input_type: Optional[str] = "text" # text, sms, email, url

class ScamCheckResponse(BaseModel):
    risk_level: str # HIGH RISK, MODERATE RISK, LOW RISK, SAFE
    risk_score: int # 0 to 100
    detected_flags: List[str]
    plain_language_explanation: str
    official_comparison: str
    safe_next_action: str

# --- AI Chat ---
class ChatMessage(BaseModel):
    role: str # user, assistant, system
    content: str

class ChatRequest(BaseModel):
    mode: str = "recovery" # recovery or portal
    messages: List[ChatMessage]
    current_page: Optional[str] = None
    asset_context_id: Optional[int] = None
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str]
    relevant_tools: List[str]
