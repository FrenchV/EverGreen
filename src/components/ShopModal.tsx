import React, { useState } from "react";
import { Item } from "../types";
import { ItemIcon } from "./ItemIcon";
import { audioEngine } from "../engine/audioEngine";
import { ALL_ITEMS } from "../data/items";
import { ShoppingBag, Coins, X, Check, ArrowRightLeft } from "lucide-react";

interface ShopModalProps {
  shopTitle: string;
  shopOwner: string;
  shopType: "store" | "tavern" | "blacksmith";
  goldCoins: number;
  inventory: Array<{ item: Item; quantity: number }>;
  onBuyItem: (item: Item, cost: number) => void;
  onSellItem: (slotIndex: number, earning: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  shopTitle,
  shopOwner,
  shopType,
  goldCoins,
  inventory,
  onBuyItem,
  onSellItem,
  onClose
}) => {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [notification, setNotification] = useState<string | null>(null);

  // Shop catalog depending on shop type
  const availableItems: Item[] =
    shopType === "store"
      ? [
          ALL_ITEMS.farming_hoe,
          ALL_ITEMS.watering_can,
          ALL_ITEMS.fishing_rod,
          ALL_ITEMS.strawberry_seeds,
          ALL_ITEMS.wheat_seeds,
          ALL_ITEMS.pumpkin_seeds,
          ALL_ITEMS.chamomile_tea
        ]
      : shopType === "tavern"
      ? [
          ALL_ITEMS.spiced_cider,
          ALL_ITEMS.honey_bread,
          ALL_ITEMS.chamomile_tea,
          ALL_ITEMS.wild_berries
        ]
      : [
          ALL_ITEMS.iron_ore,
          ALL_ITEMS.oak_timber,
          ALL_ITEMS.farming_hoe
        ];

  const handleBuy = (item: Item) => {
    const cost = item.buyPrice || 50;
    if (goldCoins < cost) {
      audioEngine.playUIClick();
      setNotification("Not enough gold coins!");
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    audioEngine.playItemPickup();
    onBuyItem(item, cost);
    setNotification(`Purchased ${item.name}!`);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleSell = (slotIndex: number) => {
    const slot = inventory[slotIndex];
    if (!slot) return;
    const price = slot.item.sellPrice || 10;
    audioEngine.playItemPickup();
    onSellItem(slotIndex, price);
    setNotification(`Sold ${slot.item.name} for +${price}g!`);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#fcf8e3] border-[6px] border-[#4a2e19] rounded-[32px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d351d] border-b-4 border-[#14180d] text-[#fefae0]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#ffd180]" />
            <div>
              <h2 className="text-xl font-bold font-serif italic text-[#fefae0]">
                {shopTitle}
              </h2>
              <span className="text-xs text-[#a3b18a] font-sans">
                Proprietor: {shopOwner}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fefae0] rounded-xl border-2 border-[#4a2e19] text-[#4a2e19] font-bold text-xs shadow-inner">
              <Coins className="w-4 h-4 text-[#f27d26]" />
              <span>{goldCoins}g</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-[#4a2e19] hover:bg-[#3e2723] text-[#fefae0] rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#e9edc9] p-1.5 border-b-2 border-[#ccd5ae]">
          <button
            onClick={() => setTab("buy")}
            className={`flex-1 py-2 font-serif font-bold text-sm rounded-xl transition-all cursor-pointer ${
              tab === "buy"
                ? "bg-[#4a2e19] text-[#fefae0] shadow"
                : "text-[#4a2e19] hover:bg-[#ccd5ae]"
            }`}
          >
            Buy Goods & Seeds
          </button>
          <button
            onClick={() => setTab("sell")}
            className={`flex-1 py-2 font-serif font-bold text-sm rounded-xl transition-all cursor-pointer ${
              tab === "sell"
                ? "bg-[#4a2e19] text-[#fefae0] shadow"
                : "text-[#4a2e19] hover:bg-[#ccd5ae]"
            }`}
          >
            Sell Produce & Loot
          </button>
        </div>

        {/* Notification Pill */}
        {notification && (
          <div className="mx-6 mt-3 px-4 py-2 bg-[#43a047] text-white text-xs font-bold rounded-xl text-center shadow animate-bounce">
            {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === "buy" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {availableItems.map(item => {
                const cost = item.buyPrice || 50;
                const canAfford = goldCoins >= cost;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-[#4a2e19] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#e9edc9] border border-[#4a2e19]/30 flex items-center justify-center shadow-inner">
                        <ItemIcon item={item} size="lg" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-[#4a2e19]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#795548] line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:translate-y-0.5 ${
                        canAfford
                          ? "bg-[#ffd180] hover:bg-[#ffb74d] text-[#4a2e19] border-2 border-[#4a2e19]"
                          : "bg-gray-300 text-gray-500 border border-gray-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-[#f27d26]" />
                      <span>{cost}g</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {inventory.length === 0 ? (
                <div className="py-12 text-center text-[#795548] text-sm font-serif">
                  Your inventory bag is currently empty! Go forage herbs or harvest crops to sell them here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {inventory.map((slot, idx) => {
                    const price = slot.item.sellPrice || 10;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-[#e9edc9] border border-[#4a2e19]/30 flex items-center justify-center shadow-inner">
                            <ItemIcon item={slot.item} size="lg" />
                            <span className="absolute -bottom-1 -right-1 bg-[#4a2e19] text-[#fefae0] text-[10px] font-bold px-1.5 rounded-full">
                              x{slot.quantity}
                            </span>
                          </div>
                          <div>
                            <p className="font-serif font-bold text-sm text-[#4a2e19]">
                              {slot.item.name}
                            </p>
                            <p className="text-[11px] text-[#795548]">
                              Sell 1 for <span className="font-bold text-[#f27d26]">+{price}g</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSell(idx)}
                          className="px-3.5 py-2 bg-[#43a047] hover:bg-[#2e7d32] active:translate-y-0.5 text-white font-bold text-xs rounded-xl shadow border-b-2 border-r-2 border-[#1b5e20] cursor-pointer"
                        >
                          Sell (+{price}g)
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
