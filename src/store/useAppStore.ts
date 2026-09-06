import { create } from "zustand";
import { AssetCategory, BackgroundState, PotentialAssetMatch, UserProfile } from "@/types";
import { LanguageCode } from "@/lib/i18n/translations";

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: LanguageCode;
  bgState: BackgroundState;
  selectedCategory: AssetCategory;
  lastSearchName: string;
  searchResults: PotentialAssetMatch[];
  selectedMatchId: number | null;
  selectedClaimId: number | null;
  isAssistantOpen: boolean;
  assistantMode: "recovery" | "portal";
  isVoiceModalOpen: boolean;
  lowBandwidthMode: boolean;

  // Actions
  login: (user: UserProfile) => void;
  logout: () => void;
  setLanguage: (lang: LanguageCode) => void;
  setBgState: (state: BackgroundState) => void;
  setSelectedCategory: (cat: AssetCategory) => void;
  setSearchResults: (name: string, results: PotentialAssetMatch[]) => void;
  setSelectedMatchId: (id: number | null) => void;
  setSelectedClaimId: (id: number | null) => void;
  toggleAssistant: (open?: boolean) => void;
  setAssistantMode: (mode: "recovery" | "portal") => void;
  toggleVoiceModal: (open?: boolean) => void;
  toggleLowBandwidth: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 1,
    phone_or_email: "citizen@adhikaar.gov.in",
    full_name: "Lubna Fathima",
    preferred_language: "en",
  },
  isAuthenticated: true,
  language: "en",
  bgState: "entry",
  selectedCategory: "all",
  lastSearchName: "Lubna Fathima",
  searchResults: [],
  selectedMatchId: 1,
  selectedClaimId: 1,
  isAssistantOpen: false,
  assistantMode: "recovery",
  isVoiceModalOpen: false,
  lowBandwidthMode: false,

  login: (user) => set({ user, isAuthenticated: true, bgState: "discover" }),
  logout: () => set({ user: null, isAuthenticated: false, bgState: "entry", searchResults: [] }),
  setLanguage: (language) => set({ language }),
  setBgState: (bgState) => set({ bgState }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchResults: (lastSearchName, searchResults) => set({ lastSearchName, searchResults, bgState: "results" }),
  setSelectedMatchId: (selectedMatchId) => set({ selectedMatchId }),
  setSelectedClaimId: (selectedClaimId) => set({ selectedClaimId }),
  toggleAssistant: (open) => set((s) => ({ isAssistantOpen: open !== undefined ? open : !s.isAssistantOpen })),
  setAssistantMode: (assistantMode) => set({ assistantMode, isAssistantOpen: true }),
  toggleVoiceModal: (open) => set((s) => ({ isVoiceModalOpen: open !== undefined ? open : !s.isVoiceModalOpen })),
  toggleLowBandwidth: () => set((s) => ({ lowBandwidthMode: !s.lowBandwidthMode })),
}));
