"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  ExternalLink, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface ClaimTrackingItem {
  id: string;
  category: string;
  institution: string;
  holderName: string;
  approxValue: string;
  currentStage: string;
  trackingStatus: string;
  officialSource: string;
  officialPortalUrl: string;
  lastUpdated: string;
  actionRequired?: string;
  timeline: Array<{
    stage: string;
    label: string;
    completed: boolean;
    active: boolean;
    date: string;
  }>;
}

export default function ClaimTrackerPage() {
  const [claims] = useState<ClaimTrackingItem[]>([
    {
      id: "UA-2026-81920",
      category: "bank",
      institution: "State Bank of India (SBI)",
      holderName: "Lubna Fatima",
      approxValue: "₹42,500 – ₹55,000",
      currentStage: "Institution Review",
      trackingStatus: "Under Statutory Verification",
      officialSource: "RBI Depositor Education and Awareness (DEA) Fund",
      officialPortalUrl: "https://udgam.rbi.org.in",
      lastUpdated: "2026-09-06 11:45 UTC",
      actionRequired: "Nodal branch verification scheduled with Indiranagar branch.",
      timeline: [
        { stage: "discover", label: "Multi-Source Match", completed: true, active: false, date: "04 Sep" },
        { stage: "verify", label: "Identity Normalization", completed: true, active: false, date: "05 Sep" },
        { stage: "documents", label: "KYC Dossier Prepared", completed: true, active: false, date: "06 Sep" },
        { stage: "review", label: "Statutory Branch Review", completed: false, active: true, date: "In Progress" },
        { stage: "approval", label: "Disbursement Approval", completed: false, active: false, date: "Pending" },
        { stage: "recovered", label: "Direct Credit to Bank", completed: false, active: false, date: "Pending" },
      ]
    },
    {
      id: "UA-2026-44102",
      category: "investments",
      institution: "Tata Consultancy Services Ltd / IEPF",
      holderName: "Lubna Fathimah",
      approxValue: "₹3,85,000 (110 Shares + 7 Yrs Dividends)",
      currentStage: "Document Preparation",
      trackingStatus: "Action Required: Self-Declaration",
      officialSource: "IEPF Authority (Ministry of Corporate Affairs)",
      officialPortalUrl: "https://www.iepf.gov.in",
      lastUpdated: "2026-09-06 09:15 UTC",
      actionRequired: "Generate and sign IEPF Form-5 Web Acknowledgement.",
      timeline: [
        { stage: "discover", label: "Multi-Source Match", completed: true, active: false, date: "03 Sep" },
        { stage: "verify", label: "Identity Normalization", completed: true, active: false, date: "04 Sep" },
        { stage: "documents", label: "KYC Dossier Prepared", completed: false, active: true, date: "Action Needed" },
        { stage: "review", label: "Nodal Officer Audit", completed: false, active: false, date: "Pending" },
        { stage: "approval", label: "IEPFA Sanction", completed: false, active: false, date: "Pending" },
        { stage: "recovered", label: "Demat Credit", completed: false, active: false, date: "Pending" },
      ]
    }
  ]);

  const [selectedClaim, setSelectedClaim] = useState<ClaimTrackingItem>(claims[0]);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sage-400/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-earth-500/20 text-earth-300 border border-earth-400/30">
              STATUTORY CLAIMS TIMELINE
            </span>
            <span className="text-xs font-mono text-emerald-400">ACTIVE DOSSIERS: {claims.length}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
            Real-Time Claim Lifecycle Tracker
          </h1>
          <p className="text-xs text-sage-300 font-light mt-0.5">
            Transparent milestone journey connecting discovery preparation to official institutional disbursement.
          </p>
        </div>

        <Link
          href="/discover"
          className="px-4 py-2.5 rounded-xl bg-earth-500/25 hover:bg-earth-500/35 text-earth-300 border border-earth-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(197,160,89,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover More Assets</span>
        </Link>
      </div>

      {/* Main Grid: Left Claim List & Right Detail Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Claim Dossier Selector */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-sand-100 uppercase tracking-wider">
            Your Active Claim Packets
          </h3>

          <div className="space-y-3">
            {claims.map((c) => {
              const isSelected = selectedClaim.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClaim(c)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-earth-500/15 border-earth-400 shadow-[0_0_20px_rgba(197,160,89,0.25)]"
                      : "glass-card border-sage-400/20 hover:border-sage-400/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-earth-300">#{c.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-forest-950 text-emerald-400 border border-emerald-500/30">
                      {c.category.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-sand-100 leading-tight">
                    {c.institution}
                  </h4>
                  <p className="text-xs text-earth-300 font-semibold mt-1">
                    {c.approxValue}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-sage-400/15 flex items-center justify-between text-[11px] text-sage-400">
                    <span>{c.currentStage}</span>
                    <span className="text-emerald-400">View Timeline ›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Animated Timeline */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6">
          {/* Claim Top Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-400/15">
            <div>
              <span className="text-[10px] font-mono text-sage-400 uppercase">OFFICIAL DOSSIER</span>
              <h3 className="text-xl font-serif font-bold text-sand-50">
                {selectedClaim.institution}
              </h3>
              <p className="text-xs text-sage-300 mt-0.5">
                Statutory Authority: {selectedClaim.officialSource}
              </p>
            </div>

            <a
              href={selectedClaim.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 border border-earth-400/30 text-xs text-earth-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span>Statutory Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Required Banner */}
          {selectedClaim.actionRequired && (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block">Next Statutory Step Required:</strong>
                <span className="text-xs leading-relaxed">{selectedClaim.actionRequired}</span>
              </div>
            </div>
          )}

          {/* Step-by-Step Milestones */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-sand-100 uppercase tracking-wider">
              Milestone Progression
            </h4>

            <div className="space-y-3">
              {selectedClaim.timeline.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    step.active
                      ? "bg-earth-500/15 border-earth-400 shadow-[0_0_16px_rgba(197,160,89,0.2)]"
                      : step.completed
                      ? "bg-forest-950/80 border-emerald-500/30 text-sand-100"
                      : "bg-forest-950/40 border-sage-400/10 text-sage-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-forest-900 border border-sage-400/20">
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : step.active ? (
                        <span className="w-4 h-4 rounded-full bg-earth-400 animate-pulse block" />
                      ) : (
                        <Clock className="w-4 h-4 text-sage-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-sand-100">{step.label}</p>
                      <p className="text-[10px] text-sage-400">{step.completed ? "Verified" : step.active ? "Currently executing" : "Pending prior steps"}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-sage-300">{step.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
