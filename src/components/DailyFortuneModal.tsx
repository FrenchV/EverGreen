import React from "react";
import { audioEngine } from "../engine/audioEngine";
import { DailyFortune } from "../types";
import { Radio, Sparkles, X, Sun, Compass } from "lucide-react";

interface DailyFortuneModalProps {
  fortune: DailyFortune;
  onClose: () => void;
}

export const DailyFortuneModal: React.FC<DailyFortuneModalProps> = ({
  fortune,
  onClose
}) => {
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "Joyous":
        return { text: "🌟 Joyous Fortune (High Luck)", bg: "bg-[#2e7d32]", textCol: "text-[#a5d6a7]" };
      case "Good":
        return { text: "✨ Favorable Winds", bg: "bg-[#f57f17]", textCol: "text-[#fff59d]" };
      case "Neutral":
        return { text: "🌿 Calm & Steady", bg: "bg-[#1565c0]", textCol: "text-[#90caf9]" };
      default:
        return { text: "🍂 Quiet Day", bg: "bg-[#4e342e]", textCol: "text-[#d7ccc8]" };
    }
  };

  const badge = getRatingBadge(fortune.luckRating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#fcf8e3] border-4 border-[#4a2e19] rounded-[28px] p-6 shadow-2xl text-[#4a2e19]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#ccd5ae] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#4a2e19] text-[#ffd180] flex items-center justify-center shadow-md">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif italic text-[#4a2e19]">
                Valley Spirits Almanac & Radio
              </h2>
              <p className="text-[10px] text-[#5d4037] font-semibold">Morning Broadcast • Channel 98.4 FM</p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playUIClick();
              onClose();
            }}
            className="text-[#5d4037] hover:text-[#4a2e19] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fortune Status Tag */}
        <div className="mb-4">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.textCol} shadow-xs`}>
            {badge.text}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 p-4 mb-5 shadow-inner">
          <h3 className="font-bold text-sm text-[#2d5a27] font-serif italic mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#f27d26]" />
            {fortune.title}
          </h3>
          <p className="text-xs text-[#5d4037] leading-relaxed mb-3">
            "{fortune.description}"
          </p>

          <div className="p-2.5 bg-[#e9edc9] rounded-xl border border-[#ccd5ae] text-[11px] text-[#2d5a27] font-semibold flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#e65100] shrink-0" />
            <span>Today's Blessing: {fortune.bonus}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playUIClick();
            onClose();
          }}
          className="w-full py-2.5 bg-[#4a2e19] hover:bg-[#3e2723] active:translate-y-0.5 text-[#fefae0] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          Got it, let's seize the day!
        </button>
      </div>
    </div>
  );
};
