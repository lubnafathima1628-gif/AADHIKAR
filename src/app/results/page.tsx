"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { apiClient } from "@/lib/api/client";
import { PotentialAssetMatch, GraphNode, GraphLink } from "@/types";
import RelationshipGraph3D from "@/components/3d/RelationshipGraph3D";
import OrganicCategoryIcon from "@/components/ui/OrganicCategoryIcon";
import { 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  ArrowRight, 
  Filter, 
  SlidersHorizontal,
  FileText,
  AlertCircle,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Info
} from "lucide-react";
import Link from "next/link";

export default function UnifiedResultsDashboardPage() {
  const router = useRouter();
  const { searchResults, lastSearchName, setSelectedMatchId, setSelectedClaimId, setBgState } = useAppStore();

  const [matches, setMatches] = useState<PotentialAssetMatch[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeExplainMatch, setActiveExplainMatch] = useState<PotentialAssetMatch | null>(null);

  useEffect(() => {
    setBgState("results");

    if (searchResults && searchResults.length > 0) {
      setMatches(searchResults);
    } else {
      // Fetch default search matches
      apiClient.search({ name: lastSearchName || "Lubna Fathima" }).then((res) => {
        setMatches(res.matches);
      });
    }

    // Load graph nodes
    apiClient.getRelationshipGraph().then((data) => {
      setGraphData(data);
    });
  }, [searchResults, lastSearchName, setBgState]);

  const filteredMatches = matches.filter((m) => {
    if (selectedFilter === "all") return true;
    return m.category === selectedFilter;
  });

  const handleStartRecovery = async (matchId: number) => {
    setSelectedMatchId(matchId);
    try {
      const claim = await apiClient.createClaim(matchId);
      setSelectedClaimId(claim.claim_id);
      router.push(`/recovery/${matchId}`);
    } catch (e) {
      router.push(`/recovery/${matchId}`);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sage-400/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-earth-500/20 text-earth-300 border border-earth-400/30">
              UNIFIED DISCOVERY DASHBOARD
            </span>
            <span className="text-xs text-sage-400 font-mono">
              Anchor: <strong className="text-sand-100">{lastSearchName || "Lubna Fathima"}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
            {matches.length} Potential Statutory Matches Identified
          </h1>
          <p className="text-xs text-sage-300 font-light mt-0.5">
            Statistical candidate records retrieved across RBI UDGAM, IEPFA, EPFO, and IRDAI registers.
          </p>
        </div>

        {/* Action / Guide Button */}
        <Link
          href="/recovery/1"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth-500/25 hover:bg-earth-500/35 text-earth-300 border border-earth-400/40 text-xs font-semibold transition-all shadow-[0_0_16px_rgba(197,160,89,0.2)]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Guided Recovery Pack</span>
        </Link>
      </div>

      {/* Mandatory Statutory Disclaimer Alert */}
      <div className="p-3.5 rounded-xl bg-forest-900/90 border border-sage-400/20 flex items-start gap-3 text-xs text-sage-300">
        <Info className="w-4 h-4 text-earth-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-sand-100 font-semibold">Important Statutory Boundary: </strong>
          All records surfaced by ADHIKAAR are statistical <em>Potential Matches</em> based on multi-attribute normalization. Official legal ownership, validation, and disbursement are strictly governed by the respective banks, EPFO, IEPFA, and insurers.
        </div>
      </div>

      {/* Living Asset Relationship Network Canvas */}
      <div className="w-full">
        <RelationshipGraph3D
          nodes={graphData.nodes}
          links={graphData.links}
          onSelectNode={(node) => {
            if (node.match_id) {
              const matched = matches.find((m) => m.id === node.match_id);
              if (matched) setActiveExplainMatch(matched);
            }
          }}
        />
      </div>

      {/* Filters & Universal Match Cards Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sage-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-sage-300">
            Filter by Category:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["all", "bank", "investments", "insurance", "pf", "property"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedFilter === cat
                  ? "bg-earth-500/25 text-earth-300 border border-earth-400/40 font-semibold shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                  : "bg-forest-900/80 text-sage-400 border border-sage-400/20 hover:text-sand-100"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Universal Potential Asset Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMatches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-sage-400/20 flex flex-col justify-between space-y-5 hover:border-earth-400/40 transition-all shadow-xl relative overflow-hidden"
          >
            {/* Top Row: Category, Confidence Badge & Source Health */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-forest-950/90 border border-sage-400/20 text-earth-300">
                  <OrganicCategoryIcon category={match.category} size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-sage-400 tracking-wider">
                    {match.category.toUpperCase()} RECORD
                  </span>
                  <h3 className="text-base font-bold text-sand-50 leading-tight">
                    {match.institution}
                  </h3>
                </div>
              </div>

              {/* Potential Match Badge with Percentage */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  POTENTIAL MATCH {Math.round(match.overall_confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Record Attribute Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-forest-950/70 border border-sage-400/15 text-xs">
              <div>
                <span className="text-[10px] text-sage-400 block uppercase">Name on Record</span>
                <span className="font-semibold text-sand-100">{match.holder_name_on_record}</span>
              </div>
              <div>
                <span className="text-[10px] text-sage-400 block uppercase">Estimated Value / Type</span>
                <span className="font-semibold text-earth-300">{match.approximate_value_range}</span>
              </div>
              <div>
                <span className="text-[10px] text-sage-400 block uppercase">Masked Identifier</span>
                <span className="font-mono text-sage-300">{match.identifier_masked}</span>
              </div>
              <div>
                <span className="text-[10px] text-sage-400 block uppercase">Statutory Source</span>
                <span className="text-sage-300">{match.source_name}</span>
              </div>
            </div>

            {/* Why It Matched Summary */}
            <div className="p-3 rounded-xl bg-forest-900/60 border border-sage-400/10 text-xs text-sage-300">
              <strong className="text-earth-300">Why Matched: </strong>
              <span>{match.match_reason}</span>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-sage-400/15 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveExplainMatch(match)}
                className="text-xs text-sage-300 hover:text-earth-300 underline font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-earth-400" />
                <span>Why this match? (Evidence)</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/assets/${match.id}`}
                  className="px-3 py-1.5 rounded-lg border border-sage-400/25 bg-forest-950/80 hover:bg-forest-900 text-xs text-sand-100 font-medium transition-colors"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleStartRecovery(match.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-earth-500/30 hover:bg-earth-500/45 text-earth-200 border border-earth-400/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                >
                  <span>Start Recovery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* "Why This Match?" Explainable Evidence Modal */}
      <AnimatePresence>
        {activeExplainMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl glass-panel rounded-2xl p-6 border border-sage-400/30 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    STATISTICAL ENTITY RESOLUTION BREAKDOWN
                  </span>
                  <h3 className="text-xl font-serif font-bold text-sand-50 mt-1">
                    Evidence for {activeExplainMatch.institution}
                  </h3>
                  <p className="text-xs text-sage-300">
                    Evaluating claimant profile against historical ledger record.
                  </p>
                </div>
                <button
                  onClick={() => setActiveExplainMatch(null)}
                  className="p-1.5 text-sage-400 hover:text-sand-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Evidence Factor Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-sand-100">1. Name & Transliteration Alignment</span>
                    <span className="text-emerald-400 font-mono">96%</span>
                  </div>
                  <p className="text-sage-300 text-[11px]">
                    Normalized target 'Lubna Fathima' aligns with historical ledger 'Lubna Fatima' via regional vowel transliteration rules.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-sand-100">2. Jurisdictional & Address Match</span>
                    <span className="text-emerald-400 font-mono">92%</span>
                  </div>
                  <p className="text-sage-300 text-[11px]">
                    Account opened in Bangalore Urban region, aligning with citizen demographic timeline.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-sand-100">3. Statutory Authority Freshness</span>
                    <span className="text-emerald-400 font-mono">99%</span>
                  </div>
                  <p className="text-sage-300 text-[11px]">
                    Verified against active authorized connector {activeExplainMatch.source_name}.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-sage-400/15 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveExplainMatch(null)}
                  className="px-4 py-2 rounded-xl border border-sage-400/25 text-xs text-sage-300 hover:text-sand-100"
                >
                  Close
                </button>
                <Link
                  href={`/assets/${activeExplainMatch.id}`}
                  className="px-4 py-2 rounded-xl bg-earth-500/30 text-earth-200 border border-earth-400/40 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Open Full Evidence View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
