"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Fingerprint, 
  Globe2, 
  CheckCircle2, 
  Compass,
  Building2,
  FileText
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { language, login, setBgState } = useAppStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [step, setStep] = useState<"input" | "otp" | "authenticating">("input");
  const [identifier, setIdentifier] = useState("citizen@adhikaar.gov.in");
  const [fullName, setFullName] = useState("Lubna Fathima");
  const [otp, setOtp] = useState("123456");
  const [consentChecked, setConsentChecked] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg("Please enter a valid mobile number or email.");
      return;
    }
    setErrorMsg("");
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456" && otp.length !== 6) {
      setErrorMsg("Please enter the 6-digit code (Use demo code: 123456).");
      return;
    }

    setStep("authenticating");
    setBgState("searching"); // triggers 3D particle vortex convergence

    setTimeout(() => {
      login({
        id: 1,
        phone_or_email: identifier,
        full_name: fullName || "Lubna Fathima",
        preferred_language: language,
      });
      router.push("/discover");
    }, 1400);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left Column: Environmental Storytelling */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-earth-400/30 text-xs font-mono text-earth-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STATUTORY RECOVERY ECOSYSTEM</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-sand-50 tracking-tight leading-[1.1]">
          {t.enter_journey || "Enter your recovery journey."}
        </h1>

        <p className="text-base sm:text-lg text-sage-300 leading-relaxed font-light">
          {t.enter_desc || "ADHIKAAR unifies fragmented asset-discovery channels across banking, insurance, IEPF dividends, and provident funds into one citizen-guided experience."}
        </p>

        {/* Core Principles Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
          <div className="p-3.5 rounded-xl glass-panel-subtle flex items-start gap-3">
            <div className="p-2 rounded-lg bg-earth-500/15 border border-earth-400/30 text-earth-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-sand-100">Statistical Match</h4>
              <p className="text-[11px] text-sage-400 mt-0.5">Surfaces potential records with transparent evidence scoring.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl glass-panel-subtle flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-sand-100">Statutory Authority</h4>
              <p className="text-[11px] text-sage-400 mt-0.5">Official authorities verify ownership and process disbursement.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Secure Entry Interface */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[460px]"
      >
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow inside Card */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-earth-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-forest-950 border border-sage-400/20">
                <Fingerprint className="w-5 h-5 text-earth-300" />
              </div>
              <div>
                <h2 className="text-base font-bold text-sand-100">Secure Access Gate</h2>
                <p className="text-[11px] text-sage-400">Zero password · Encrypted session</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              256-BIT TLS
            </span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "input" && (
              <motion.form
                key="step-input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    Your Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Lubna Fathima"
                    className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl px-4 py-3 text-sm text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60 focus:ring-1 focus:ring-earth-400/30"
                  />
                  <p className="text-[10px] text-sage-400/80 mt-1">
                    AI entity resolution automatically checks historical spelling & initial variations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or email"
                    className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl px-4 py-3 text-sm text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60 focus:ring-1 focus:ring-earth-400/30"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded accent-[#c5a059] cursor-pointer"
                  />
                  <label htmlFor="consentCheck" className="text-[11px] text-sage-300/90 leading-snug cursor-pointer">
                    {t.consent_notice || "I authorize ADHIKAAR to query permitted statutory registries (RBI, IEPFA, EPFO, IRDAI). Official verification is conducted by respective authorities."}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!consentChecked}
                  className="w-full mt-4 py-3.5 rounded-xl bg-earth-500/30 hover:bg-earth-500/45 text-earth-200 border border-earth-400/50 font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>{t.send_otp || "Send Secure Code"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="p-3 rounded-xl bg-forest-950/80 border border-sage-400/20 text-xs text-sage-300 flex items-center justify-between">
                  <span>Code sent to <strong className="text-sand-100">{identifier}</strong></span>
                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    className="text-earth-300 text-[11px] underline hover:text-sand-100"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    {t.otp_label || "Enter 6-digit verification code"}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-forest-950/90 border border-earth-400/40 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-sand-100 focus:outline-none focus:border-earth-400 focus:ring-1 focus:ring-earth-400/40"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-sage-400">
                    <span>Default simulation code: <strong className="text-earth-300">123456</strong></span>
                    <button type="button" className="text-sage-400 hover:text-sand-100">Resend Code</button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 rounded-xl bg-earth-500/35 hover:bg-earth-500/50 text-earth-200 border border-earth-400/60 font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(197,160,89,0.3)] transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t.verify_enter || "Verify & Enter Ecosystem"}</span>
                </button>
              </motion.form>
            )}

            {step === "authenticating" && (
              <motion.div
                key="step-auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-earth-500/20 border-2 border-earth-400 flex items-center justify-center animate-spin">
                    <Sparkles className="w-8 h-8 text-earth-300" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-earth-400/60 animate-ping" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-sand-100">Converging Identity Ecosystem...</h3>
                  <p className="text-xs text-sage-400 mt-1 font-mono">Synchronizing statutory gateway tokens</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
