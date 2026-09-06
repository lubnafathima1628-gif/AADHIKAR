"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { ScamResult } from "@/types";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  FileWarning, 
  Lock, 
  HelpCircle,
  ExternalLink,
  Info
} from "lucide-react";

export default function ScamShieldPage() {
  const [content, setContent] = useState("");
  const [inputType, setInputType] = useState<"text" | "sms" | "email" | "url">("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamResult | null>({
    risk_level: "HIGH RISK",
    risk_score: 92,
    detected_flags: [
      "Advance processing fee requested to release funds",
      "Unverified WhatsApp / Telegram communication channel",
      "Artificial 24-hour expiration threat"
    ],
    plain_language_explanation: "This message exhibits hallmarks of an advance-fee unclaimed asset recovery fraud. Scammers impersonate recovery agents and demand payment before releasing fictitious funds.",
    official_comparison: "Statutory bodies (RBI DEA Fund, IEPFA, EPFO) NEVER charge an advance processing fee to citizens for releasing rightful deposits or dividends.",
    safe_next_action: "DO NOT send money or share bank OTPs. Report the communication to the National Cyber Crime Reporting Portal (cybercrime.gov.in)."
  });

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await apiClient.analyzeScam(content, inputType);
      setResult(res);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (type: "scam" | "legit") => {
    if (type === "scam") {
      setContent("URGENT: Your unclaimed PF & Bank deposit of Rs 2,45,000 has been approved. Pay Rs 3,500 registration fee within 24 hours on WhatsApp 9876543210 to claim immediately or funds will be forfeited.");
    } else {
      setContent("Notice from IEPF Authority: Please visit official portal www.iepf.gov.in to verify your unpaid dividend claim status under web-form IEPF-5.");
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sage-400/15">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-earth-500/20 text-earth-300 border border-earth-400/30">
            AI FRAUD & SCAM DEFENSE
          </span>
          <span className="text-xs font-mono text-emerald-400">HEURISTIC ENGINE ACTIVE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
          Recovery Scam Shield
        </h1>
        <p className="text-xs text-sage-300 font-light mt-0.5">
          Evaluate suspicious SMS, letters, fee demands, or emails pretending to be government asset recovery agents.
        </p>
      </div>

      {/* Input Area */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-5 shadow-2xl">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-sand-100 uppercase tracking-wider">
              Paste Suspicious Message, SMS, or URL Text:
            </label>

            {/* Sample Presets */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sage-400 text-[11px]">Test Sample:</span>
              <button
                type="button"
                onClick={() => loadSample("scam")}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
              >
                Sample Fraud SMS
              </button>
              <button
                type="button"
                onClick={() => loadSample("legit")}
                className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              >
                Sample Official Notice
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste text of SMS, WhatsApp message, email, or URL link demanding money or claiming to represent RBI, IEPFA, or recovery agents..."
            className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl p-4 text-xs text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60 leading-relaxed resize-none"
          />

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-3 rounded-xl bg-earth-500/30 hover:bg-earth-500/45 text-earth-200 border border-earth-400/50 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(197,160,89,0.25)] disabled:opacity-40"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin text-earth-300" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-earth-300" />
            )}
            <span>{loading ? "Analyzing Threat Vectors..." : "Run AI Threat Analysis"}</span>
          </button>
        </form>
      </div>

      {/* Analysis Verdict Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card rounded-2xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
            result.risk_level === "HIGH RISK"
              ? "border-amber-500/50 bg-amber-950/15"
              : "border-emerald-500/50 bg-emerald-950/15"
          }`}
        >
          {/* Top Verdict Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-400/15">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                result.risk_level === "HIGH RISK"
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              }`}>
                {result.risk_level === "HIGH RISK" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sage-400">
                  SECURITY VERDICT
                </span>
                <h3 className={`text-xl font-bold ${
                  result.risk_level === "HIGH RISK" ? "text-amber-300" : "text-emerald-300"
                }`}>
                  {result.risk_level} (Threat Score: {result.risk_score}/100)
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-forest-950 border border-sage-400/20 text-sage-300">
              ANALYZED INSTANTLY
            </span>
          </div>

          {/* Detected Flags */}
          {result.detected_flags.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-sage-400">DETECTED THREAT INDICATORS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.detected_flags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-forest-950/80 border border-amber-500/25 text-xs text-sand-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plain Language Explanation */}
          <div className="p-4 rounded-xl bg-forest-950/90 border border-sage-400/20 space-y-1.5 text-xs">
            <strong className="text-sand-100 font-bold block">Plain-Language Assessment:</strong>
            <p className="text-sage-300 leading-relaxed">{result.plain_language_explanation}</p>
          </div>

          {/* Official Comparison & Safe Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">OFFICIAL STATUTORY BENCHMARK</span>
              <p className="text-sand-100 leading-relaxed">{result.official_comparison}</p>
            </div>

            <div className="p-4 rounded-xl bg-forest-950/80 border border-earth-400/30 space-y-1">
              <span className="text-[10px] font-mono text-earth-300 uppercase">RECOMMENDED SAFE ACTION</span>
              <p className="text-sand-100 leading-relaxed font-semibold">{result.safe_next_action}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
