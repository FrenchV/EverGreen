import React from "react";
import { audioEngine } from "../engine/audioEngine";
import { Award, Sparkles, X, ChevronRight, Check } from "lucide-react";

interface LevelUpModalProps {
  skill: "farming" | "foraging" | "fishing" | "social";
  newLevel: number;
  unlockedPerks: string[];
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  skill,
  newLevel,
  unlockedPerks,
  onClose
}) => {
  const skillTitles: Record<string, { label: string; icon: string; color: string }> = {
    farming: { label: "Farming Mastery", icon: "🌾", color: "#81c784" },
    foraging: { label: "Foraging & Botany", icon: "🍄", color: "#ffd54f" },
    fishing: { label: "Angler's Instinct", icon: "🎣", color: "#64b5f6" },
    social: { label: "Charisma & Bonds", icon: "❤️", color: "#ff8a80" }
  };

  const info = skillTitles[skill] || { label: "Skill Mastery", icon: "⭐", color: "#ffd180" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#2d351d] border-4 border-[#ffd180] rounded-[28px] p-6 shadow-[0_0_30px_rgba(255,209,128,0.3)] text-[#fefae0]">
        {/* Confetti Glow Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#14180d] border-2 border-[#ffd180] shadow-[0_0_15px_rgba(255,209,128,0.5)] mb-3">
            <span className="text-3xl animate-bounce">{info.icon}</span>
          </div>

          <div className="inline-block px-3 py-0.5 bg-[#f27d26] text-[#fefae0] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm mb-1">
            Skill Level Up!
          </div>

          <h2 className="text-2xl font-bold font-serif italic text-[#ffd180]">
            {info.label} — Level {newLevel}
          </h2>
        </div>

        {/* Unlocked Perks List */}
        <div className="bg-[#14180d] rounded-2xl border border-[#3e492c] p-4 mb-6 space-y-2.5">
          <p className="text-[11px] font-bold text-[#a3b18a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd180]" />
            New Mastery Perks & Bonuses Unlocked:
          </p>

          {unlockedPerks.map((perk, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#fefae0]">
              <div className="w-4 h-4 rounded-full bg-[#2d5a27] text-[#81c784] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="font-medium">{perk}</span>
            </div>
          ))}
        </div>

        {/* Claim Button */}
        <button
          onClick={() => {
            audioEngine.playUIClick();
            onClose();
          }}
          className="w-full py-3 bg-[#f27d26] hover:bg-[#e65100] active:translate-y-0.5 border-b-3 border-r-3 border-[#93330c] text-[#fefae0] font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Claim Mastery</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
