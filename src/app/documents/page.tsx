"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { DocumentItem } from "@/types";
import { 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  Eye, 
  FileCheck2,
  Trash2,
  Cpu
} from "lucide-react";

export default function DocumentAIWorkspacePage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      file_name: "Aadhaar_Front_Signed.pdf",
      document_category: "identity_proof",
      security_scan_passed: true,
      extracted_name: "Lubna Fathima",
      extracted_identifier_masked: "XXXX-XXXX-8921",
      mismatch_detected: true,
      mismatch_details: "Document displays 'Lubna Fathima' while bank record states 'Lubna Fatima'. Self-Declaration Affirmation suggested.",
      ocr_confidence: 0.98,
      created_at: "2026-09-06 14:30"
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const handleSimulatedUpload = (category: string) => {
    setIsUploading(true);
    setUploadPhase("Running 256-Bit Antivirus & Security Scan...");

    setTimeout(() => {
      setUploadPhase("Neural OCR & Field Extraction (98.5% confidence)...");
    }, 1200);

    setTimeout(() => {
      setUploadPhase("Executing Identity Resolution Mismatch Detector...");
    }, 2400);

    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: Date.now(),
        file_name: category === "passbook" ? "Bank_Cancelled_Cheque_Scan.pdf" : "PAN_Card_Attested.pdf",
        document_category: category,
        security_scan_passed: true,
        extracted_name: "Lubna Fathima",
        extracted_identifier_masked: "XXXX-XXXX-4410",
        mismatch_detected: false,
        mismatch_details: "Criteria validated. Bank account holder name matches target profile.",
        ocr_confidence: 0.99,
        created_at: "Just now"
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setIsUploading(false);
      setUploadPhase("");
      setSelectedDoc(newDoc);
    }, 3600);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sage-400/15">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-earth-500/20 text-earth-300 border border-earth-400/30">
            DOCUMENT AI & OCR WORKSPACE
          </span>
          <span className="text-xs font-mono text-emerald-400">ENCRYPTION: AES-256</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-sand-50 mt-1">
          KYC Proof Verification & Mismatch AI
        </h1>
        <p className="text-xs text-sage-300 font-light mt-0.5">
          Scan and validate documents, extract fields, and detect spelling or address variations before statutory submission.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Drop Area */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-sage-400/25 flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-sm font-bold text-sand-100 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-earth-400" />
              <span>Upload Proof File</span>
            </h3>
            <p className="text-xs text-sage-400 mt-1">
              Upload PDF, JPG or PNG. All sensitive IDs are automatically masked.
            </p>
          </div>

          <div
            onClick={() => !isUploading && handleSimulatedUpload("identity_proof")}
            className={`p-6 rounded-xl border-2 border-dashed border-sage-400/30 bg-forest-950/70 hover:border-earth-400/60 hover:bg-forest-900/60 cursor-pointer text-center space-y-2.5 transition-all ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-forest-900 border border-sage-400/20 flex items-center justify-center mx-auto text-earth-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sand-100">Click to Upload Document</p>
              <p className="text-[10px] text-sage-400">Aadhaar, PAN, Passbook, Share Certificate</p>
            </div>
          </div>

          {/* Quick Presets for Demo */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-sage-400 uppercase">Simulate Document Ingestion:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulatedUpload("identity_proof")}
                className="p-2 rounded-lg bg-forest-950/90 hover:bg-earth-500/20 border border-sage-400/20 text-[11px] text-sage-200 hover:text-earth-300 transition-colors"
              >
                + Aadhaar Card
              </button>
              <button
                onClick={() => handleSimulatedUpload("passbook")}
                className="p-2 rounded-lg bg-forest-950/90 hover:bg-earth-500/20 border border-sage-400/20 text-[11px] text-sage-200 hover:text-earth-300 transition-colors"
              >
                + Bank Passbook
              </button>
            </div>
          </div>
        </div>

        {/* Processing State or Document List */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-sage-400/25 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-sand-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Processed Documents ({documents.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">AUTO-MASKING ACTIVE</span>
          </div>

          {/* Upload Progress Animation */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-earth-500/15 border border-earth-400/40 text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-earth-300">
                <Cpu className="w-4 h-4 animate-spin" />
                <span>{uploadPhase}</span>
              </div>
              <div className="w-full bg-forest-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-earth-400 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </motion.div>
          )}

          {/* Document Cards */}
          <div className="space-y-3.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-forest-900 border border-sage-400/25 text-earth-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-sand-100">{doc.file_name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-sage-400 mt-0.5">
                        <span>Category: {doc.document_category}</span>
                        <span>•</span>
                        <span className="text-emerald-400">OCR: {Math.round(doc.ocr_confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    SCAN VERIFIED
                  </span>
                </div>

                {/* Extracted Fields */}
                <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-forest-900/60 text-xs">
                  <div>
                    <span className="text-[10px] text-sage-400 block">Extracted Legal Name</span>
                    <span className="font-semibold text-sand-100">{doc.extracted_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sage-400 block">Masked Identifier</span>
                    <span className="font-mono text-sand-200">{doc.extracted_identifier_masked}</span>
                  </div>
                </div>

                {/* Mismatch Alert Box */}
                {doc.mismatch_detected ? (
                  <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Name Variation Detected: </strong>
                      <span>{doc.mismatch_details}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Exact match verified against target claim requirements.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
