"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { ConsentItemData, AuditLogItem } from "@/types";
import { 
  Lock, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  History, 
  CheckCircle2, 
  XCircle,
  FileText,
  AlertCircle
} from "lucide-react";

export default function ConsentAndPrivacyPage() {
  const [consents, setConsents] = useState<ConsentItemData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiClient.getConsents(), apiClient.getAuditLogs()]).then(([c, l]) => {
      setConsents(c);
      setAuditLogs(l);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (id: number) => {
    try {
      await apiClient.toggleConsent(id);
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_granted: !c.is_granted } : c))
      );
    } catch (e) {
      // Fallback local toggle
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_granted: !c.is_granted } : c))
      );
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sage-400/15">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-earth-500/20 text-earth-300 border border-earth-400/30">
            PRIVACY & DATA MINIMIZATION
          </span>
          <span className="text-xs font-mono text-emerald-400">CITIZEN CONSENT LEDGER</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
          Consent & Statutory Data Access
        </h1>
        <p className="text-xs text-sage-300 font-light mt-0.5">
          You hold granular authority over which statutory databases ADHIKAAR is permitted to query on your behalf.
        </p>
      </div>

      {/* Granular Source Authorizations */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6 shadow-2xl">
        <h3 className="text-sm font-bold text-sand-100 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-earth-400" />
          <span>Active Statutory Query Permissions</span>
        </h3>

        <div className="space-y-3.5">
          {consents.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-sand-100">{c.source_name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    c.is_granted
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : "bg-red-500/15 text-red-300 border-red-500/30"
                  }`}>
                    {c.is_granted ? "AUTHORIZED" : "REVOKED"}
                  </span>
                </div>
                <p className="text-xs text-sage-300 font-light">{c.purpose}</p>
                <span className="text-[10px] text-sage-400 font-mono block">Granted: {c.granted_at}</span>
              </div>

              <button
                onClick={() => handleToggle(c.id)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  c.is_granted
                    ? "bg-forest-900 border-sage-400/30 text-sage-300 hover:text-red-300 hover:border-red-400/40"
                    : "bg-earth-500/30 border-earth-400 text-earth-300 shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                }`}
              >
                {c.is_granted ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-sage-400" />}
                <span>{c.is_granted ? "Revoke Access" : "Grant Authorization"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Log */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-5">
        <h3 className="text-sm font-bold text-sand-100 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>Immutable Data Access Audit Trail</span>
        </h3>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-forest-950/70 border border-sage-400/15 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-mono font-bold text-sand-100">{log.action}</span>
                  <span className="text-sage-400 text-[11px] block">{log.details}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-sage-400 whitespace-nowrap">{log.created_at}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
