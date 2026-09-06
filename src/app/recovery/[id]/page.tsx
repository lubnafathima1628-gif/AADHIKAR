"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { ClaimReadinessResponse, ApplicationDraftResponse } from "@/types";
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  Download, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

const RECOVERY_STAGES = [
  { id: "discover", label: "DISCOVER", title: "Identity Match", status: "completed" },
  { id: "verify", label: "VERIFY", title: "Evidence Verification", status: "completed" },
  { id: "prepare", label: "PREPARE", title: "Document & Dossier Prep", status: "active" },
  { id: "claim", label: "CLAIM", title: "Official Portal Submission", status: "pending" },
  { id: "track", label: "TRACK", title: "Nodal Authority Review", status: "pending" },
  { id: "recover", label: "RECOVER", title: "Disbursement & Resolution", status: "pending" },
];

export default function RecoveryJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = Number(params.id) || 1;

  const [readiness, setReadiness] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"journey" | "readiness" | "drafter">("readiness");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiClient.getClaimReadiness(assetId).then(setReadiness);
    apiClient.getDraftApplication(assetId).then(setDraft);
  }, [assetId]);

  const handleCopyDraft = () => {
    if (draft?.draft_application_letter) {
      navigator.clipboard.writeText(draft.draft_application_letter);
      setCopied(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sage-400/15">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/results"
              className="text-xs text-sage-400 hover:text-earth-300 flex items-center gap-1 mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Results</span>
            </Link>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              RECOVERY DOSSIER #{readiness?.claim_reference_id || "UA-2026-81920"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
            Statutory Claim Recovery Journey
          </h1>
          <p className="text-xs text-sage-300 font-light mt-0.5">
            Step-by-step facilitation and application dossier drafting for {draft?.institution || "Authorized Institution"}.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-forest-900/90 border border-sage-400/20 text-xs">
          <button
            onClick={() => setActiveTab("readiness")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "readiness"
                ? "bg-earth-500/30 text-earth-300 font-semibold shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                : "text-sage-300 hover:text-sand-100"
            }`}
          >
            Claim Readiness
          </button>
          <button
            onClick={() => setActiveTab("drafter")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "drafter"
                ? "bg-earth-500/30 text-earth-300 font-semibold shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                : "text-sage-300 hover:text-sand-100"
            }`}
          >
            Application Drafter
          </button>
          <button
            onClick={() => setActiveTab("journey")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "journey"
                ? "bg-earth-500/30 text-earth-300 font-semibold shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                : "text-sage-300 hover:text-sand-100"
            }`}
          >
            Milestone Journey
          </button>
        </div>
      </div>

      {/* Organic Recovery Journey Path Visualizer */}
      <div className="p-6 rounded-2xl glass-card border border-sage-400/25 space-y-4">
        <div className="flex items-center justify-between text-xs text-sage-400">
          <span className="font-mono uppercase font-bold text-sand-100">Statutory Recovery Route</span>
          <span>Current Stage: <strong className="text-earth-300">Prepare Dossier</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {RECOVERY_STAGES.map((stage, sIdx) => {
            const isCompleted = stage.status === "completed";
            const isActive = stage.status === "active";

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-earth-500/20 border-earth-400 shadow-[0_0_16px_rgba(197,160,89,0.3)]"
                    : isCompleted
                    ? "bg-forest-950/80 border-emerald-500/40 text-emerald-300"
                    : "bg-forest-950/40 border-sage-400/10 text-sage-500 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono">0{sIdx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-earth-400 animate-ping" />
                  ) : null}
                </div>
                <h4 className="text-xs font-bold text-sand-100">{stage.label}</h4>
                <p className="text-[10px] text-sage-400 truncate mt-0.5">{stage.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "readiness" && (
          <motion.div
            key="tab-readiness"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left: Big Score Gauge */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-sage-400/25 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-[10px] font-mono uppercase text-sage-400 tracking-widest">
                CLAIM READINESS INDEX
              </span>

              <div className="relative flex items-center justify-center">
                <svg className="w-44 h-44 -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    fill="none"
                    stroke="rgba(143, 168, 155, 0.15)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    fill="none"
                    stroke="#c5a059"
                    strokeWidth="10"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * (readiness?.readiness_percentage || 76)) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-serif font-bold text-earth-300">
                    {readiness?.readiness_percentage || 76}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 mt-0.5">DOSSIER STRONG</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-forest-950/80 border border-sage-400/20 text-xs text-left w-full space-y-1">
                <span className="text-[10px] text-earth-400 uppercase font-mono block">IMMEDIATE ACTION</span>
                <p className="text-sand-100 text-xs leading-relaxed">
                  {readiness?.immediate_next_action || "Upload cancelled bank cheque leaf to verify disbursement IFSC."}
                </p>
              </div>

              <Link
                href="/documents"
                className="w-full py-2.5 rounded-xl bg-earth-500/30 hover:bg-earth-500/45 text-earth-200 border border-earth-400/50 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(197,160,89,0.2)]"
              >
                <span>Upload Remaining Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right: Checklist Breakdown */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-sand-50">
                  Readiness Criteria Breakdown
                </h3>
                <p className="text-xs text-sage-300 mt-0.5">
                  Automated validation against {readiness?.authority_name || "Statutory Authority"} claim guidelines.
                </p>
              </div>

              {/* Completed Checks */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  ✓ VERIFIED REQUIREMENTS
                </span>
                {readiness?.completed_checks?.map((chk: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-forest-950/70 border border-emerald-500/30 text-xs text-sand-100 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>

              {/* Pending / Missing Checks */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  ⚠ MISSING DOCUMENTATION
                </span>
                {readiness?.missing_documents?.map((doc: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-forest-950/70 border border-amber-500/30 text-xs text-sand-100 flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "drafter" && (
          <motion.div
            key="tab-drafter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-earth-300 uppercase tracking-wider">
                  AI APPLICATION DRAFTER
                </span>
                <h3 className="text-xl font-serif font-bold text-sand-50 mt-0.5">
                  Prepared Claim Packet for {draft?.institution}
                </h3>
                <p className="text-xs text-sage-300 mt-0.5">
                  Pre-formatted application letter and checklist ready for physical submission or official portal upload.
                </p>
              </div>

              <button
                onClick={handleCopyDraft}
                className="px-4 py-2.5 rounded-xl bg-earth-500/30 hover:bg-earth-500/45 text-earth-200 border border-earth-400/50 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Letter Copied!" : "Copy Application Text"}</span>
              </button>
            </div>

            {/* Checklist Box */}
            <div className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-2.5 text-xs">
              <span className="text-[10px] font-mono text-earth-300 uppercase">STEP-BY-STEP SUBMISSION CHECKLIST</span>
              {draft?.checklist?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sage-200">
                  <span className="text-earth-400 font-bold">{idx + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Draft Letter Preview */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-sage-400 uppercase">FORMAL APPLICATION LETTER PREVIEW</span>
              <pre className="p-4 rounded-xl bg-forest-950 border border-sage-400/20 font-mono text-xs text-sage-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {draft?.draft_application_letter}
              </pre>
            </div>

            {/* Statutory Disclaimer & Direct Portal Link */}
            <div className="p-4 rounded-xl bg-forest-950/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="text-sage-300 text-xs leading-relaxed">
                <strong className="text-amber-300">Statutory Notice: </strong>
                {draft?.submission_instructions || "ADHIKAAR prepares your claim packet. Official submission and legal verification are executed directly through the authority portal."}
              </div>

              {draft?.official_portal_link && (
                <a
                  href={draft.official_portal_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-earth-500/25 hover:bg-earth-500/35 text-earth-200 border border-earth-400/40 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>Proceed to Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "journey" && (
          <motion.div
            key="tab-journey"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6"
          >
            <h3 className="text-lg font-serif font-bold text-sand-50">
              End-to-End Statutory Recovery Timeline
            </h3>

            <div className="relative pl-6 border-l border-sage-400/20 space-y-6 text-xs">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-400" />
                <h4 className="font-bold text-sand-100 text-sm">Stage 1: Multi-Source Discovery</h4>
                <p className="text-sage-300 mt-1">Multi-attribute statistical query matched records with 96% confidence.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-400" />
                <h4 className="font-bold text-sand-100 text-sm">Stage 2: Identity & Transliteration Verification</h4>
                <p className="text-sage-300 mt-1">Name variant 'Lubna Fatima' mapped with 'Lubna Fathima'.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-earth-400 animate-pulse" />
                <h4 className="font-bold text-earth-300 text-sm">Stage 3: Application Dossier Preparation (Current)</h4>
                <p className="text-sage-300 mt-1">Generating self-declaration affidavit and bank mandate documents.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-sage-600" />
                <h4 className="font-bold text-sage-400 text-sm">Stage 4: Official Nodal Submission</h4>
                <p className="text-sage-500 mt-1">Direct upload or branch verification via RBI UDGAM or IEPF-5.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-sage-600" />
                <h4 className="font-bold text-sage-400 text-sm">Stage 5: Statutory Approval & Disbursement</h4>
                <p className="text-sage-500 mt-1">Direct electronic credit into verified Aadhaar-seeded bank account.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
