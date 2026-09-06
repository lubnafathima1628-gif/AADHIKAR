import { 
  PotentialAssetMatch, 
  AssetDetailData, 
  DocumentItem, 
  ClaimRecord, 
  ScamResult, 
  ConsentItemData, 
  AuditLogItem, 
  GraphNode, 
  GraphLink 
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// Helper fetch wrapper with fallback
async function apiFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[ADHIKAAR API Client] Fetch to ${endpoint} failed, using client state fallback.`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const apiClient = {
  // Authentication
  async login(phone_or_email: string, full_name?: string, language?: string) {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone_or_email, full_name, language }),
    }, { status: "otp_sent", message: "OTP 123456 sent" });
  },

  async verifyOtp(phone_or_email: string, otp: string, language?: string) {
    return apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone_or_email, otp, language }),
    }, {
      success: true,
      token: "adhikaar_token_demo",
      user: { id: 1, phone_or_email, full_name: "Lubna Fathima", preferred_language: language || "en" },
      message: "Verified"
    });
  },

  // Discovery
  async search(payload: {
    name: string;
    category?: string;
    phone?: string;
    location?: string;
    institution?: string;
    reference_hint?: string;
  }) {
    return apiFetch<{
      search_id: string;
      query_name: string;
      total_matches_found: number;
      matches: PotentialAssetMatch[];
      sources_queried: any[];
      execution_time_ms: number;
    }>("/discovery/search", {
      method: "POST",
      body: JSON.stringify(payload),
    }, {
      search_id: "SRC-DEMO-01",
      query_name: payload.name,
      total_matches_found: 4,
      execution_time_ms: 480,
      sources_queried: [
        { code: "RBI_UDGAM", name: "RBI UDGAM", health_status: "healthy", latency_ms: 110 },
        { code: "MCA_IEPF", name: "IEPF Authority", health_status: "healthy", latency_ms: 95 },
        { code: "IRDAI_BIMA", name: "IRDAI Bima Bharosa", health_status: "healthy", latency_ms: 140 },
        { code: "MOL_EPFO", name: "EPFO Inoperative Portal", health_status: "delayed", latency_ms: 280 },
      ],
      matches: [
        {
          id: 1,
          asset_id: 1,
          category: "bank",
          institution: "State Bank of India (SBI)",
          holder_name_on_record: "Lubna Fatima",
          identifier_masked: "SB-XXXX-XXXX-4912",
          overall_confidence: 0.96,
          approximate_value_range: "₹42,500 – ₹55,000",
          match_reason: "High phonetic similarity ('Lubna Fatima') and Bangalore address alignment with RBI DEA Fund ledger.",
          last_activity_year: 2014,
          claim_difficulty: "simple",
          source_name: "RBI UDGAM Gateway",
          source_health: "healthy",
          official_portal_url: "https://udgam.rbi.org.in",
          required_documents: ["Aadhaar Card", "PAN Card", "Original / Copy of Passbook", "Unclaimed Deposit Claim Form"],
        },
        {
          id: 2,
          asset_id: 3,
          category: "investments",
          institution: "Tata Consultancy Services Ltd / IEPF Authority",
          holder_name_on_record: "Lubna Fathimah",
          identifier_masked: "FOLIO-TCS-XXXX-7104",
          overall_confidence: 0.94,
          approximate_value_range: "₹3,85,000 (110 Shares + 7 Yrs Dividends)",
          match_reason: "Transliteration match with company dividend register transferred under Companies Act Sec 124(6).",
          last_activity_year: 2016,
          claim_difficulty: "moderate",
          source_name: "IEPF Authority (MCA)",
          source_health: "healthy",
          official_portal_url: "https://www.iepf.gov.in",
          required_documents: ["Form IEPF-5 Web Acknowledgement", "Indemnity Bond", "Demat CML Statement", "Aadhaar & PAN"],
        },
        {
          id: 3,
          asset_id: 4,
          category: "insurance",
          institution: "Life Insurance Corporation of India (LIC)",
          holder_name_on_record: "Lubna Fatima",
          identifier_masked: "POL-XXXX-XXXX-9903",
          overall_confidence: 0.91,
          approximate_value_range: "₹88,000 – ₹98,000",
          match_reason: "Unclaimed maturity proceeds held under IRDAI Senior Citizens Welfare Fund custody.",
          last_activity_year: 2017,
          claim_difficulty: "simple",
          source_name: "IRDAI Bima Bharosa",
          source_health: "healthy",
          official_portal_url: "https://bimabharosa.irdai.gov.in",
          required_documents: ["Policy Document or Bond", "Discharge Voucher Form 3825", "Cancelled Bank Cheque"],
        },
        {
          id: 4,
          asset_id: 5,
          category: "pf",
          institution: "Employees' Provident Fund Organisation (EPFO)",
          holder_name_on_record: "L. Fathima",
          identifier_masked: "KN/BNG/XXXX-4819/000",
          overall_confidence: 0.87,
          approximate_value_range: "₹64,200 – ₹72,000",
          match_reason: "Initial variation matching previous Bangalore employer PF establishment ID.",
          last_activity_year: 2015,
          claim_difficulty: "moderate",
          source_name: "EPFO Inoperative Member Portal",
          source_health: "delayed",
          official_portal_url: "https://unifiedportal-mem.epfindia.gov.in",
          required_documents: ["EPFO Form 19", "Joint Declaration Form", "Bank Passbook Copy with IFSC"],
        }
      ]
    });
  },

  // Assets
  async getAssetDetail(matchId: number): Promise<AssetDetailData> {
    return apiFetch<AssetDetailData>(`/assets/${matchId}`, undefined, {
      id: matchId,
      asset_id: matchId,
      category: matchId === 2 ? "investments" : matchId === 3 ? "insurance" : matchId === 4 ? "pf" : "bank",
      institution: matchId === 2 ? "Tata Consultancy Services Ltd / IEPF" : matchId === 3 ? "Life Insurance Corporation (LIC)" : matchId === 4 ? "Employees' Provident Fund Organisation" : "State Bank of India (SBI)",
      holder_name_on_record: matchId === 2 ? "Lubna Fathimah" : matchId === 4 ? "L. Fathima" : "Lubna Fatima",
      identifier_masked: matchId === 2 ? "FOLIO-TCS-XXXX-7104" : matchId === 3 ? "POL-XXXX-XXXX-9903" : matchId === 4 ? "KN/BNG/XXXX-4819" : "SB-XXXX-XXXX-4912",
      overall_confidence: matchId === 2 ? 0.94 : matchId === 3 ? 0.91 : matchId === 4 ? 0.87 : 0.96,
      approximate_value_range: matchId === 2 ? "₹3,85,000 (110 Shares + 7 Yrs Dividends)" : matchId === 3 ? "₹88,000 – ₹98,000" : matchId === 4 ? "₹64,200 – ₹72,000" : "₹42,500 – ₹55,000",
      name_similarity: 0.95,
      phonetic_similarity: 0.98,
      address_similarity: 0.89,
      timeline_fit: 0.94,
      match_reason: "High phonetic similarity with historical registry and jurisdictional proximity.",
      last_activity_year: 2014,
      claim_difficulty: matchId === 2 ? "moderate" : "simple",
      source_name: matchId === 2 ? "IEPF Authority" : "RBI UDGAM Gateway",
      source_health: "healthy",
      source_authority: matchId === 2 ? "Ministry of Corporate Affairs" : "Reserve Bank of India",
      source_last_synced: "2026-09-06 12:30 UTC",
      official_portal_url: matchId === 2 ? "https://www.iepf.gov.in" : "https://udgam.rbi.org.in",
      required_documents: ["Aadhaar Card", "PAN Card", "Original Passbook / Statement", "Indemnity Bond"],
      evidence_breakdown: [
        { factor: "Name & Spelling Alignment", score: 0.94, description: "Historical record 'Lubna Fatima' aligns with target profile 'Lubna Fathima' via phonetic normalization.", status: "matched" },
        { factor: "Phonetic / Transliteration Score", score: 0.98, description: "Soundex code L150 matches across regional vowel conventions.", status: "matched" },
        { factor: "Jurisdictional Match", score: 0.91, description: "Historical account opened in Bangalore Urban jurisdiction.", status: "matched" },
        { factor: "Institutional Integrity", score: 0.99, description: "Data verified from official DEA Fund schedule.", status: "matched" },
      ]
    });
  },

  async getRelationshipGraph(): Promise<{ nodes: GraphNode[]; links: GraphLink[] }> {
    return apiFetch("/assets/graph/relationship", undefined, {
      nodes: [
        { id: "identity", label: "Lubna Fathima", type: "citizen", category: "identity", value: 100, details: "Verified Identity Anchor" },
        { id: "cat_bank", label: "BANK / DEPOSITS", type: "category", category: "bank", value: 75, details: "Channel: Bank" },
        { id: "cat_investments", label: "INVESTMENTS / IEPF", type: "category", category: "investments", value: 75, details: "Channel: Investments" },
        { id: "cat_insurance", label: "INSURANCE", type: "category", category: "insurance", value: 75, details: "Channel: Insurance" },
        { id: "cat_pf", label: "EPF / PF", type: "category", category: "pf", value: 75, details: "Channel: PF" },
        { id: "asset_1", label: "SBI Savings (₹48K)", type: "asset", category: "bank", confidence: 0.96, value: 50, match_id: 1, details: "Potential Match: 96%" },
        { id: "asset_2", label: "TCS Shares (₹3.85L)", type: "asset", category: "investments", confidence: 0.94, value: 50, match_id: 2, details: "Potential Match: 94%" },
        { id: "asset_3", label: "LIC Policy (₹92K)", type: "asset", category: "insurance", confidence: 0.91, value: 50, match_id: 3, details: "Potential Match: 91%" },
        { id: "asset_4", label: "EPFO PF (₹68K)", type: "asset", category: "pf", confidence: 0.87, value: 50, match_id: 4, details: "Potential Match: 87%" },
      ],
      links: [
        { source: "identity", target: "cat_bank", strength: 0.8 },
        { source: "identity", target: "cat_investments", strength: 0.8 },
        { source: "identity", target: "cat_insurance", strength: 0.8 },
        { source: "identity", target: "cat_pf", strength: 0.8 },
        { source: "cat_bank", target: "asset_1", strength: 0.9 },
        { source: "cat_investments", target: "asset_2", strength: 0.9 },
        { source: "cat_insurance", target: "asset_3", strength: 0.9 },
        { source: "cat_pf", target: "asset_4", strength: 0.9 },
      ]
    });
  },

  // Document AI
  async analyzeDocument(formData: FormData) {
    try {
      const res = await fetch(`${API_BASE}/documents/analyze`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Document analyze fallback active");
    }
    const fileName = (formData.get("file_name") as string) || "document.pdf";
    return {
      document_id: 101,
      file_name: fileName,
      document_category: "identity_proof",
      security_scan_passed: true,
      ocr_confidence: 0.98,
      extracted_name: "Lubna Fathima",
      extracted_identifier_masked: "XXXX-XXXX-8921",
      mismatch_detected: true,
      mismatch_details: "Minor name variation detected: Document displays 'Lubna Fathima' while historical asset record indicates 'Lubna Fatima'.",
      suggested_action: "Include an automated Name Consistency Affirmation (prepared in Application Drafter) with your claim pack."
    };
  },

  // Claims
  async createClaim(matchId: number) {
    return apiFetch("/claims", {
      method: "POST",
      body: JSON.stringify({ match_id: matchId }),
    }, {
      claim_id: 1,
      claim_reference_id: "UA-2026-81920",
      readiness_score: 78,
      current_stage: "prepare",
      institution: "State Bank of India (SBI)"
    });
  },

  async getClaimReadiness(claimId: number) {
    return apiFetch(`/claims/${claimId}/readiness`, undefined, {
      claim_id: claimId,
      claim_reference_id: "UA-2026-81920",
      readiness_percentage: 76,
      completed_checks: [
        "Identity Normalization & Phonetic Alignment Verified",
        "Statutory Database Reference Validated",
        "Aadhaar / National ID Authentication Linked"
      ],
      pending_checks: [
        "Signed Name Consistency Affirmation (Automated)",
        "Bank Branch Nodal Verification"
      ],
      missing_documents: [
        "Cancelled Cheque Leaf with Printed Account Holder Name",
        "Address Proof matching current domicile"
      ],
      immediate_next_action: "Upload a clear scan of your cancelled cheque or passbook first page.",
      official_portal_url: "https://udgam.rbi.org.in",
      authority_name: "Reserve Bank of India / State Bank of India"
    });
  },

  async getDraftApplication(claimId: number) {
    return apiFetch(`/claims/${claimId}/draft-application`, undefined, {
      claim_reference_id: "UA-2026-81920",
      institution: "State Bank of India (SBI)",
      category: "bank",
      claimant_name: "Lubna Fathima",
      account_reference_masked: "SB-XXXX-XXXX-4912",
      checklist: [
        "Print and sign this AI-prepared application letter.",
        "Attach self-attested Aadhaar and PAN copy.",
        "Attach cancelled cheque or bank passbook copy with IFSC.",
        "Attach Name Consistency Affirmation for 'Lubna Fathima' / 'Lubna Fatima'.",
        "Submit directly via official UDGAM / Branch Nodal officer."
      ],
      draft_application_letter: `APPLICATION FOR RECOVERY OF UNCLAIMED ASSET\nTo,\nThe Branch Manager / Nodal Officer\nState Bank of India\n\nSubject: Request for release of unclaimed deposit funds (SB-XXXX-XXXX-4912).\n\nRespected Sir/Madam,\nI, Lubna Fathima, hereby submit my claim regarding the unclaimed savings account balance transferred under DEA Fund regulations.\n\nEnclosed:\n1. Self-attested Aadhaar & PAN\n2. Cancelled Bank Cheque Leaf\n3. Name Consistency Affirmation\n\nKindly verify and disburse to my verified bank account.\n\nYours faithfully,\nLubna Fathima`,
      official_portal_link: "https://udgam.rbi.org.in",
      submission_instructions: "ADHIKAAR prepares your claim packet. Official submission and legal verification are executed directly through the authority portal.",
      disclaimer: "AI-generated draft for facilitation. Official verification is governed by RBI guidelines."
    });
  },

  // Scam Shield
  async analyzeScam(content: string, inputType: string = "text"): Promise<ScamResult> {
    return apiFetch<ScamResult>("/scam/analyze", {
      method: "POST",
      body: JSON.stringify({ content, input_type: inputType }),
    }, {
      risk_level: content.toLowerCase().includes("fee") || content.toLowerCase().includes("pay") ? "HIGH RISK" : "SAFE",
      risk_score: content.toLowerCase().includes("fee") ? 92 : 10,
      detected_flags: content.toLowerCase().includes("fee") ? ["Advance fee demand to release funds", "Unverified contact channel", "Urgent deadline pressure"] : ["Official regulatory domain referenced"],
      plain_language_explanation: content.toLowerCase().includes("fee")
        ? "This communication is a suspected recovery scam demanding upfront advance payment to release funds."
        : "No malicious patterns detected. Reference matches official guidelines.",
      official_comparison: "Statutory bodies (RBI, IEPFA, EPFO) NEVER charge upfront processing fees to release funds.",
      safe_next_action: content.toLowerCase().includes("fee")
        ? "DO NOT pay. Block the sender and report to National Cyber Crime Portal (cybercrime.gov.in)."
        : "Proceed with official verification on the authorized government portal."
    });
  },

  // Chat Copilot
  async sendChat(messages: { role: string; content: string }[], mode: "recovery" | "portal", currentPage?: string) {
    return apiFetch<{ reply: string; suggested_actions: string[]; relevant_tools: string[] }>("/chat", {
      method: "POST",
      body: JSON.stringify({ messages, mode, current_page: currentPage }),
    }, {
      reply: mode === "recovery"
        ? "I am your ADHIKAAR Recovery Copilot. I analyze regulatory rules across RBI UDGAM, IEPFA, EPFO, and IRDAI. I can explain why a potential match was found, identify missing KYC documents, and help you draft official claim packets."
        : "I am your ADHIKAAR Portal Copilot. I can guide you through our living discovery ecosystem, explain privacy consent settings, or help you upload documents.",
      suggested_actions: ["Explain Match Evidence", "What documents are required?", "Check Name Discrepancy Rules"],
      relevant_tools: ["search_orchestrator", "document_ocr", "claim_drafter"]
    });
  },

  // Consent
  async getConsents(): Promise<ConsentItemData[]> {
    return apiFetch<ConsentItemData[]>("/consent", undefined, [
      { id: 1, source_category: "bank", source_name: "RBI UDGAM Bank Register", is_granted: true, purpose: "Statutory search across scheduled commercial banks.", granted_at: "2026-09-06 14:00" },
      { id: 2, source_category: "investments", source_name: "IEPF Authority (MCA)", is_granted: true, purpose: "Search for 7-year unclaimed shares and dividends.", granted_at: "2026-09-06 14:00" },
      { id: 3, source_category: "insurance", source_name: "IRDAI Bima Bharosa", is_granted: true, purpose: "Unclaimed life and general insurance maturity register.", granted_at: "2026-09-06 14:00" },
      { id: 4, source_category: "pf", source_name: "EPFO Inoperative Member Accounts", is_granted: true, purpose: "Inoperative provident fund balance matching.", granted_at: "2026-09-06 14:00" },
      { id: 5, source_category: "property", source_name: "State Land & Revenue Records", is_granted: true, purpose: "Revenue survey and partition registry lookup.", granted_at: "2026-09-06 14:00" },
    ]);
  },

  async toggleConsent(consentId: number) {
    return apiFetch(`/consent/toggle/${consentId}`, { method: "POST" }, { success: true });
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    return apiFetch<AuditLogItem[]>("/consent/audit-logs", undefined, [
      { id: 1, action: "AUTH_LOGIN_SUCCESS", source: "SECURE_GATEWAY", details: "Citizen authenticated via secure OTP session.", created_at: "2026-09-06 14:40:10 UTC" },
      { id: 2, action: "MULTI_SOURCE_DISCOVERY_QUERY", source: "DISCOVERY_ORCHESTRATOR", details: "Query 'Lubna Fathima' executed across 6 statutory sources.", created_at: "2026-09-06 14:42:25 UTC" },
      { id: 3, action: "DOCUMENT_AI_ANALYSIS", source: "DOCUMENT_WORKSPACE", details: "Document 'Aadhaar_Card.pdf' analyzed. Mismatch flag raised.", created_at: "2026-09-06 14:43:02 UTC" },
    ]);
  },

  // Admin
  async getAdminDashboard() {
    return apiFetch("/admin/dashboard", undefined, {
      potential_assets_discovered: 142894,
      estimated_unclaimed_value_cr: "₹38,400 Cr",
      claims_facilitated: 12454,
      successful_resolution_rate: "84.6%",
      avg_resolution_days: 18,
      friction_index: "Low to Moderate"
    });
  },

  async getSourceHealth() {
    return apiFetch("/admin/source-health", undefined, [
      { code: "RBI_UDGAM", name: "RBI UDGAM Gateway", category: "bank", authority: "Reserve Bank of India", health_status: "healthy", latency_ms: 110, uptime_pct: 99.8 },
      { code: "MCA_IEPF", name: "IEPF Authority Registry", category: "investments", authority: "Ministry of Corporate Affairs", health_status: "healthy", latency_ms: 95, uptime_pct: 99.9 },
      { code: "IRDAI_BIMA", name: "IRDAI Bima Bharosa", category: "insurance", authority: "IRDAI", health_status: "healthy", latency_ms: 140, uptime_pct: 99.4 },
      { code: "MOL_EPFO", name: "EPFO Member Registry", category: "pf", authority: "Ministry of Labour", health_status: "delayed", latency_ms: 280, uptime_pct: 97.2 },
      { code: "STATE_LAND", name: "State Land Registry", category: "property", authority: "Revenue Directorate", health_status: "healthy", latency_ms: 160, uptime_pct: 99.1 },
      { code: "GOV_DBT", name: "DBT Welfare Fund", category: "benefits", authority: "Public Welfare Directorate", health_status: "healthy", latency_ms: 105, uptime_pct: 99.7 },
    ]);
  },

  async getFrictionAnalytics() {
    return apiFetch("/admin/analytics", undefined, {
      funnel: [
        { stage: "Discovery Search", count: 185000, dropoff_pct: "0%" },
        { stage: "Potential Match Identified", count: 142890, dropoff_pct: "22.7%" },
        { stage: "Identity Resolution Verified", count: 118400, dropoff_pct: "17.1%" },
        { stage: "Document AI Uploaded", count: 78200, dropoff_pct: "33.9%" },
        { stage: "Official Claim Handoff", count: 52100, dropoff_pct: "33.3%" },
        { stage: "Statutory Recovery Completed", count: 44100, dropoff_pct: "15.3%" }
      ],
      primary_friction_insights: [
        {
          issue: "Historical Name Spelling Discrepancy",
          impact: "High (34% of document rejections)",
          ai_solution: "Automated Self-Declaration Affidavit generation in ADHIKAAR Application Drafter"
        },
        {
          issue: "Lack of Old Physical Account Passbook / Share Folio",
          impact: "Moderate (28% of user drop-offs)",
          ai_solution: "Indemnity Bond drafting & Bank Branch Nodal lookup assistance"
        },
        {
          issue: "Unclear Demat Client Master List (CML) Requirement for IEPF-5",
          impact: "Moderate (21% of investment claims)",
          ai_solution: "Interactive step-by-step Demat attachment guide in Recovery Copilot"
        }
      ]
    });
  }
};
