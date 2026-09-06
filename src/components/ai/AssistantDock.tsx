"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { apiClient } from "@/lib/api/client";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  FileCheck2, 
  ShieldAlert, 
  ChevronRight, 
  HelpCircle,
  Minimize2,
  Maximize2
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AssistantDock() {
  const pathname = usePathname();
  const { 
    isAssistantOpen, 
    toggleAssistant, 
    assistantMode, 
    setAssistantMode 
  } = useAppStore();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; actions?: string[] }>>([
    {
      role: "assistant",
      content: "Namaste. I am your ADHIKAAR Recovery & Statutory Copilot. I help you navigate unclaimed asset discovery, resolve name discrepancies, check required documents, and draft claims.",
      actions: ["Why is there a potential match?", "What documents are required?", "How to resolve spelling mismatch?"]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user" as const, content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const response = await apiClient.sendChat(
        [...messages, userMsg],
        assistantMode,
        pathname
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.reply,
          actions: response.suggested_actions,
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I am actively monitoring statutory rules. To assist you with this section: all claims must follow authorized KYC and official nodal procedures.",
          actions: ["Check Document AI", "Review Scam Shield"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className={`fixed z-50 right-4 sm:right-8 bottom-6 glass-panel rounded-2xl shadow-2xl border border-sage-400/25 overflow-hidden flex flex-col transition-all ${
          isExpanded ? "w-[92vw] sm:w-[540px] h-[680px]" : "w-[92vw] sm:w-[420px] h-[520px]"
        }`}
      >
        {/* Header with Mode Switcher */}
        <div className="p-3.5 bg-forest-900/90 border-b border-sage-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-earth-500/20 border border-earth-400/40">
              <Bot className="w-4 h-4 text-earth-300" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-sand-100 flex items-center gap-1.5">
                ADHIKAAR COPILOT
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-sage-400">Contextual Statutory Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mode Toggle Buttons */}
            <div className="flex p-0.5 rounded-lg bg-forest-950 border border-sage-400/20 text-[10px]">
              <button
                onClick={() => setAssistantMode("recovery")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  assistantMode === "recovery"
                    ? "bg-earth-500/30 text-earth-300 font-semibold"
                    : "text-sage-400 hover:text-sand-100"
                }`}
              >
                Recovery Copilot
              </button>
              <button
                onClick={() => setAssistantMode("portal")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  assistantMode === "portal"
                    ? "bg-ocean-500/30 text-ocean-300 font-semibold"
                    : "text-sage-400 hover:text-sand-100"
                }`}
              >
                Portal Guide
              </button>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-sage-400 hover:text-sand-100"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => toggleAssistant(false)}
              className="p-1 text-sage-400 hover:text-sand-100"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Explanatory Sub-banner */}
        <div className="px-3.5 py-1.5 bg-forest-950/60 border-b border-sage-400/10 text-[10px] text-sage-400 flex items-center justify-between">
          <span>
            {assistantMode === "recovery"
              ? "🎯 Guiding statutory recovery rules, documents & IEPF/UDGAM steps."
              : "🧭 Explaining terminology, portal features & secure upload flows."}
          </span>
          <span className="font-mono text-emerald-400/80">RAG ACTIVE</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-earth-500/20 text-sand-100 border border-earth-400/30 rounded-tr-none"
                    : "bg-forest-900/90 text-sage-200 border border-sage-400/20 rounded-tl-none"
                }`}
              >
                {m.content}
              </div>

              {/* Suggested Action Chips */}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                  {m.actions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleSend(act)}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-forest-950/90 hover:bg-earth-500/20 text-sage-300 hover:text-earth-300 border border-sage-400/25 flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-earth-400" />
                      <span>{act}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-sage-400">
              <div className="w-2 h-2 rounded-full bg-earth-400 animate-bounce" />
              <span>Analyzing statutory rules & evidence...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-forest-900/90 border-t border-sage-400/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                assistantMode === "recovery"
                  ? "Ask about required documents, IEPF Form 5, UDGAM..."
                  : "Ask what a term means or how to navigate..."
              }
              className="flex-1 bg-forest-950/80 border border-sage-400/25 rounded-xl px-3 py-2 text-xs text-sand-100 placeholder-sage-400/60 focus:outline-none focus:border-earth-400/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-earth-500/25 hover:bg-earth-500/40 text-earth-300 border border-earth-400/40 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
