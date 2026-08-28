import React, { useEffect } from "react";
import { audioEngine } from "../engine/audioEngine";
import { Moon, Sparkles, Sun, Check } from "lucide-react";

interface SleepModalProps {
  day: number;
  season: string;
  onConfirmSleep: () => void;
  onCancel: () => void;
}

export const SleepModal: React.FC<SleepModalProps> = ({
  day,
  season,
  onConfirmSleep,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#2d351d] border-4 border-[#ffd180] rounded-[28px] p-6 shadow-2xl text-[#fefae0]">
        {/* Glow Decor */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#1b1e12] border-2 border-[#ffd180] flex items-center justify-center shadow-[0_0_20px_rgba(255,209,128,0.4)]">
            <Moon className="w-8 h-8 text-[#ffd180] animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center font-serif italic text-[#ffd180] mb-1">
          Rest for the Night?
        </h2>
        <p className="text-xs text-center text-[#a3b18a] mb-6">
          Tuck into your cozy quilted bed. The crackling hearth will keep you warm until morning.
        </p>

        {/* Benefits Card */}
        <div className="p-3.5 bg-[#14180d] rounded-xl border border-[#3e492c] mb-6 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#ffd180]">
            <Sparkles className="w-4 h-4 text-[#f27d26]" />
            <span>Fully restores Energy & Vitality (100/100)</span>
          </div>
          <div className="flex items-center gap-2 text-[#a3b18a]">
            <Sun className="w-4 h-4 text-[#ffd180]" />
            <span>Advances to Day {day + 1} ({season}), 6:00 AM</span>
          </div>
          <div className="flex items-center gap-2 text-[#a3b18a]">
            <Check className="w-4 h-4 text-[#81c784]" />
            <span>Watered crops will progress to their next growth stage</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              audioEngine.playUIClick();
              onCancel();
            }}
            className="flex-1 py-2.5 bg-[#14180d] hover:bg-[#1f2414] border-2 border-[#3e492c] text-[#a3b18a] hover:text-[#fefae0] font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Stay Awake
          </button>
          <button
            onClick={() => {
              audioEngine.playSleepLullaby();
              onConfirmSleep();
            }}
            className="flex-1 py-2.5 bg-[#f27d26] hover:bg-[#e65100] active:translate-y-0.5 border-b-3 border-r-3 border-[#93330c] text-[#fefae0] font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Moon className="w-4 h-4" />
            <span>Sleep until 6:00 AM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
