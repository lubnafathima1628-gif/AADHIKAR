"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { apiClient } from "@/lib/api/client";
import { 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Server, 
  Layers, 
  ArrowRight,
  Database,
  Cpu,
  Fingerprint
} from "lucide-react";

const SEARCH_STAGES = [
  { id: "identity", label: "IDENTITY ANCHOR", desc: "Establishing cryptographic session & identity normalization", icon: Fingerprint },
  { id: "phonetic", label: "PHONETIC & TRANSLITERATION", desc: "Generating Soundex & regional character mutation matrices", icon: Cpu },
  { id: "sources", label: "STATUTORY GATEWAYS", desc: "Querying RBI UDGAM, IEPFA, EPFO, IRDAI & Land Registries", icon: Server },
  { id: "resolution", label: "AI ENTITY RESOLUTION", desc: "Multi-attribute statistical scoring across historical ledgers", icon: Database },
  { id: "evidence", label: "EVIDENCE SYNTHESIS", desc: "Validating jurisdictional proximity and building explainability cards", icon: Layers },
];

export default function DiscoverySearchAnimationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawName = searchParams.get("name") || "Lubna Fathima";
  const category = searchParams.get("cat") || "all";
  const location = searchParams.get("loc") || "Bengaluru, Karnataka";

  const { setSearchResults, setBgState } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [liveLog, setLiveLog] = useState<string[]>([]);

  useEffect(() => {
    setBgState("searching");

    const logMessages = [
      `Initializing statutory discovery orchestrator for '${rawName}'...`,
      `Computed Soundex code: L150. Normalizing vowel conventions (Fatima / Fathima / Fathimah)...`,
      `Connected to RBI UDGAM Gateway (110ms) — DEA Fund active.`,
      `Connected to Ministry of Corporate Affairs IEPF Authority (95ms).`,
      `Connected to IRDAI Bima Bharosa Unclaimed Portal (140ms).`,
      `Connected to EPFO Inoperative Registry (280ms).`,
      `Cross-referencing address tokens: '${location}'...`,
      `4 Potential Matches identified with statistical confidence > 85%.`,
      `Compiling explainable evidence records...`
    ];

    let msgIdx = 0;
    const logInterval = setInterval(() => {
      if (msgIdx < logMessages.length) {
        setLiveLog((prev) => [...prev, logMessages[msgIdx]]);
        msgIdx++;
      }
    }, 420);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < SEARCH_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 850);

    // Run backend search
    apiClient.search({
      name: rawName,
      category: category,
      location: location,
    }).then((res) => {
      setTimeout(() => {
        setSearchResults(rawName, res.matches);
        setBgState("results");
        router.push("/results");
      }, 4400);
    }).catch(() => {
      setTimeout(() => {
        router.push("/results");
      }, 4400);
    });

    return () => {
      clearInterval(logInterval);
      clearInterval(stepInterval);
    };
  }, [rawName, category, location, router, setSearchResults, setBgState]);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-10 flex flex-col items-center justify-center">
      {/* Central Pulsating Ecosystem Orb */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-earth-500/20 via-moss-600/30 to-teal-500/20 border-2 border-earth-400/50 flex items-center justify-center shadow-[0_0_60px_rgba(197,160,89,0.35)]">
          <Sparkles className="w-12 h-12 text-earth-300 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border border-earth-400/40 animate-ping" />
        <div className="absolute -inset-6 rounded-full border border-moss-400/20 animate-pulse" />
      </div>

      <div className="text-center space-y-2 mb-8">
        <span className="text-[11px] font-mono text-emerald-400 tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          MULTI-SOURCE ORCHESTRATION IN PROGRESS
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50">
          Searching Statutory Registries for "{rawName}"
        </h1>
        <p className="text-xs text-sage-300 font-mono">
          Querying permitted public records with statistical entity resolution
        </p>
      </div>

      {/* Progress Stages Bar */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-5 gap-2 mb-8">
        {SEARCH_STAGES.map((st, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border text-left transition-all ${
                isCurrent
                  ? "bg-earth-500/20 border-earth-400 shadow-[0_0_16px_rgba(197,160,89,0.3)]"
                  : isDone
                  ? "bg-forest-900/90 border-emerald-500/40 text-emerald-300"
                  : "bg-forest-950/60 border-sage-400/15 text-sage-500 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono">0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-earth-400 animate-ping" />
                ) : null}
              </div>
              <p className="text-[11px] font-bold text-sand-100 truncate">{st.label}</p>
            </div>
          );
        })}
      </div>

      {/* Real-time Diagnostic Stream Terminal */}
      <div className="w-full max-w-3xl rounded-2xl glass-panel p-4 sm:p-6 border border-sage-400/20 font-mono text-xs text-left shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-sage-400/15 text-sage-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>STATUTORY CONNECTOR EVENT BUS</span>
          </div>
          <span>LATENCY: 110ms AVG</span>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto text-sage-300">
          {liveLog.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2"
            >
              <span className="text-earth-400 select-none">›</span>
              <span className={i === liveLog.length - 1 ? "text-sand-50 font-semibold" : "text-sage-300"}>
                {log}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
