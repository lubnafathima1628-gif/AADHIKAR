"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraphNode, GraphLink } from "@/types";
import { Shield, Sparkles, Building2, TrendingUp, Briefcase, MapPin, Landmark, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface RelationshipGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onSelectNode?: (node: GraphNode) => void;
}

export default function RelationshipGraph3D({ nodes, links, onSelectNode }: RelationshipGraphProps) {
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (nodes.length > 0 && !activeNode) {
      const firstAsset = nodes.find((n) => n.type === "asset") || nodes[0];
      setActiveNode(firstAsset);
    }
  }, [nodes, activeNode]);

  const citizenNode = nodes.find((n) => n.type === "citizen");
  const categoryNodes = nodes.filter((n) => n.type === "category");
  const assetNodes = nodes.filter((n) => n.type === "asset");

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case "bank": return <Building2 className="w-4 h-4 text-emerald-400" />;
      case "investments": return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case "insurance": return <Shield className="w-4 h-4 text-teal-400" />;
      case "pf": return <Briefcase className="w-4 h-4 text-blue-400" />;
      case "property": return <MapPin className="w-4 h-4 text-amber-500" />;
      case "benefits": return <Landmark className="w-4 h-4 text-emerald-500" />;
      default: return <Sparkles className="w-4 h-4 text-sage-400" />;
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl glass-panel p-6 overflow-hidden flex flex-col justify-between border border-sage-400/15">
      {/* Header / Legend */}
      <div className="flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-sm font-semibold tracking-wider uppercase text-sage-300">
              Living Asset Relationship Network
            </h3>
          </div>
          <p className="text-xs text-sage-400/80 mt-0.5">
            Statistical multi-source entity resolution map
          </p>
        </div>

        {/* Node Types Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-sage-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-earth-400" />
            <span>Identity Anchor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-ocean-500" />
            <span>Statutory Channel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Potential Match</span>
          </div>
        </div>
      </div>

      {/* Organic Center Graph Canvas Representation */}
      <div className="relative flex-1 flex items-center justify-center my-4">
        {/* SVG Synapse Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c5a059" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8fa89b" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Radial Lines from Center */}
          <line x1="50%" y1="50%" x2="22%" y2="28%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="50%" y1="50%" x2="78%" y2="28%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="50%" y1="50%" x2="22%" y2="72%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="50%" y1="50%" x2="78%" y2="72%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />

          <circle cx="50%" cy="50%" r="140" fill="none" stroke="rgba(143, 168, 155, 0.08)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="220" fill="none" stroke="rgba(197, 160, 89, 0.06)" strokeWidth="1" />
        </svg>

        {/* Central Identity Node */}
        {citizenNode && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-20 flex flex-col items-center cursor-pointer group"
            onClick={() => {
              setActiveNode(citizenNode);
              onSelectNode?.(citizenNode);
            }}
          >
            <div className="relative p-3.5 rounded-full bg-gradient-to-br from-earth-500/30 to-forest-800 border-2 border-earth-400 shadow-[0_0_24px_rgba(197,160,89,0.35)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-earth-300 animate-pulse" />
            </div>
            <span className="text-xs font-medium text-sand-100 mt-2 px-2.5 py-0.5 rounded-full bg-forest-900/80 border border-earth-400/40">
              {citizenNode.label}
            </span>
          </motion.div>
        )}

        {/* Orbiting Category & Asset Nodes */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {assetNodes.map((asset, idx) => {
            const angle = (idx / assetNodes.length) * Math.PI * 2 - Math.PI / 4;
            const distance = 165;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const isSelected = activeNode?.id === asset.id;

            return (
              <motion.div
                key={asset.id}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute pointer-events-auto cursor-pointer"
                onClick={() => {
                  setActiveNode(asset);
                  onSelectNode?.(asset);
                }}
              >
                <div
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? "bg-earth-500/20 border-earth-400 shadow-[0_0_20px_rgba(197,160,89,0.3)] scale-105"
                      : "bg-forest-900/90 border-sage-400/20 hover:border-sage-400/50 hover:bg-forest-800"
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-forest-950 border border-sage-400/20">
                    {getCategoryIcon(asset.category)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-sand-100 leading-tight">
                      {asset.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-emerald-400 font-medium">
                        {asset.confidence ? `${Math.round(asset.confidence * 100)}% Match` : "Potential"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Node Context Banner */}
      {activeNode && (
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 p-3.5 rounded-xl bg-forest-900/80 border border-sage-400/20 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-forest-950 border border-earth-500/30">
              {getCategoryIcon(activeNode.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-sand-100">{activeNode.label}</p>
                {activeNode.confidence && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    POTENTIAL MATCH: {Math.round(activeNode.confidence * 100)}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-sage-400 mt-0.5">
                {activeNode.details || "Click to inspect statistical evidence & claim pathway"}
              </p>
            </div>
          </div>

          {activeNode.match_id && (
            <Link
              href={`/assets/${activeNode.match_id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-earth-300 bg-earth-500/15 hover:bg-earth-500/25 border border-earth-400/40 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Examine Evidence</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
