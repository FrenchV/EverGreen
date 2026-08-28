import React from "react";
import { Quest, Item } from "../types";
import { audioEngine } from "../engine/audioEngine";
import { Pin, Coins, Heart, CheckCircle2, X } from "lucide-react";

interface NoticeBoardModalProps {
  quests: Quest[];
  inventory: Array<{ item: Item; quantity: number }>;
  onCompleteQuest: (questId: string) => void;
  onClose: () => void;
}

export const NoticeBoardModal: React.FC<NoticeBoardModalProps> = ({
  quests,
  inventory,
  onCompleteQuest,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#fcf8e3] border-[6px] border-[#4a2e19] rounded-[32px] shadow-[0_12px_0_rgba(74,46,25,0.25)] overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d351d] border-b-4 border-[#14180d] text-[#fefae0]">
          <div className="flex items-center gap-2.5">
            <Pin className="w-5 h-5 text-[#ffd180]" />
            <h2 className="text-xl font-bold font-serif italic text-[#fefae0] tracking-wide">
              Evergreen Town Notice Board
            </h2>
          </div>
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

        {/* Quest Papers Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {quests.map(q => {
            const hasItem = q.targetItemId
              ? inventory.some(
                  slot =>
                    slot.item.id === q.targetItemId &&
                    slot.quantity >= (q.targetItemCount || 1)
                )
              : false;

            return (
              <div
                key={q.id}
                className="relative p-5 bg-[#fefae0] text-[#4a2e19] rounded-2xl border-2 border-[#4a2e19]/30 shadow-sm flex flex-col justify-between"
              >
                {/* Pin top center */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f27d26] rounded-full border-2 border-white shadow-md" />

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold font-serif italic text-base text-[#4a2e19]">{q.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#e9edc9] text-[#2d5a27] rounded-md border border-[#a3b18a]">
                      From: {q.requesterName}
                    </span>
                  </div>
                  <p className="text-xs text-[#5d4037] leading-relaxed mb-4 font-medium">
                    {q.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ccd5ae] flex items-center justify-between">
                  {/* Rewards */}
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-[#f27d26]">
                      <Coins className="w-3.5 h-3.5" />
                      +{q.rewardCoins}g
                    </span>
                    <span className="flex items-center gap-1 text-[#2d5a27]">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      +{q.rewardPoints}pts
                    </span>
                  </div>

                  {/* Action */}
                  {q.status === "completed" ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#2d5a27]">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        audioEngine.playGiftFanfare();
                        onCompleteQuest(q.id);
                      }}
                      disabled={!hasItem}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                        hasItem
                          ? "bg-[#2d5a27] hover:bg-[#1b3d17] text-white border-b-3 border-r-3 border-[#14180d] shadow-sm active:translate-y-0.5"
                          : "bg-[#ccd5ae] text-[#5d4037] border-2 border-[#a3b18a] cursor-not-allowed opacity-60"
                      }`}
                    >
                      {hasItem ? "Deliver Item" : "Items Needed"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
