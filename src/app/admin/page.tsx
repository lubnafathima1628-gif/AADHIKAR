"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { 
  BarChart3, 
  Activity, 
  Server, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building2,
  PieChart
} from "lucide-react";

export default function AdminFrictionIntelligencePage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [sourceHealth, setSourceHealth] = useState<any[]>([]);
  const [friction, setFriction] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      apiClient.getAdminDashboard(),
      apiClient.getSourceHealth(),
      apiClient.getFrictionAnalytics()
    ]).then(([d, s, f]) => {
      setDashboard(d);
      setSourceHealth(s);
      setFriction(f);
    });
  }, []);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sage-400/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NATIONAL AUTHORITY INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-sage-400">AGGREGATE ANONYMIZED TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
            Recovery Friction & Connector Health
          </h1>
          <p className="text-xs text-sage-300 font-light mt-0.5">
            Macro-level recovery telemetry identifying institutional process bottlenecks and connector latency.
          </p>
        </div>
      </div>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-sage-400/25 space-y-1">
          <span className="text-[10px] font-mono uppercase text-sage-400">POTENTIAL ASSETS DISCOVERED</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-earth-300">
            {dashboard?.potential_assets_discovered?.toLocaleString() || "142,894"}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Across 6 Statutory Registries</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-400/25 space-y-1">
          <span className="text-[10px] font-mono uppercase text-sage-400">ESTIMATED RECOVERY VALUE</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-sand-50">
            {dashboard?.estimated_unclaimed_value_cr || "₹38,400 Cr"}
          </div>
          <span className="text-[10px] text-sage-400 font-mono">Total Tracked Unclaimed Dues</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-400/25 space-y-1">
          <span className="text-[10px] font-mono uppercase text-sage-400">CLAIMS FACILITATED</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
            {dashboard?.claims_facilitated?.toLocaleString() || "12,454"}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Resolution Rate: {dashboard?.successful_resolution_rate || "84.6%"}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-400/25 space-y-1">
          <span className="text-[10px] font-mono uppercase text-sage-400">AVG RESOLUTION TIME</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-sand-100">
            {dashboard?.avg_resolution_days || 18} Days
          </div>
          <span className="text-[10px] text-sage-400 font-mono">Down from 90 days statutory</span>
        </div>
      </div>

      {/* Statutory Connector Health & Latency */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-sand-100 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-earth-400" />
            <span>Statutory Source Connectors Freshness & Latency</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">HEALTH PROTOCOL: ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sourceHealth.map((src) => (
            <div
              key={src.code}
              className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-earth-300 font-bold">{src.code}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  src.health_status === "healthy"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                }`}>
                  {src.health_status.toUpperCase()}
                </span>
              </div>

              <h4 className="text-xs font-bold text-sand-100">{src.name}</h4>
              <p className="text-[10px] text-sage-400 truncate">{src.authority}</p>

              <div className="pt-2 border-t border-sage-400/10 flex items-center justify-between text-[11px] font-mono text-sage-300">
                <span>Latency: {src.latency_ms}ms</span>
                <span className="text-emerald-400">{src.uptime_pct}% Uptime</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Friction AI Insights & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Funnel Dropoff */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-5">
          <h3 className="text-sm font-bold text-sand-100 uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <span>Citizen Journey Funnel Drop-off Analysis</span>
          </h3>

          <div className="space-y-3">
            {friction?.funnel?.map((item: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-forest-950/70 border border-sage-400/15 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sand-100">{item.stage}</span>
                  <span className="font-mono text-earth-300">{item.count.toLocaleString()} Citizens</span>
                </div>
                <div className="w-full bg-forest-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-earth-400 h-full rounded-full"
                    style={{ width: `${Math.max(15, (item.count / 185000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Friction Remediation Insights */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-5">
          <h3 className="text-sm font-bold text-sand-100 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-earth-400" />
            <span>AI Automated Friction Solutions</span>
          </h3>

          <div className="space-y-3">
            {friction?.primary_friction_insights?.map((ins: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-forest-950/80 border border-earth-400/25 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sand-100">{ins.issue}</h4>
                  <span className="text-[10px] font-mono text-amber-300">{ins.impact}</span>
                </div>
                <div className="p-2 rounded-lg bg-forest-900/60 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{ins.ai_solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
