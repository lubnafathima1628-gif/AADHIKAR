"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { AssetDetailData } from "@/types";
import OrganicCategoryIcon from "@/components/ui/OrganicCategoryIcon";
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  History,
  CheckCircle2,
  Calendar,
  Lock,
  Layers,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id) || 1;

  const [asset, setAsset] = useState<AssetDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getAssetDetail(matchId).then((data) => {
      setAsset(data);
      setLoading(false);
    });
  }, [matchId]);

  if (loading || !asset) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-xs text-sage-400">
        <Sparkles className="w-5 h-5 text-earth-300 animate-spin mr-2" />
        <span>Loading statutory evidence record...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Top Nav Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-xs font-medium text-sage-400 hover:text-earth-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Potential Matches</span>
        </Link>

        <span className="text-[11px] font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          STATUTORY RECORD ID: ADH-{asset.id}9021
        </span>
      </div>

      {/* Main Grid: Left Environmental Card & Right Comprehensive Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Asset Identity Anchor */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass-card rounded-2xl p-6 border border-sage-400/25 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-forest-950/90 border border-earth-400/40 text-earth-300 shadow-[0_0_16px_rgba(197,160,89,0.2)]">
                <OrganicCategoryIcon category={asset.category} size={36} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-sage-400 tracking-wider">
                  {asset.category.toUpperCase()} REGISTER
                </span>
                <h2 className="text-lg font-bold text-sand-50 leading-tight">
                  {asset.institution}
                </h2>
              </div>
            </div>

            {/* Match Confidence Gauge */}
            <div className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 text-center space-y-2">
              <span className="text-[10px] font-mono uppercase text-sage-400 tracking-widest">
                STATISTICAL MATCH SCORE
              </span>
              <div className="text-4xl font-serif font-bold text-earth-300">
                {Math.round(asset.overall_confidence * 100)}%
              </div>
              <div className="w-full bg-forest-900 rounded-full h-2 overflow-hidden border border-sage-400/20">
                <div
                  className="bg-gradient-to-r from-moss-500 to-earth-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round(asset.overall_confidence * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block">
                POTENTIAL STATUTORY MATCH
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-sage-400/10">
                <span className="text-sage-400">Estimated Value</span>
                <span className="font-semibold text-earth-300">{asset.approximate_value_range}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-sage-400/10">
                <span className="text-sage-400">Name on Ledger</span>
                <span className="font-semibold text-sand-100">{asset.holder_name_on_record}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-sage-400/10">
                <span className="text-sage-400">Masked Reference</span>
                <span className="font-mono text-sand-200">{asset.identifier_masked}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-sage-400/10">
                <span className="text-sage-400">Authority</span>
                <span className="text-sand-200 text-right truncate max-w-[140px]">{asset.source_authority}</span>
              </div>
            </div>

            {/* Start Recovery CTA */}
            <Link
              href={`/recovery/${asset.id}`}
              className="w-full py-3 rounded-xl bg-earth-500/35 hover:bg-earth-500/50 text-earth-200 border border-earth-400/60 font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all"
            >
              <span>Begin Claim Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Historical Identity Timeline Widget */}
          <div className="glass-panel rounded-2xl p-5 border border-sage-400/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sand-100 uppercase tracking-wider">
              <History className="w-4 h-4 text-earth-400" />
              <span>Identity Evolution Timeline</span>
            </div>

            <div className="relative pl-4 space-y-3.5 border-l border-sage-400/20 text-xs">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sage-500" />
                <span className="text-[10px] font-mono text-sage-400">2010 · Historical Record</span>
                <p className="font-semibold text-sand-100">Lubna Fatima</p>
                <p className="text-[11px] text-sage-400">Old address & contact on initial ledger.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-earth-400" />
                <span className="text-[10px] font-mono text-earth-300">2017 · Variant Observed</span>
                <p className="font-semibold text-sand-100">Lubna Fathimah / L. Fathima</p>
                <p className="text-[11px] text-sage-400">Regional transliteration in secondary registry.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400">2026 · Current Profile</span>
                <p className="font-semibold text-sand-100">Lubna Fathima</p>
                <p className="text-[11px] text-sage-400">Validated modern identity anchor.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Factor Evidence & Document Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Evidence Cards */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-mono uppercase text-earth-300 tracking-wider">
                TRANSPARENT AI EXPLAINABILITY
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-sand-50 mt-1">
                Why this record is a Potential Match
              </h2>
              <p className="text-xs text-sage-300 mt-1">
                Every potential match generates an auditable breakdown of statistical and phonetic factors.
              </p>
            </div>

            {/* Evidence Factor Grid */}
            <div className="space-y-3.5">
              {asset.evidence_breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-sand-100">{item.factor}</h4>
                    </div>
                    <p className="text-xs text-sage-300 leading-relaxed font-light pl-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {Math.round(item.score * 100)}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Required Statutory Documents Section */}
            <div className="pt-4 border-t border-sage-400/15 space-y-3">
              <h3 className="text-sm font-bold text-sand-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-earth-400" />
                <span>Mandatory Statutory Claim Documents</span>
              </h3>
              <p className="text-xs text-sage-400">
                To claim from {asset.institution}, the following self-attested documents must be submitted to the official nodal authority:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {asset.required_documents.map((doc, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-3 rounded-xl bg-forest-900/80 border border-sage-400/20 text-xs text-sage-200 flex items-center gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-400" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Authority Gateway Handoff */}
            <div className="p-4 rounded-xl bg-forest-950/90 border border-earth-400/30 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-sage-400 uppercase">Official Gateway</span>
                <h4 className="text-xs font-bold text-sand-100">{asset.source_authority}</h4>
                <p className="text-[11px] text-sage-400">
                  Direct submission link: {asset.official_portal_url}
                </p>
              </div>

              <a
                href={asset.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-xs text-earth-300 border border-earth-400/30 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
