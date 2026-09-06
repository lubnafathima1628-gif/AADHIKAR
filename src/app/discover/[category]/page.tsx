"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";
import OrganicCategoryIcon from "@/components/ui/OrganicCategoryIcon";
import { AssetCategory } from "@/types";
import { 
  ArrowLeft, 
  ArrowRight, 
  Mic, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  Calendar,
  MapPin,
  FileSearch,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function CategoryDiscoveryFormPage() {
  const params = useParams();
  const router = useRouter();
  const rawCat = (params.category as string) || "all";
  const category = (rawCat as AssetCategory);

  const { language, toggleVoiceModal, setBgState } = useAppStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Form State
  const [fullName, setFullName] = useState("Lubna Fathima");
  const [location, setLocation] = useState("Bengaluru, Karnataka");
  const [institution, setInstitution] = useState(
    category === "bank" ? "State Bank of India (SBI)" :
    category === "investments" ? "Tata Consultancy Services Ltd" :
    category === "insurance" ? "Life Insurance Corporation of India (LIC)" :
    category === "pf" ? "Employees' Provident Fund Organisation" : ""
  );
  const [approxYear, setApproxYear] = useState("2014");
  const [referenceHint, setReferenceHint] = useState("");
  const [freeformNotes, setFreeformNotes] = useState("");

  // "I Don't Remember" Conversational Discovery Mode
  const [isConversationalMode, setIsConversationalMode] = useState(false);
  const [convoStep, setConvoStep] = useState(1);
  const [convoAnswers, setConvoAnswers] = useState<Record<string, string>>({});

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "bank": return "Bank & Dormant Deposits";
      case "insurance": return "Insurance & Maturity Claims";
      case "investments": return "Investments, Shares & IEPF";
      case "pf": return "EPF & Provident Fund Settlement";
      case "property": return "Property, Land & Revenue Registry";
      case "benefits": return "Government Welfare & DBT Benefits";
      default: return "Unified Multi-Category Asset Discovery";
    }
  };

  const handleStartSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBgState("searching");
    router.push(`/search?name=${encodeURIComponent(fullName)}&cat=${category}&loc=${encodeURIComponent(location)}`);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col justify-between">
      {/* Top Nav Back */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-xs font-medium text-sage-400 hover:text-earth-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>

        {/* Toggle Mode Button */}
        <button
          onClick={() => setIsConversationalMode(!isConversationalMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isConversationalMode
              ? "bg-earth-500/25 text-earth-300 border border-earth-400/50 shadow-[0_0_16px_rgba(197,160,89,0.3)]"
              : "bg-forest-900/80 text-sage-300 border border-sage-400/20 hover:text-sand-100"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isConversationalMode ? "Switch to Form Mode" : "I Don't Remember Specifics (Guided AI)"}</span>
        </button>
      </div>

      {/* Main Glass Card Form */}
      <div className="glass-card rounded-2xl p-6 sm:p-10 border border-sage-400/25 relative overflow-hidden shadow-2xl">
        {/* Header with Category Icon */}
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3.5 rounded-xl bg-forest-950/90 border border-earth-400/40 text-earth-300 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
            <OrganicCategoryIcon category={category} size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Statutory Discovery Filter
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sand-50 mt-1">
              {getCategoryTitle(category)}
            </h1>
            <p className="text-xs text-sage-300 mt-1">
              {t.what_remember || "What do you remember?"} Only public permitted search attributes will be queried.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isConversationalMode ? (
            /* Standard Structured Discovery Form */
            <motion.form
              key="standard-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleStartSearch}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Legal Name */}
                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    Claimant / Holder Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Lubna Fathima"
                    required
                    className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl px-4 py-2.5 text-sm text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60"
                  />
                  <span className="text-[10px] text-sage-400 mt-1 block">
                    Phonetic & transliteration engines will test regional spelling variants.
                  </span>
                </div>

                {/* Target Institution / Entity */}
                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    Institution / Company / Bank (If Known)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. State Bank of India, TCS, LIC"
                      className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl px-4 py-2.5 text-sm text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60"
                    />
                    <Building2 className="absolute right-3.5 top-3 w-4 h-4 text-sage-400 pointer-events-none" />
                  </div>
                </div>

                {/* Old Address or City */}
                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    Historical City / District / State
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Indiranagar, Bengaluru, Karnataka"
                      className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl px-4 py-2.5 text-sm text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60"
                    />
                    <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-sage-400 pointer-events-none" />
                  </div>
                </div>

                {/* Approximate Era / Year */}
                <div>
                  <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                    Approximate Last Active Year (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={approxYear}
                      onChange={(e) => setApproxYear(e.target.value)}
                      placeholder="e.g. 2012 – 2018"
                      className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl px-4 py-2.5 text-sm text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60"
                    />
                    <Calendar className="absolute right-3.5 top-3 w-4 h-4 text-sage-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Natural Language Memory Notes */}
              <div>
                <label className="block text-xs font-semibold text-sage-300 mb-1.5">
                  Any Other Memory Notes or Partial Information
                </label>
                <textarea
                  rows={2}
                  value={freeformNotes}
                  onChange={(e) => setFreeformNotes(e.target.value)}
                  placeholder="e.g. Opened during my first job near MG Road, closed account in 2014, father might have been nominee..."
                  className="w-full bg-forest-950/90 border border-sage-400/25 rounded-xl p-3 text-xs text-sand-100 placeholder-sage-500 focus:outline-none focus:border-earth-400/60 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleVoiceModal()}
                  className="px-4 py-3 rounded-xl border border-sage-400/30 bg-forest-950/80 hover:bg-forest-900 text-xs font-medium text-sage-300 hover:text-earth-300 flex items-center gap-2 transition-colors"
                >
                  <Mic className="w-4 h-4 text-earth-400" />
                  <span>Use Voice Input</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-earth-500/35 hover:bg-earth-500/50 text-earth-200 border border-earth-400/60 font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(197,160,89,0.3)] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.start_discovery || "Initiate Multi-Source Discovery"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          ) : (
            /* "I Don't Remember" Conversational Guided Flow */
            <motion.div
              key="conversational-flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-earth-500/10 border border-earth-400/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-earth-300 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-sage-200 leading-relaxed">
                  <p className="font-semibold text-sand-100">Guided Recovery Assistant Mode</p>
                  <p className="mt-0.5 text-sage-400">
                    Relax. We will build a discovery strategy from small fragments of memories rather than demanding official account numbers.
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              {convoStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-sand-100">
                    1. What type of event do you vaguely recall?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Salary bank account left during job transition",
                      "Fixed deposit opened by parents or self years ago",
                      "Physical paper share certificates or dividend warrants",
                      "Life insurance policy where premium payments stopped",
                      "Provident fund balance from an old company",
                      "Ancestral family property or land dispute record"
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setConvoAnswers({ ...convoAnswers, eventType: opt });
                          setConvoStep(2);
                        }}
                        className="p-3 text-left text-xs rounded-xl bg-forest-950/80 hover:bg-forest-800 border border-sage-400/20 text-sand-100 transition-all hover:border-earth-400/50"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {convoStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-sand-100">
                    2. Which city or state were you residing in around that time?
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {["Bengaluru", "Mumbai", "Delhi / NCR", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Other State"].map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setLocation(`${c}, India`);
                          setConvoAnswers({ ...convoAnswers, city: c });
                          setConvoStep(3);
                        }}
                        className="p-3 text-center text-xs rounded-xl bg-forest-950/80 hover:bg-forest-800 border border-sage-400/20 text-sand-100 transition-all hover:border-earth-400/50"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {convoStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-sand-100">
                    3. Do you have any former spelling or maiden name on historical records?
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lubna Fatima / L. Fathima"
                      className="w-full bg-forest-950/90 border border-earth-400/40 rounded-xl px-4 py-3 text-sm text-sand-100 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleStartSearch}
                    className="w-full py-3.5 rounded-xl bg-earth-500/35 hover:bg-earth-500/50 text-earth-200 border border-earth-400/60 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(197,160,89,0.3)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Search With These Guided Hints</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
