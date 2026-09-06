"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Mic, MicOff, Volume2, Sparkles, X, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VoiceInputModal() {
  const router = useRouter();
  const { isVoiceModalOpen, toggleVoiceModal, language, lastSearchName } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statePhase, setStatePhase] = useState<"idle" | "listening" | "transcribing" | "confirmed">("idle");

  useEffect(() => {
    if (isVoiceModalOpen) {
      setStatePhase("listening");
      setIsRecording(true);
      // Simulate speech detection
      const timer1 = setTimeout(() => {
        setTranscript("I remember an old savings account in Bangalore under Lubna Fatima...");
        setStatePhase("transcribing");
      }, 2400);

      const timer2 = setTimeout(() => {
        setStatePhase("confirmed");
        setIsRecording(false);
      }, 4200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setStatePhase("idle");
      setTranscript("");
      setIsRecording(false);
    }
  }, [isVoiceModalOpen]);

  const handleExecuteVoiceSearch = () => {
    toggleVoiceModal(false);
    router.push("/discover/bank");
  };

  if (!isVoiceModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 border border-sage-400/30 text-center flex flex-col items-center"
        >
          {/* Close Button */}
          <button
            onClick={() => toggleVoiceModal(false)}
            className="absolute top-4 right-4 p-2 text-sage-400 hover:text-sand-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Animated Microphone Orb */}
          <div className="relative my-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? "bg-earth-500/20 border-2 border-earth-400 shadow-[0_0_40px_rgba(197,160,89,0.4)]" 
                : "bg-forest-900 border border-sage-400/30"
            }`}>
              {isRecording ? (
                <Mic className="w-10 h-10 text-earth-300 animate-pulse" />
              ) : (
                <Check className="w-10 h-10 text-emerald-400" />
              )}
            </div>

            {/* Ripple waves when listening */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border border-earth-400/40 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-moss-500/30 animate-pulse" />
              </>
            )}
          </div>

          {/* Status Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${isRecording ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-xs font-mono uppercase tracking-widest text-sage-300">
              {statePhase === "listening" && "Listening to Voice Input..."}
              {statePhase === "transcribing" && "Neural Audio Phonetic Processing..."}
              {statePhase === "confirmed" && "Speech Synthesized & Normalized"}
            </span>
          </div>

          <h3 className="text-lg font-serif font-bold text-sand-50 mb-2">
            Speak What You Remember
          </h3>
          <p className="text-xs text-sage-400 max-w-sm mb-6">
            Mention any bank names, old cities, approximate years, or family member associations in your preferred language.
          </p>

          {/* Transcript Box */}
          <div className="w-full min-h-[70px] p-4 rounded-xl bg-forest-950/80 border border-sage-400/20 text-xs text-sand-100 flex items-center justify-center text-center italic mb-6">
            {transcript ? (
              <span>"{transcript}"</span>
            ) : (
              <span className="text-sage-500 not-italic">Speak clearly near your microphone...</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) setStatePhase("listening");
              }}
              className="flex-1 py-2.5 rounded-xl border border-sage-400/30 text-xs font-medium text-sage-300 hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? "Pause Listening" : "Restart Voice"}</span>
            </button>

            <button
              onClick={handleExecuteVoiceSearch}
              disabled={!transcript}
              className="flex-1 py-2.5 rounded-xl bg-earth-500/25 hover:bg-earth-500/40 text-earth-300 border border-earth-400/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(197,160,89,0.2)]"
            >
              <span>Explore Potential Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
