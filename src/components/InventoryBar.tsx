import React from "react";
import { Item } from "../types";
import { audioEngine } from "../engine/audioEngine";
import { ItemIcon } from "./ItemIcon";
import { Coins, Heart, Zap } from "lucide-react";

interface InventoryBarProps {
  inventory: Array<{ item: Item; quantity: number }>;
  selectedSlotIndex: number;
  onSelectSlot: (index: number) => void;
  goldCoins: number;
  energy?: number;
  maxEnergy?: number;
  onUseItem?: (slotIndex: number) => void;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({
  inventory,
  selectedSlotIndex,
  onSelectSlot,
  goldCoins,
  energy = 100,
  maxEnergy = 100,
  onUseItem
}) => {
  const selectedSlot = inventory[selectedSlotIndex];
  const selectedItem = selectedSlot?.item;

  // Calculate 10 hearts & 10 energy pips
  const heartCount = 10;
  const energyPipCount = 10;
  const activeEnergyPips = Math.round((energy / maxEnergy) * energyPipCount);

  return (
    <div className="flex flex-col items-center gap-1.5 pointer-events-auto select-none">
      {/* Selected Item Floating Name Card (Minecraft Style) */}
      {selectedItem && (
        <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e]/95 border-2 border-[#3c3c3c] rounded-lg text-xs text-[#ffffff] shadow-2xl backdrop-blur-xs animate-fade-in">
          <span className="font-bold text-[#ffd54f] drop-shadow-xs">{selectedItem.name}</span>
          <span className="text-[10px] text-[#aaaaaa] font-medium">({selectedItem.category})</span>
          {selectedItem.healEnergy && onUseItem && (
            <button
              onClick={() => onUseItem(selectedSlotIndex)}
              className="ml-1.5 px-2 py-0.5 bg-[#388e3c] hover:bg-[#2e7d32] active:translate-y-0.5 text-white font-bold text-[10px] rounded border border-[#1b5e20] cursor-pointer shadow-xs"
            >
              Eat (+{selectedItem.healEnergy}⚡)
            </button>
          )}
        </div>
      )}

      {/* Minecraft HUD Status Rows (Hearts + Energy) */}
      <div className="w-full flex items-center justify-between px-2 text-[10px] text-[#ffffff] drop-shadow-md">
        {/* Left: 10 Hearts */}
        <div className="flex items-center gap-0.5">
          {[...Array(heartCount)].map((_, i) => (
            <span key={i} className="text-red-500 text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              ♥
            </span>
          ))}
        </div>

        {/* Right: 10 Energy Pips & Counter */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(energyPipCount)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < activeEnergyPips ? "text-[#ffd54f]" : "text-[#555]"
                } drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}
              >
                ⚡
              </span>
            ))}
          </div>
          <span className="font-mono font-bold text-[10px] text-[#ffd54f]">
            {Math.round(energy)}/{maxEnergy}
          </span>
        </div>
      </div>

      {/* Main 9-Slot Minecraft Beveled Hotbar Frame */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#2b2b2b]/95 border-3 border-[#3c3c3c] rounded-xl shadow-2xl backdrop-blur-md">
        {/* Compact Gold Coin Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1e1e1e] rounded-lg border-2 border-[#444] text-[#ffd54f] font-bold text-xs shadow-inner">
          <Coins className="w-3.5 h-3.5 text-[#ffd54f]" />
          <span>{goldCoins}g</span>
        </div>

        {/* 9 Hotbar Slots */}
        <div className="flex gap-1">
          {[...Array(9)].map((_, idx) => {
            const slot = inventory[idx];
            const isSelected = selectedSlotIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playUIClick();
                  onSelectSlot(idx);
                }}
                className={`relative w-11 h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#4a4a4a] border-2 border-[#ffffff] scale-105 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    : "bg-[#333333] border-2 border-[#222222] hover:border-[#666]"
                }`}
                title={slot ? `${slot.item.name} (Key ${idx + 1})` : `Slot ${idx + 1}`}
              >
                {/* Slot Number in Top-Left */}
                <span className="absolute top-0.5 left-1 text-[8px] font-mono font-bold text-[#888] pointer-events-none">
                  {idx + 1}
                </span>

                {slot ? (
                  <div className="relative w-full h-full flex items-center justify-center p-1">
                    <ItemIcon item={slot.item} size="md" />
                    {slot.quantity > 1 && (
                      <span className="absolute bottom-0 right-0.5 text-[#ffffff] font-mono font-extrabold text-[10px] drop-shadow-[1px_1px_0px_#000000]">
                        {slot.quantity}
                      </span>
                    )}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


