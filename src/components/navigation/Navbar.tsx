"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageCode } from "@/lib/i18n/translations";
import { 
  Compass, 
  Layers, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  Lock, 
  BarChart3, 
  Bot, 
  Mic, 
  Globe, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    toggleAssistant, 
    isAssistantOpen, 
    toggleVoiceModal, 
    isAuthenticated,
    user 
  } = useAppStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navLinks = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/results", label: "Results", icon: Layers },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/claims", label: "Claims", icon: CheckCircle2 },
    { href: "/scam-check", label: "Scam Shield", icon: ShieldAlert },
    { href: "/consent", label: "Consent & Privacy", icon: Lock },
    { href: "/admin", label: "Authority AI", icon: BarChart3 },
  ];

  // If on login page, render simplified minimal header
  const isLoginPage = pathname === "/" || pathname === "/login";

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 backdrop-blur-md bg-forest-950/70 border-b border-sage-400/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href={isAuthenticated ? "/discover" : "/"} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-earth-400/30 to-moss-600/40 border border-earth-400/40 flex items-center justify-center shadow-[0_0_16px_rgba(197,160,89,0.25)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-4.5 h-4.5 text-earth-300" />
          </div>
          <div>
            <span className="text-base font-bold tracking-wider font-serif text-sand-50 block leading-tight">
              ADHIKAAR
            </span>
            <span className="text-[9px] tracking-widest text-sage-400 font-mono block uppercase">
              {t.tagline || "DISCOVERY. VERIFY. RECLAIM."}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {!isLoginPage && (
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-forest-900/80 border border-sage-400/15">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/discover" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-earth-500/20 text-earth-300 border border-earth-400/30 shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                      : "text-sage-300 hover:text-sand-100 hover:bg-forest-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Action Controls: Language, Voice, Assistant, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Statutory Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest-900/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>STATUTORY SYNC ACTIVE</span>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-sage-400/20 text-xs text-sand-100 transition-colors"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-sage-400" />
              <span className="font-medium text-[11px] uppercase">{language}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl p-1.5 z-50 border border-sage-400/25">
                <div className="text-[10px] font-semibold text-sage-400 px-2 py-1 uppercase tracking-wider">
                  Select Language
                </div>
                <div className="grid grid-cols-1 gap-0.5 mt-1 max-h-60 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? "bg-earth-500/20 text-earth-300 font-semibold"
                          : "text-sage-200 hover:bg-forest-800 hover:text-sand-100"
                      }`}
                    >
                      <span>{lang.nativeLabel}</span>
                      <span className="text-[10px] text-sage-400">({lang.label})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Voice Input UI Button */}
          <button
            onClick={() => toggleVoiceModal()}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 border border-sage-400/20 text-sage-300 hover:text-earth-300 transition-colors"
            title="Voice Search / Assistant"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* ADHIKAAR Copilot Assistant Toggle */}
          <button
            onClick={() => toggleAssistant()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isAssistantOpen
                ? "bg-earth-500/25 border-earth-400 text-earth-300 shadow-[0_0_16px_rgba(197,160,89,0.3)]"
                : "bg-forest-900/80 hover:bg-forest-800 border-sage-400/20 text-sage-300 hover:text-sand-100"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-earth-400" />
            <span className="hidden sm:inline">Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-earth-400 animate-ping" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-forest-900/80 text-sage-300 hover:text-sand-100"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-sage-400/15 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive ? "bg-earth-500/20 text-earth-300 font-semibold" : "text-sage-200 hover:bg-forest-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
