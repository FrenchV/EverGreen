import React from "react";
import { ALL_ITEMS } from "../data/items";
import { Item } from "../types";
import { ItemIcon } from "./ItemIcon";
import { audioEngine } from "../engine/audioEngine";
import { X, Sparkles, Flame, Hammer, Beaker, Wine, ShieldCheck, Heart, Award, ArrowRight } from "lucide-react";

export type StationType = "cooking" | "forge" | "herbalism" | "tiki" | "aquarium" | "townhall" | "wishing_well";

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: Array<{ itemId: string; count: number; name: string }>;
  goldCost?: number;
  outputItem?: Item;
  outputGold?: number;
  outputXP?: { skill: string; amount: number };
  buffText?: string;
}

const RECIPES_BY_STATION: Record<StationType, { title: string; subtitle: string; icon: any; recipes: Recipe[] }> = {
  cooking: {
    title: "Kitchen Hearth & Cast Iron Stove",
    subtitle: "Cook delicious homestead dishes using fresh farm produce & forage",
    icon: Flame,
    recipes: [
      {
        id: "cook_jam",
        name: "Artisan Strawberry Jam",
        description: "Sweet, thick strawberry preserve simmered in a copper pot. (+45 Energy)",
        category: "Preserves",
        ingredients: [{ itemId: "fresh_strawberry", count: 2, name: "Fresh Strawberry" }],
        outputItem: {
          id: "strawberry_jam",
          name: "Strawberry Jam",
          description: "Freshly jarred sweet valley strawberry jam.",
          category: "food",
          color: "#d32f2f",
          iconType: "jam",
          sellPrice: 90,
          healEnergy: 45
        },
        outputXP: { skill: "farming", amount: 30 }
      },
      {
        id: "cook_tart",
        name: "Wild Berry Crumble Tart",
        description: "Crispy honey pastry filled with bubbling wild forest berries. (+60 Energy)",
        category: "Bakery",
        ingredients: [
          { itemId: "wild_berries", count: 2, name: "Wild Berries" },
          { itemId: "golden_wheat", count: 1, name: "Golden Wheat" }
        ],
        outputItem: {
          id: "berry_tart",
          name: "Berry Crumble Tart",
          description: "A golden-crusted tart loaded with juicy valley berries.",
          category: "food",
          color: "#ad1457",
          iconType: "tart",
          sellPrice: 110,
          healEnergy: 60
        },
        outputXP: { skill: "farming", amount: 40 }
      },
      {
        id: "cook_chowder",
        name: "Seafood Chowder",
        description: "Creamy fisherman's chowder infused with fresh lake trout & mint. (+75 Energy)",
        category: "Soups",
        ingredients: [
          { itemId: "rainbow_trout", count: 1, name: "Rainbow Trout" },
          { itemId: "river_mint", count: 1, name: "River Mint" }
        ],
        outputItem: {
          id: "seafood_chowder",
          name: "Seafood Chowder",
          description: "Hot, nourishing fish chowder that restores major stamina.",
          category: "food",
          color: "#4dd0e1",
          iconType: "chowder",
          sellPrice: 150,
          healEnergy: 75
        },
        outputXP: { skill: "fishing", amount: 50 }
      },
      {
        id: "cook_tea",
        name: "Chamomile Honey Brew",
        description: "Steeped floral infusion with river mint and golden honey. (+35 Energy)",
        category: "Beverages",
        ingredients: [
          { itemId: "chamomile_tea", count: 1, name: "Chamomile Tea" },
          { itemId: "river_mint", count: 1, name: "River Mint" }
        ],
        outputItem: ALL_ITEMS.chamomile_tea,
        outputXP: { skill: "foraging", amount: 20 }
      }
    ]
  },
  forge: {
    title: "Elara's Smelting Furnace & Master Anvil",
    subtitle: "Smelt raw mountain ores and forge tool upgrades",
    icon: Hammer,
    recipes: [
      {
        id: "smelt_iron",
        name: "Smelt Refined Iron Ingot",
        description: "Purify raw iron ore in the roaring furnace into dense structural ingots.",
        category: "Smelting",
        ingredients: [{ itemId: "iron_ore", count: 2, name: "Iron Ore" }],
        outputItem: {
          id: "iron_ingot",
          name: "Refined Iron Ingot",
          description: "A heavy bar of high-grade smelted valley iron.",
          category: "mineral",
          color: "#cfd8dc",
          iconType: "ingot",
          sellPrice: 120,
          buyPrice: 200
        },
        outputXP: { skill: "mining", amount: 35 }
      },
      {
        id: "upgrade_hoe",
        name: "Forge Reinforced Golden Hoe",
        description: "Upgrade your farming hoe to till larger ground patches with minimal energy cost.",
        category: "Tool Upgrade",
        ingredients: [{ itemId: "iron_ore", count: 2, name: "Iron Ore" }],
        goldCost: 75,
        outputItem: {
          id: "farming_hoe",
          name: "Master Forged Hoe",
          description: "A reinforced iron-steel hoe crafted at Elara's smithy.",
          category: "tool",
          color: "#ffd54f",
          iconType: "hoe",
          sellPrice: 150
        },
        outputXP: { skill: "farming", amount: 60 }
      },
      {
        id: "upgrade_rod",
        name: "Forge Titanium Lure Rod",
        description: "Reinforce your fishing pole with steel-braided line for faster bite rates.",
        category: "Tool Upgrade",
        ingredients: [
          { itemId: "oak_timber", count: 2, name: "Oak Timber" },
          { itemId: "iron_ore", count: 1, name: "Iron Ore" }
        ],
        goldCost: 90,
        outputItem: {
          id: "fishing_rod",
          name: "Titanium Lure Rod",
          description: "A high-performance fishing rod crafted by Elara.",
          category: "tool",
          color: "#4fc3f7",
          iconType: "fishing_rod",
          sellPrice: 200
        },
        outputXP: { skill: "fishing", amount: 60 }
      }
    ]
  },
  herbalism: {
    title: "Mira's Cauldron & Herbal Apothecary",
    subtitle: "Distill wild forest botanicals into potent vitality salves & elixirs",
    icon: Beaker,
    recipes: [
      {
        id: "brew_vitality",
        name: "Mira's Vitality Elixir",
        description: "A glowing azure tonic distilled from starflowers and river mint. (+80 Energy)",
        category: "Potions",
        ingredients: [
          { itemId: "starflower", count: 1, name: "Starflower" },
          { itemId: "river_mint", count: 2, name: "River Mint" }
        ],
        outputItem: {
          id: "vitality_elixir",
          name: "Vitality Elixir",
          description: "Potent herbal extract that revitalizes exhausted travelers.",
          category: "food",
          color: "#00e676",
          iconType: "potion",
          sellPrice: 130,
          healEnergy: 80
        },
        outputXP: { skill: "foraging", amount: 45 }
      },
      {
        id: "brew_salve",
        name: "Soothing Glowmoss Salve",
        description: "A restorative herbal balm prized by Dr. Silas for treating minor aches.",
        category: "Remedies",
        ingredients: [
          { itemId: "glowmoss", count: 2, name: "Glowmoss" },
          { itemId: "river_mint", count: 1, name: "River Mint" }
        ],
        outputItem: {
          id: "soothing_salve",
          name: "Soothing Glowmoss Balm",
          description: "A gentle medicinal salve with a calm mint aroma.",
          category: "food",
          color: "#aed581",
          iconType: "salve",
          sellPrice: 95,
          healEnergy: 50
        },
        outputXP: { skill: "social", amount: 30 }
      }
    ]
  },
  tiki: {
    title: "Maya's Tiki Smoothie Blender",
    subtitle: "Blend iced tropical coconut smoothies and sparkling shoreline drinks",
    icon: Wine,
    recipes: [
      {
        id: "tiki_punch",
        name: "Maya's Sparkling Luau Punch",
        description: "Chilled tropical coconut water blended with starflowers. (+65 Energy)",
        category: "Tropical Drinks",
        ingredients: [
          { itemId: "tropical_coconut", count: 1, name: "Tropical Coconut" },
          { itemId: "starflower", count: 1, name: "Starflower" }
        ],
        outputItem: {
          id: "tiki_punch",
          name: "Sparkling Luau Punch",
          description: "Chilled tropical coconut punch served in a carved shell.",
          category: "food",
          color: "#ff80ab",
          iconType: "punch",
          sellPrice: 115,
          healEnergy: 65
        },
        outputXP: { skill: "foraging", amount: 35 }
      },
      {
        id: "coconut_smoothie",
        name: "Iced Berry Coconut Smoothie",
        description: "Creamy coconut milk whipped with sweet wild forest berries. (+55 Energy)",
        category: "Tropical Drinks",
        ingredients: [
          { itemId: "tropical_coconut", count: 1, name: "Tropical Coconut" },
          { itemId: "wild_berries", count: 2, name: "Wild Berries" }
        ],
        outputItem: {
          id: "coconut_smoothie",
          name: "Berry Coconut Smoothie",
          description: "A refreshing blended smoothie with thick coconut foam.",
          category: "food",
          color: "#f06292",
          iconType: "cup",
          sellPrice: 100,
          healEnergy: 55
        },
        outputXP: { skill: "foraging", amount: 30 }
      }
    ]
  },
  aquarium: {
    title: "Marina's Coral Reef Habitat Sanctuary",
    subtitle: "Donate shoreline discoveries to preserve Evergreen's coastal biodiversity",
    icon: Sparkles,
    recipes: [
      {
        id: "donate_starfish",
        name: "Sanctuary Starfish Care",
        description: "Release a vibrant purple starfish into the protected tidal habitat.",
        category: "Ecology Donation",
        ingredients: [{ itemId: "starfish", count: 1, name: "Starfish" }],
        outputGold: 70,
        outputXP: { skill: "fishing", amount: 45 },
        buffText: "Marina logged your marine donation! Earned 70g & +45 Fishing/Ecology XP."
      },
      {
        id: "donate_seashells",
        name: "Tidepool Shell Bedding",
        description: "Contribute spiral seashells to build living substrate for young coral polyps.",
        category: "Ecology Donation",
        ingredients: [{ itemId: "seashell", count: 2, name: "Seashell" }],
        outputGold: 60,
        outputXP: { skill: "fishing", amount: 35 },
        buffText: "Added shell habitat! Earned 60g & +35 Fishing XP."
      },
      {
        id: "donate_seaglass",
        name: "Shoreline Glass Reclamation",
        description: "Hand over tumbled sea glass to help clean and protect the ocean reefs.",
        category: "Ecology Donation",
        ingredients: [{ itemId: "sea_glass", count: 2, name: "Sea Glass" }],
        outputGold: 55,
        outputXP: { skill: "foraging", amount: 35 },
        buffText: "Reclaimed shoreline glass! Earned 55g & +35 Foraging XP."
      }
    ]
  },
  townhall: {
    title: "Evergreen Civic Council & Mayor's Desk",
    subtitle: "Claim daily resident stipends and review valley municipal affairs",
    icon: Award,
    recipes: [
      {
        id: "claim_stipend",
        name: "Claim Daily Valley Resident Stipend",
        description: "Mayor Cora's civic fund grants a daily 35g allowance to support local development.",
        category: "Civic Aid",
        ingredients: [],
        outputGold: 35,
        outputXP: { skill: "social", amount: 25 },
        buffText: "Received official town stipend of 35g from Mayor Cora!"
      },
      {
        id: "timber_contribution",
        name: "Bridge Restoration Wood Fund",
        description: "Donate 2 oak timber toward maintaining the river bridges and public piers.",
        category: "Public Works",
        ingredients: [{ itemId: "oak_timber", count: 2, name: "Oak Timber" }],
        outputGold: 75,
        outputXP: { skill: "social", amount: 50 },
        buffText: "Donated timber for public bridges! Earned 75g & +50 Social XP."
      }
    ]
  },
  wishing_well: {
    title: "Town Square Wishing Well",
    subtitle: "Toss a gold coin into the ancient crystal fountain for good fortune",
    icon: Heart,
    recipes: [
      {
        id: "toss_coin",
        name: "Make a Serene Wish (Toss 10g)",
        description: "The glimmering mountain waters ripple with tranquil energy. Restores +25 Energy!",
        category: "Wishes",
        ingredients: [],
        goldCost: 10,
        outputXP: { skill: "social", amount: 20 },
        buffText: "✨ The crystal well sparkles! Restored +25 Energy & received good fortune."
      }
    ]
  }
};

