import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "@/styles/globals.css";
import LivingAssetUniverse from "@/components/3d/LivingAssetUniverse";
import Navbar from "@/components/navigation/Navbar";
import AssistantDock from "@/components/ai/AssistantDock";
import VoiceInputModal from "@/components/ai/VoiceInputModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADHIKAAR — Discovery. Verify. Reclaim.",
  description: "AI-Powered Living Ecosystem for Unified Statutory Unclaimed Asset Discovery and Recovery across RBI, IEPF, EPFO, and IRDAI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="bg-[#060a08] text-[#f4f6f0] antialiased selection:bg-earth-500/30 selection:text-earth-200">
        {/* Living Three.js Ecosystem Background */}
        <LivingAssetUniverse />

        {/* Global Navigation */}
        <Navbar />

        {/* Page Main Content Container */}
        <main className="relative min-h-[calc(100vh-64px)] z-10 flex flex-col">
          {children}
        </main>

        {/* Global AI Copilot Assistant Dock & Voice Modal */}
        <AssistantDock />
        <VoiceInputModal />
      </body>
    </html>
  );
}
