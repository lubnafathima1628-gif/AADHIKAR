import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_or_email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(150), nullable=True)
    preferred_language = Column(String(20), default="en")
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    consents = relationship("Consent", back_populates="user", cascade="all, delete-orphan")
    matches = relationship("AssetMatch", back_populates="user", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("DocumentRecord", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")

class Consent(Base):
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    source_category = Column(String(50), nullable=False)
    source_name = Column(String(100), nullable=False)
    is_granted = Column(Boolean, default=True)
    purpose = Column(String(255), nullable=False)
    granted_at = Column(DateTime, default=datetime.datetime.utcnow)
    revoked_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="consents")

class AssetSource(Base):
    __tablename__ = "asset_sources"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False) # bank, insurance, investments, pf, property, benefits, other
    authority = Column(String(150), nullable=False)
    health_status = Column(String(20), default="healthy") # healthy, delayed, unavailable
    latency_ms = Column(Integer, default=120)
    last_synced_at = Column(DateTime, default=datetime.datetime.utcnow)
    official_portal_url = Column(String(255), nullable=False)

    assets = relationship("AssetRecord", back_populates="source")

class AssetRecord(Base):
    __tablename__ = "asset_records"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("asset_sources.id"), nullable=False)
    category = Column(String(50), nullable=False)
    institution = Column(String(150), nullable=False)
    identifier_masked = Column(String(100), nullable=False)
    holder_name = Column(String(150), nullable=False)
    holder_dob = Column(String(20), nullable=True)
    holder_phone_hash = Column(String(64), nullable=True)
    holder_address = Column(String(255), nullable=True)
    approximate_value_range = Column(String(50), nullable=False)
    status = Column(String(50), default="unclaimed")
    last_activity_year = Column(Integer, nullable=True)
    claim_difficulty = Column(String(20), default="moderate") # simple, moderate, complex
    required_documents = Column(JSON, default=list)
    official_portal_url = Column(String(255), nullable=False)
    source_notes = Column(Text, nullable=True)

    source = relationship("AssetSource", back_populates="assets")
    matches = relationship("AssetMatch", back_populates="asset_record")

class AssetMatch(Base):
    __tablename__ = "asset_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_record_id = Column(Integer, ForeignKey("asset_records.id"), nullable=False)
    overall_confidence = Column(Float, nullable=False) # e.g. 0.94
    name_similarity = Column(Float, default=0.0)
    phonetic_similarity = Column(Float, default=0.0)
    identifier_match = Column(Float, default=0.0)
    address_similarity = Column(Float, default=0.0)
    timeline_fit = Column(Float, default=0.0)
    match_reason = Column(Text, nullable=False)
    evidence_breakdown = Column(JSON, default=dict)
    status = Column(String(50), default="potential") # potential, verified, claimed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="matches")
    asset_record = relationship("AssetRecord", back_populates="matches")
    claims = relationship("Claim", back_populates="match")
    documents = relationship("DocumentRecord", back_populates="match")

class DocumentRecord(Base):
    __tablename__ = "document_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_match_id = Column(Integer, ForeignKey("asset_matches.id"), nullable=True)
    file_name = Column(String(255), nullable=False)
    document_category = Column(String(50), nullable=False) # identity_proof, address_proof, passbook, death_cert, folio_slip
    security_scan_passed = Column(Boolean, default=True)
    extracted_name = Column(String(150), nullable=True)
    extracted_identifier_masked = Column(String(100), nullable=True)
    mismatch_detected = Column(Boolean, default=False)
    mismatch_details = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.98)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="documents")
    match = relationship("AssetMatch", back_populates="documents")

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_match_id = Column(Integer, ForeignKey("asset_matches.id"), nullable=False)
    claim_reference_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. UA-2026-08192
    current_stage = Column(String(50), default="discover") # discover, verify, prepare, claim, track, recover
    readiness_score = Column(Integer, default=70) # 0 to 100
    official_source = Column(String(150), nullable=False)
    tracking_status = Column(String(50), default="in_progress") # in_progress, review, action_required, approved, disbursed
    action_required_desc = Column(String(255), nullable=True)
    official_portal_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="claims")
    match = relationship("AssetMatch", back_populates="claims")
    events = relationship("ClaimEvent", back_populates="claim", cascade="all, delete-orphan", order_by="ClaimEvent.created_at")

class ClaimEvent(Base):
    __tablename__ = "claim_events"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False)
    stage = Column(String(50), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False)
    requires_action = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    claim = relationship("Claim", back_populates="events")

class ScamAnalysis(Base):
    __tablename__ = "scam_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    input_type = Column(String(50), default="text") # text, sms, email, url
    raw_content = Column(Text, nullable=False)
    risk_level = Column(String(20), nullable=False) # high, moderate, low, safe
    risk_score = Column(Integer, nullable=False) # 0 - 100
    detected_flags = Column(JSON, default=list)
    plain_language_explanation = Column(Text, nullable=False)
    safe_next_action = Column(Text, nullable=False)
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    source = Column(String(100), nullable=False)
    details = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
