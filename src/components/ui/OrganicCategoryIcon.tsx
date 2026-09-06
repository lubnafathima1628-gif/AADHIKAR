"use client";

import React from "react";
import { AssetCategory } from "@/types";

interface OrganicCategoryIconProps {
  category: AssetCategory | string;
  className?: string;
  size?: number;
}

export default function OrganicCategoryIcon({ category, className = "", size = 48 }: OrganicCategoryIconProps) {
  const iconSize = `${size}px`;

  switch (category) {
    case "bank":
      // Abstract Vault & Flowing Deposit Symbol
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
          <rect x="18" y="18" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="2.5" />
          <path d="M32 18V12M32 52V46M18 32H12M52 32H46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M23 23L19 19M41 41L45 45M41 23L45 19M23 41L19 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
        </svg>
      );

    case "insurance":
      // Protective Organic Shield with Seed/Leaf center
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M32 8C20 14 14 18 14 30C14 44 24 54 32 58C40 54 50 44 50 30C50 18 44 14 32 8Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M32 20C32 20 25 26 25 33C25 37 28 40 32 40C36 40 39 37 39 33C39 26 32 20 32 20Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.85"
          />
          <path d="M32 24V38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "investments":
      // Growing Branch / Organic Geometric Growth
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M16 48C24 46 30 38 32 26C34 34 40 40 48 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="18" r="4" fill="currentColor" />
          <circle cx="48" cy="28" r="3.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="34" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M32 26L48 28M32 36L18 34" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
        </svg>
      );

    case "pf":
      // Work / Employment Identity & Seed Matrix
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect x="12" y="20" width="40" height="32" rx="6" stroke="currentColor" strokeWidth="2.5" />
          <path d="M22 20V15C22 13.3431 23.3431 12 25 12H39C40.6569 12 42 13.3431 42 15V20" stroke="currentColor" strokeWidth="2" />
          <path d="M12 32H52" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="32" cy="36" r="3.5" fill="currentColor" />
          <path d="M26 44H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "property":
      // Land / Topographic & Survey Coordinate Grid
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <polygon points="32,10 52,22 52,46 32,58 12,46 12,22" stroke="currentColor" strokeWidth="2.5" />
          <line x1="32" y1="10" x2="32" y2="58" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="12" y1="34" x2="52" y2="34" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="32" cy="34" r="4" fill="currentColor" />
        </svg>
      );

    case "benefits":
      // Flowing Public Service / Pillar & Lotus Ripple
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M12 50H52M16 44H48M18 44V26M46 44V26M32 44V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 26L32 14L52 26H12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
        </svg>
      );

    default:
      // Connected Asset Constellation
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="32" cy="32" r="6" fill="currentColor" />
          <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="48" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="48" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="44" cy="48" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M19 23L28 29M45 23L36 29M23 45L29 36M41 45L35 36" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
        </svg>
      );
  }
}