interface CraftingStationModalProps {
  stationType: StationType;
  inventory: Array<{ item: Item; quantity: number }>;
  goldCoins: number;
  onCraft: (recipe: Recipe) => void;
  onClose: () => void;
}

export const CraftingStationModal: React.FC<CraftingStationModalProps> = ({
  stationType,
  inventory,
  goldCoins,
  onCraft,
  onClose
}) => {
  const station = RECIPES_BY_STATION[stationType];
  const IconComponent = station.icon;

  const checkCanCraft = (recipe: Recipe) => {
    if (recipe.goldCost && goldCoins < recipe.goldCost) return false;
    for (const ing of recipe.ingredients) {
      const slot = inventory.find(s => s.item.id === ing.itemId);
      if (!slot || slot.quantity < ing.count) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#2b2b2b] border-4 border-[#3c3c3c] rounded-2xl shadow-2xl overflow-hidden font-sans text-[#e0e0e0]">
        {/* Minecraft Style Beveled Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1e1e1e] border-b-3 border-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#373737] border-2 border-[#555] flex items-center justify-center shadow-inner">
              <IconComponent className="w-5 h-5 text-[#ffd54f]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide text-[#ffffff] flex items-center gap-2">
                {station.title}
              </h2>
              <p className="text-[11px] text-[#aaaaaa] font-medium">{station.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playUIClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg bg-[#373737] hover:bg-[#4f4f4f] active:translate-y-0.5 border-2 border-[#555] text-[#ccc] hover:text-[#fff] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recipes Grid */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {station.recipes.map(recipe => {
            const canCraft = checkCanCraft(recipe);

            return (
              <div
                key={recipe.id}
                className={`p-3.5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  canCraft
                    ? "bg-[#333333] border-[#4a4a4a] hover:border-[#777]"
                    : "bg-[#252525] border-[#333333] opacity-75"
                }`}
              >
                {/* Recipe Left: Icon & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#1e1e1e] border-2 border-[#444] flex items-center justify-center shrink-0 shadow-inner">
                    {recipe.outputItem ? (
                      <ItemIcon item={recipe.outputItem} size="md" />
                    ) : (
                      <IconComponent className="w-6 h-6 text-[#ffd54f]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#ffffff] truncate">{recipe.name}</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e1e1e] text-[#81c784] font-semibold border border-[#333]">
                        {recipe.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#b0b0b0] mt-0.5 leading-snug">{recipe.description}</p>

                    {/* Required Ingredients */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Requires:</span>
                      {recipe.ingredients.length === 0 && !recipe.goldCost && (
                        <span className="text-[11px] text-[#81c784] font-medium">Free / Daily Action</span>
                      )}
                      {recipe.goldCost && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                            goldCoins >= recipe.goldCost
                              ? "bg-[#1e1e1e] text-[#ffd54f] border-[#444]"
                              : "bg-[#3e2723] text-[#ff8a80] border-[#d32f2f]"
                          }`}
                        >
                          {recipe.goldCost} Gold
                        </span>
                      )}
                      {recipe.ingredients.map(ing => {
                        const userSlot = inventory.find(s => s.item.id === ing.itemId);
                        const userHas = userSlot ? userSlot.quantity : 0;
                        const isEnough = userHas >= ing.count;

                        return (
                          <span
                            key={ing.itemId}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                              isEnough
                                ? "bg-[#1e1e1e] text-[#a5d6a7] border-[#388e3c]/50"
                                : "bg-[#3e2723] text-[#ef9a9a] border-[#b71c1c]/50"
                            }`}
                          >
                            {ing.name}: {userHas}/{ing.count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Craft Button */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => {
                      if (!canCraft) return;
                      audioEngine.playItemPickup();
                      onCraft(recipe);
                    }}
                    disabled={!canCraft}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md border-b-2 border-r-2 transition-all cursor-pointer ${
                      canCraft
                        ? "bg-[#388e3c] hover:bg-[#2e7d32] active:translate-y-0.5 text-white border-[#1b5e20]"
                        : "bg-[#424242] text-[#888] border-[#212121] cursor-not-allowed"
                    }`}
                  >
                    <span>{recipe.outputGold ? "Contribute" : recipe.goldCost ? "Forge" : "Prepare"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-[#1e1e1e] border-t-2 border-[#121212] flex items-center justify-between text-xs text-[#888]">
          <span>Your Gold: <strong className="text-[#ffd54f]">{goldCoins}g</strong></span>
          <span className="text-[11px]">Items stored in your inventory are automatically detected.</span>
        </div>
      </div>
    </div>
  );
};
