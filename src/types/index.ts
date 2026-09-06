export type AssetCategory =
  | "bank"
  | "insurance"
  | "investments"
  | "pf"
  | "property"
  | "benefits"
  | "other"
  | "all";

export type BackgroundState =
  | "entry"
  | "discover"
  | "searching"
  | "results"
  | "recovery"
  | "claim";

export interface UserProfile {
  id: number;
  phone_or_email: string;
  full_name: string;
  preferred_language: string;
}

export interface EvidenceFactor {
  factor: string;
  score: number;
  description: string;
  status: "matched" | "partial" | "missing";
}

export interface PotentialAssetMatch {
  id: number;
  asset_id: number;
  category: AssetCategory;
  institution: string;
  holder_name_on_record: string;
  identifier_masked: string;
  overall_confidence: number;
  approximate_value_range: string;
  match_reason: string;
  last_activity_year?: number;
  claim_difficulty: "simple" | "moderate" | "complex";
  source_name: string;
  source_health: "healthy" | "delayed" | "unavailable";
  official_portal_url: string;
  required_documents: string[];
}

export interface AssetDetailData extends PotentialAssetMatch {
  name_similarity: number;
  phonetic_similarity: number;
  address_similarity: number;
  timeline_fit: number;
  evidence_breakdown: EvidenceFactor[];
  source_authority: string;
  source_last_synced: string;
}

export interface ClaimEventItem {
  stage: string;
  title: string;
  description: string;
  is_completed: boolean;
  requires_action: boolean;
  timestamp: string;
}

export interface ClaimRecord {
  id: number;
  claim_reference_id: string;
  category: AssetCategory;
  institution: string;
  holder_name: string;
  identifier_masked: string;
  approximate_value_range: string;
  current_stage: "discover" | "verify" | "prepare" | "claim" | "track" | "recover";
  readiness_score: number;
  tracking_status: string;
  action_required_desc?: string;
  official_portal_url?: string;
  created_at: string;
}

export interface DocumentItem {
  id: number;
  file_name: string;
  document_category: string;
  security_scan_passed: boolean;
  extracted_name?: string;
  extracted_identifier_masked?: string;
  mismatch_detected: boolean;
  mismatch_details?: string;
  ocr_confidence: number;
  created_at: string;
}

export interface ScamResult {
  risk_level: "HIGH RISK" | "MODERATE RISK" | "LOW RISK" | "SAFE";
  risk_score: number;
  detected_flags: string[];
  plain_language_explanation: string;
  official_comparison: string;
  safe_next_action: string;
}

export interface ConsentItemData {
  id: number;
  source_category: string;
  source_name: string;
  is_granted: boolean;
  purpose: string;
  granted_at: string;
  revoked_at?: string;
}

export interface AuditLogItem {
  id: number;
  action: string;
  source: string;
  details?: string;
  created_at: string;
}

export interface ClaimReadinessResponse {
  claim_id: number;
  claim_reference_id: string;
  readiness_percentage: number;
  completed_checks: string[];
  pending_checks: string[];
  missing_documents: string[];
  immediate_next_action: string;
  official_portal_url: string;
  authority_name: string;
}

export interface ApplicationDraftResponse {
  claim_reference_id: string;
  institution: string;
  category: string;
  claimant_name: string;
  account_reference_masked: string;
  checklist: string[];
  draft_application_letter: string;
  official_portal_link: string;
  submission_instructions: string;
  disclaimer: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "citizen" | "category" | "asset";
  category?: string;
  value?: number;
  confidence?: number;
  value_range?: string;
  match_id?: number;
  details?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}
