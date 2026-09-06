"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";
import OrganicCategoryIcon from "@/components/ui/OrganicCategoryIcon";
import { AssetCategory } from "@/types";
import { ArrowUpRight, Sparkles, Compass, Search } from "lucide-react";

interface CategoryMeta {
  id: AssetCategory;
  title: string;
  tagline: string;
  authority: string;
  colorScheme: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "bank",
    title: "BANK / DEPOSITS",
    tagline: "Dormant savings, fixed deposits, current accounts inactive for 10+ years",
    authority: "RBI DEA Fund / UDGAM Gateway",
    colorScheme: "from-emerald-900/30 to-forest-900",
  },
  {
    id: "insurance",
    title: "INSURANCE POLICIES",
    tagline: "Unclaimed maturity amounts, survival dues, death claims",
    authority: "IRDAI Bima Bharosa / Insurers",
    colorScheme: "from-teal-900/30 to-forest-900",
  },
  {
    id: "investments",
    title: "INVESTMENTS / IEPF",
    tagline: "Unclaimed shares, mutual funds, 7-year unpaid dividend balances",
    authority: "IEPF Authority (Ministry of Corporate Affairs)",
    colorScheme: "from-amber-900/30 to-forest-900",
  },
  {
    id: "pf",
    title: "EPF / PROVIDENT FUND",
    tagline: "Inoperative member accounts, previous employer PF settlements",
    authority: "Employees' Provident Fund Organisation (EPFO)",
    colorScheme: "from-blue-900/30 to-forest-900",
  },
  {
    id: "property",
    title: "PROPERTY & LAND",
    tagline: "Unmutated revenue survey records, ancestral land partitions",
    authority: "State Revenue & Land Records Directorate",
    colorScheme: "from-earth-900/30 to-forest-900",
  },
  {
    id: "benefits",
    title: "GOVERNMENT BENEFITS",
    tagline: "Direct Benefit Transfer (DBT), pension arrears, statutory welfare dues",
    authority: "Public Welfare & DBT Registry",
    colorScheme: "from-emerald-950/40 to-forest-900",
  },
  {
    id: "other",
    title: "OTHER INSTITUTIONAL ASSETS",
    tagline: "Post office savings, utility security deposits, court deposits",
    authority: "National Institutional Registrars",
    colorScheme: "from-sage-900/30 to-forest-900",
  },
];

export default function DiscoverCategorySelectionPage() {
  const router = useRouter();
  const { language, setSelectedCategory, setBgState } = useAppStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [hoveredCategory, setHoveredCategory] = useState<AssetCategory | null>(null);
  const [selectedAnimCat, setSelectedAnimCat] = useState<AssetCategory | null>(null);

  const handleSelectCategory = (cat: AssetCategory) => {
    setSelectedAnimCat(cat);
    setSelectedCategory(cat);
    setBgState("discover");
    setTimeout(() => {
      router.push(`/discover/${cat}`);
    }, 450);
  };

  const handleSearchAll = () => {
    setSelectedCategory("all");
    router.push("/discover/all");
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-between">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-earth-400/30 text-xs font-mono text-earth-300"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>STATUTORY CHANNEL DISCOVERY</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-serif font-bold text-sand-50 tracking-tight"
        >
          {t.what_discover || "What do you want to discover?"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-sage-300 font-light"
        >
          {t.discover_sub || "You don't need to remember every detail. Start with what you remember."}
        </motion.p>
      </div>

      {/* 7 Organic Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {CATEGORIES.map((cat, idx) => {
          const isHovered = hoveredCategory === cat.id;
          const isSelected = selectedAnimCat === cat.id;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleSelectCategory(cat.id)}
              className={`relative cursor-pointer rounded-2xl glass-card p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? "border-earth-400 bg-earth-500/20 shadow-[0_0_32px_rgba(197,160,89,0.4)] scale-95"
                  : isHovered
                  ? "border-earth-400/60 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]"
                  : "border-sage-400/20"
              }`}
            >
              {/* Subtle background glow */}
              <div
                className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${cat.colorScheme} blur-2xl transition-opacity ${
                  isHovered ? "opacity-100" : "opacity-40"
                }`}
              />

              {/* Icon & Category Header */}
              <div className="flex items-start justify-between mb-4 z-10">
                <div className="p-3 rounded-xl bg-forest-950/80 border border-sage-400/25 text-earth-300 group-hover:text-earth-200 group-hover:border-earth-400/50 transition-all">
                  <OrganicCategoryIcon category={cat.id} size={36} />
                </div>
                <span className="p-1.5 rounded-lg bg-forest-950/60 text-sage-400 group-hover:text-sand-100 group-hover:bg-earth-500/20 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Content Info */}
              <div className="space-y-1.5 z-10">
                <h3 className="text-sm font-bold text-sand-100 tracking-wide">
                  {cat.title}
                </h3>
                <p className="text-xs text-sage-300/90 leading-relaxed font-light line-clamp-2">
                  {cat.tagline}
                </p>
              </div>

              {/* Authority Tag */}
              <div className="mt-4 pt-3 border-t border-sage-400/15 flex items-center justify-between text-[10px] font-mono text-sage-400 z-10">
                <span className="truncate max-w-[200px]">{cat.authority}</span>
                <span className="text-emerald-400">AUTHORIZED</span>
              </div>
            </motion.div>
          );
        })}

        {/* Global Multi-Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ y: -4 }}
          onClick={handleSearchAll}
          className="relative cursor-pointer rounded-2xl glass-card p-6 border border-earth-400/40 bg-gradient-to-br from-earth-500/15 to-forest-900 flex flex-col justify-between group shadow-[0_0_24px_rgba(197,160,89,0.15)]"
        >
          <div className="flex items-start justify-between mb-4 z-10">
            <div className="p-3 rounded-xl bg-forest-950/90 border border-earth-400/50 text-earth-300">
              <Sparkles className="w-9 h-9" />
            </div>
            <span className="p-1.5 rounded-lg bg-earth-500/30 text-earth-200">
              <Search className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1.5 z-10">
            <h3 className="text-sm font-bold text-earth-200 tracking-wide">
              SEARCH ALL CATEGORIES
            </h3>
            <p className="text-xs text-sage-300/90 leading-relaxed font-light">
              Run unified multi-attribute query across all 6 statutory registries simultaneously.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-earth-400/25 flex items-center justify-between text-[10px] font-mono text-earth-300 z-10">
            <span>UNIFIED ORCHESTRATOR</span>
            <span className="text-emerald-400">6 CONNECTORS</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Subtext */}
      <div className="text-center mt-8 pt-4 border-t border-sage-400/10 text-xs text-sage-400 font-mono">
        Official institutions remain responsible for ownership verification, approval and disbursement.
      </div>
    </div>
  );
}
