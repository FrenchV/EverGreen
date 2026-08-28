import React from "react";
import { Keyboard, MousePointer, Volume2, X } from "lucide-react";
import { audioEngine } from "../engine/audioEngine";

interface HelpControlsModalProps {
  onClose: () => void;
}

export const HelpControlsModal: React.FC<HelpControlsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#fcf8e3] border-[6px] border-[#4a2e19] rounded-[32px] shadow-[0_12px_0_rgba(74,46,25,0.25)] overflow-hidden text-[#4a2e19] flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d351d] border-b-4 border-[#14180d] text-[#fefae0]">
          <h2 className="text-xl font-bold font-serif italic text-[#fefae0] flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-[#ffd180]" />
            How to Play Evergreen
          </h2>
          <button
            onClick={() => {
              audioEngine.playUIClick();
              onClose();
            }}
            className="p-1 text-[#a3b18a] hover:text-[#fefae0] hover:bg-[#14180d] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3.5 text-xs">
          <div className="p-3.5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-xs flex items-center justify-between">
            <span className="font-bold text-[#4a2e19]">Move Farmer:</span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#e9edc9] rounded-xl text-[#2d5a27] font-bold border border-[#a3b18a]">
              W, A, S, D or Arrow Keys
            </span>
          </div>

          <div className="p-3.5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-xs flex items-center justify-between">
            <span className="font-bold text-[#4a2e19]">Interact / Enter / Harvest:</span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#e9edc9] rounded-xl text-[#2d5a27] font-bold border border-[#a3b18a]">
              [E] or Click Door / Node / Crop
            </span>
          </div>

          <div className="p-3.5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-xs flex items-center justify-between">
            <span className="font-bold text-[#4a2e19]">Farming (Hoe / Water / Seeds):</span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#e9edc9] rounded-xl text-[#2d5a27] font-bold border border-[#a3b18a]">
              Equip tool in hotbar & click plot
            </span>
          </div>

          <div className="p-3.5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-xs flex items-center justify-between">
            <span className="font-bold text-[#4a2e19]">Fishing at Whispering Lake:</span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#e9edc9] rounded-xl text-[#2d5a27] font-bold border border-[#a3b18a]">
              Equip rod, stand on dock, press [E] on bite
            </span>
          </div>

          <div className="p-3.5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-xs flex items-center justify-between">
            <span className="font-bold text-[#4a2e19]">Select Hotbar Slot:</span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#e9edc9] rounded-xl text-[#2d5a27] font-bold border border-[#a3b18a]">
              Keys 1 - 8 or Click Slot
            </span>
          </div>

          <div className="p-3.5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-xs flex items-center justify-between">
            <span className="font-bold text-[#4a2e19]">Mouse Movement:</span>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#e9edc9] rounded-xl text-[#2d5a27] font-bold border border-[#a3b18a]">
              Click on ground to walk
            </span>
          </div>

          <div className="p-4 bg-[#e9edc9] rounded-2xl border-2 border-[#4a2e19] text-[#2d5a27] shadow-sm">
            <p className="font-bold text-xs font-serif italic mb-1.5 flex items-center gap-1.5 text-[#4a2e19]">
              <span className="text-base">🌲</span> Deep NPC Simulation Tips:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[#4a2e19] font-medium leading-relaxed">
              <li>Each villager has a full 24-hour daily schedule (e.g. Silas runs the clinic morning & reads at lake afternoon).</li>
              <li>You can speak in natural language about anything—the villagers remember past conversations and evolve relationships!</li>
              <li>Learn each villager's favorite items to level up friendship hearts (0-5 hearts).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
