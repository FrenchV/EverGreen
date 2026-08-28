import React, { useEffect, useState, useCallback, useRef } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { DialogueBox } from "./components/DialogueBox";
import { WorldClockWidget } from "./components/WorldClockWidget";
import { InventoryBar } from "./components/InventoryBar";
import { VillagerJournal } from "./components/VillagerJournal";
import { NoticeBoardModal } from "./components/NoticeBoardModal";
import { HelpControlsModal } from "./components/HelpControlsModal";
import { ShopModal } from "./components/ShopModal";
import { audioEngine } from "./engine/audioEngine";
import { INITIAL_FORAGE_NODES, INITIAL_QUESTS } from "./data/worldData";
import { ALL_ITEMS } from "./data/items";
import { INTERIORS } from "./data/interiors";
import { Book, Pin, HelpCircle, Music, Volume2, VolumeX, Sparkles, RefreshCw, ShoppingBag, Home, Award, Heart, Flame, Radio } from "lucide-react";
import { SleepModal } from "./components/SleepModal";
import { LevelUpModal } from "./components/LevelUpModal";
import { DailyFortuneModal } from "./components/DailyFortuneModal";
import { CraftingStationModal, StationType } from "./components/CraftingStationModal";
import { CropState, FarmTile, ForageNode, InteriorRoom, Item, NPCState, Quest, SeasonType, WeatherType, SkillProgress, FarmPet, FloatingPop, DailyFortune } from "./types";

export function App() {
  // World Clock & Environment
  const [day, setDay] = useState(1);
  const [season, setSeason] = useState<SeasonType>("Spring");
  const [gameTimeMinutes, setGameTimeMinutes] = useState(480); // Starts at 8:00 AM
  const [weather, setWeather] = useState<WeatherType>("Sunny");
  const [isTimePaused, setIsTimePaused] = useState(false);

  // Player Stats
  const [energy, setEnergy] = useState(100);
  const maxEnergy = 100;
  const [goldCoins, setGoldCoins] = useState(250);

  // Skills & Progression System
  const [skills, setSkills] = useState<Record<"farming" | "foraging" | "fishing" | "social", SkillProgress>>({
    farming: { level: 1, currentXp: 0, nextLevelXp: 100 },
    foraging: { level: 1, currentXp: 0, nextLevelXp: 100 },
    fishing: { level: 1, currentXp: 0, nextLevelXp: 100 },
    social: { level: 1, currentXp: 0, nextLevelXp: 100 }
  });

  // Level Up Celebratory Modal State
  const [activeLevelUp, setActiveLevelUp] = useState<{
    skill: "farming" | "foraging" | "fishing" | "social";
    level: number;
    perks: string[];
  } | null>(null);

  // Farm Pet (Mochi the Calico Cat)
  const [pet, setPet] = useState<FarmPet>({
    id: "pet_mochi",
    name: "Mochi",
    species: "cat",
    x: 440,
    y: 430,
    targetX: 440,
    targetY: 430,
    direction: "down",
    isMoving: false,
    hearts: 2,
    isPurring: false
  });

  // Daily Fortune Almanac State
  const [todayFortune, setTodayFortune] = useState<DailyFortune>({
    luckRating: "Joyous",
    title: "The Golden Harvest Blessing",
    description: "The valley spirits are humming with warmth. Crops ripen fast and fish are eager to bite!",
    bonus: "+25% Crop Harvest Yield & High Fishing Luck"
  });

  // Floating Popups list
  const [floatingPops, setFloatingPops] = useState<FloatingPop[]>([]);

  // Modals
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showFortuneModal, setShowFortuneModal] = useState(false);
  const [activeCraftingStation, setActiveCraftingStation] = useState<StationType | null>(null);

  // Interior Navigation State
  const [currentInteriorId, setCurrentInteriorId] = useState<string | null>(null);

  // Initial Farm Plots (near Farmhouse x: 420-620, y: 780-920 => tile coordinates)
  const [farmTiles, setFarmTiles] = useState<FarmTile[]>([
    { id: "farm_0_0", tileX: 14, tileY: 25, tilled: true, watered: false, crop: { cropId: "strawberry_seeds", name: "Strawberry", stage: 1, maxStages: 3, harvestItemId: "fresh_strawberry" } },
    { id: "farm_1_0", tileX: 15, tileY: 25, tilled: true, watered: true, crop: { cropId: "wheat_seeds", name: "Wheat", stage: 2, maxStages: 3, harvestItemId: "golden_wheat" } },
    { id: "farm_2_0", tileX: 16, tileY: 25, tilled: true, watered: false, crop: { cropId: "pumpkin_seeds", name: "Pumpkin", stage: 3, maxStages: 3, harvestItemId: "sweet_pumpkin" } },
    { id: "farm_0_1", tileX: 14, tileY: 26, tilled: true, watered: false },
    { id: "farm_1_1", tileX: 15, tileY: 26, tilled: true, watered: false },
    { id: "farm_2_1", tileX: 16, tileY: 26, tilled: false, watered: false },
    { id: "farm_0_2", tileX: 14, tileY: 27, tilled: false, watered: false },
    { id: "farm_1_2", tileX: 15, tileY: 27, tilled: false, watered: false },
    { id: "farm_2_2", tileX: 16, tileY: 27, tilled: false, watered: false }
  ]);

  // Full NPC roster state
  const [npcs, setNpcs] = useState<NPCState[]>([
    {
      id: "mira",
      name: "Mira",
      title: "Village Herbalist",
      x: 460,
      y: 1280,
      targetX: 460,
      targetY: 1280,
      direction: "down",
      isMoving: false,
      speed: 1.6,
      currentActivity: "Tending Chamomile Garden",
      currentLocationName: "Herbalist Cottage",
      color: "#2e7d32",
      secondaryColor: "#81c784",
      hairColor: "#5d4037",
      friendshipPoints: 10,
      hearts: 0,
      trustLevel: "Stranger",
      currentEmotion: "warm"
    },
    {
      id: "elara",
      name: "Elara",
      title: "Master Blacksmith",
      x: 1880,
      y: 520,
      targetX: 1880,
      targetY: 520,
      direction: "down",
      isMoving: false,
      speed: 1.7,
      currentActivity: "Heating the Stone Forge",
      currentLocationName: "Smithy & Forge",
      color: "#b71c1c",
      secondaryColor: "#ff7043",
      hairColor: "#37474f",
      friendshipPoints: 10,
      hearts: 0,
      trustLevel: "Stranger",
      currentEmotion: "neutral"
    },
    {
      id: "rowan",
      name: "Rowan",
      title: "Tavern Keeper",
      x: 1580,
      y: 830,
      targetX: 1580,
      targetY: 830,
      direction: "down",
      isMoving: false,
      speed: 1.5,
      currentActivity: "Baking Honey Breads",
      currentLocationName: "The Sleeping Fox Tavern",
      color: "#e65100",
      secondaryColor: "#ffd54f",
      hairColor: "#d84315",
      friendshipPoints: 10,
      hearts: 0,
      trustLevel: "Stranger",
      currentEmotion: "warm"
    },
    {
      id: "silas",
      name: "Silas",
      title: "Town Doctor & Scholar",
      x: 840,
      y: 460,
      targetX: 840,
      targetY: 460,
      direction: "down",
      isMoving: false,
      speed: 1.4,
      currentActivity: "Preparing Herbal Salves",
      currentLocationName: "Apothecary Clinic",
      color: "#1565c0",
      secondaryColor: "#90caf9",
      hairColor: "#78909c",
      friendshipPoints: 10,
      hearts: 0,
      trustLevel: "Stranger",
      currentEmotion: "thoughtful"
    },
    {
      id: "finn",
      name: "Finn",
      title: "Village Carpenter",
      x: 1420,
      y: 1360,
      targetX: 1420,
      targetY: 1360,
      direction: "down",
      isMoving: false,
      speed: 1.8,
      currentActivity: "Planing Cedar Beams",
      currentLocationName: "Carpentry Workshop",
      color: "#ff8f00",
      secondaryColor: "#ffe082",
      hairColor: "#f57f17",
      friendshipPoints: 10,
      hearts: 0,
      trustLevel: "Stranger",
      currentEmotion: "excited"
    },
    {
      id: "cora",
      name: "Cora",
      title: "Town Mayor",
      x: 1200,
      y: 540,
      targetX: 1200,
      targetY: 540,
      direction: "down",
      isMoving: false,
      speed: 1.3,
      currentActivity: "Reviewing Valley Manifests",
      currentLocationName: "Evergreen Town Hall",
      color: "#6a1b9a",
      secondaryColor: "#e1bee7",
      hairColor: "#424242",
      friendshipPoints: 10,
      hearts: 0,
      trustLevel: "Stranger",
      currentEmotion: "neutral"
    }
  ]);

  const [npcProfiles, setNpcProfiles] = useState<any[]>([]);

  // Starting Inventory (Tools + Seeds + Refreshment)
  const [inventory, setInventory] = useState<Array<{ item: Item; quantity: number }>>([
    { item: ALL_ITEMS.farming_hoe, quantity: 1 },
    { item: ALL_ITEMS.watering_can, quantity: 1 },
    { item: ALL_ITEMS.fishing_rod, quantity: 1 },
    { item: ALL_ITEMS.strawberry_seeds, quantity: 3 },
    { item: ALL_ITEMS.river_mint, quantity: 2 },
    { item: ALL_ITEMS.chamomile_tea, quantity: 2 }
  ]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  // World Foraging & Quests
  const [forageNodes, setForageNodes] = useState<ForageNode[]>(INITIAL_FORAGE_NODES);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  // Active Modals & Dialogue
  const [activeDialogueNpcId, setActiveDialogueNpcId] = useState<string | null>(null);
  const [showJournal, setShowJournal] = useState(false);
  const [showNoticeBoard, setShowNoticeBoard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeShop, setActiveShop] = useState<{
    title: string;
    owner: string;
    type: "store" | "tavern" | "blacksmith";
  } | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial NPC backend data
  const refreshNPCData = useCallback(() => {
    fetch("/api/npcs")
      .then(res => res.json())
      .then(data => {
        if (data.npcs) {
          setNpcProfiles(data.npcs);
          setNpcs(prev =>
            prev.map(n => {
              const serverNpc = data.npcs.find((sn: any) => sn.id === n.id);
              if (serverNpc && serverNpc.relationship) {
                return {
                  ...n,
                  friendshipPoints: serverNpc.relationship.friendshipPoints,
                  hearts: serverNpc.relationship.hearts,
                  trustLevel: serverNpc.relationship.trustLevel
                };
              }
              return n;
            })
          );
        }
      })
      .catch(err => console.warn("Failed to fetch initial NPCs:", err));
  }, []);

  useEffect(() => {
    refreshNPCData();
  }, [refreshNPCData]);

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Spawn animated floating popup text
  const spawnFloatingPop = useCallback((text: string, x?: number, y?: number, color = "#ffd180") => {
    const newPop: FloatingPop = {
      id: "pop_" + Date.now() + "_" + Math.random().toString(36).slice(2, 5),
      x: x || (currentInteriorId ? 400 : 1200),
      y: y || (currentInteriorId ? 320 : 920),
      text,
      color,
      createdAt: Date.now(),
      duration: 1800
    };
    setFloatingPops(prev => [...prev, newPop]);

    setTimeout(() => {
      setFloatingPops(prev => prev.filter(p => p.id !== newPop.id));
    }, 2000);
  }, [currentInteriorId]);

  // Add Skill XP & Level Check
  const addXP = useCallback((skill: "farming" | "foraging" | "fishing" | "social", amount: number, x?: number, y?: number) => {
    audioEngine.playXpChime();
    const skillLabels: Record<string, string> = {
      farming: "Farming",
      foraging: "Foraging",
      fishing: "Fishing",
      social: "Social"
    };

    spawnFloatingPop(`+${amount} ${skillLabels[skill]} XP`, x, y, "#81c784");

    setSkills(prev => {
      const current = prev[skill];
      let newXp = current.currentXp + amount;
      let newLevel = current.level;
      let nextXp = current.nextLevelXp;

      if (newXp >= nextXp && newLevel < 5) {
        newLevel += 1;
        newXp = newXp - nextXp;
        nextXp = Math.floor(nextXp * 2.2);

        // Perks definitions
        const perksBySkill: Record<string, string[][]> = {
          farming: [
            ["Quick Tiller: 25% faster hoeing", "Green Thumb: +10% crop yields"],
            ["Bountiful Seeds: Chance to yield 2x seeds when harvesting"],
            ["Master Cultivator: Crops grow 1 day faster"],
            ["Ancient Agronomist: Golden crop chance quadrupled!"]
          ],
          foraging: [
            ["Keen Botanist: Spot wild herbs on mini-map", "+5 Max Daily Energy"],
            ["Bountiful Basket: Wild berries yield double count"],
            ["Forest Whisperer: Rare truffles and chanterelles spawn"],
            ["Nature's Kin: Energy cost for chopping and foraging reduced by 50%"]
          ],
          fishing: [
            ["Angler's Eye: Fish bite 30% faster at Whispering Lake"],
            ["Silver Hook: Common fish sell for 25% more gold"],
            ["Deep Waters: Legendary Rainbow Trout and Golden Carp appear"],
            ["Master Fisherman: Perfect catches guarantee 2x reward gold"]
          ],
          social: [
            ["Friendly Demeanor: +50% friendship points from daily chats"],
            ["Gift Connoisseur: Liked gifts receive Loved gift bonuses"],
            ["Heart of Evergreen: Unlock secret village festival lore and rumors"],
            ["Beloved Champion: Town discounts of 20% across all shops"]
          ]
        };

        const unlocked = perksBySkill[skill]?.[newLevel - 2] || ["Mastery increased across valley activities!"];

        audioEngine.playLevelUpFanfare();
        setActiveLevelUp({
          skill,
          level: newLevel,
          perks: unlocked
        });
      }

      return {
        ...prev,
        [skill]: {
          level: newLevel,
          currentXp: newXp,
          nextLevelXp: nextXp
        }
      };
    });
  }, [spawnFloatingPop]);

  // Pet Roaming loop inside Farmhouse
  useEffect(() => {
    const petInterval = setInterval(() => {
      setPet(prev => {
        if (Math.random() < 0.3) {
          // Wander near fireplace rug in Farmhouse (x: 380-500, y: 380-460)
          const targetX = 380 + Math.random() * 120;
          const targetY = 380 + Math.random() * 80;
          return {
            ...prev,
            targetX,
            targetY,
            isMoving: true,
            direction: targetX > prev.x ? "right" : "left"
          };
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(petInterval);
  }, []);

  // Daily Turn Over / Crop Growth Routine
  const advanceDay = useCallback(() => {
    setDay(d => d + 1);
    setEnergy(100);

    // Pick new daily fortune
    const fortunes: DailyFortune[] = [
      { luckRating: "Joyous", title: "The Golden Harvest Blessing", description: "The valley spirits are humming with warmth. Crops ripen fast and fish are eager to bite!", bonus: "+25% Crop Harvest Yield & High Fishing Luck" },
      { luckRating: "Good", title: "Whispering Breeze of Abundance", description: "Mild breezes sweep over Evergreen. Forage nodes are plentiful across the meadow paths.", bonus: "Double wild herb respawns today" },
      { luckRating: "Joyous", title: "Radiant Sun Aura", description: "Clear skies and boundless energy inspire the townsfolk. Villagers are cheerful and receptive.", bonus: "+50% Friendship gains from chatting & gifts" },
      { luckRating: "Neutral", title: "Gentle Morning Dew", description: "A steady, tranquil day in the valley. Perfect for quiet farming and crafting.", bonus: "Standard luck across all activities" }
    ];
    setTodayFortune(fortunes[Math.floor(Math.random() * fortunes.length)]);

    // Respawn foraged items overnight
    setForageNodes(nodes =>
      nodes.map(n => ({ ...n, collected: false }))
    );

    // Advance crops
    setFarmTiles(prev =>
      prev.map(tile => {
        if (tile.crop && tile.watered) {
          const nextStage = Math.min(tile.crop.maxStages, tile.crop.stage + 1);
          return {
            ...tile,
            watered: false, // Soil dries overnight
            crop: { ...tile.crop, stage: nextStage }
          };
        }
        return { ...tile, watered: false };
      })
    );

    showToast(`🌅 Day ${day + 1} has begun! Energy restored to full & crops flourished.`);
  }, [day]);

  // World Clock Simulation Tick
  useEffect(() => {
    if (isTimePaused) return;

    const interval = setInterval(() => {
      setGameTimeMinutes(prev => {
        const next = prev + 1; // 1 real second = 1 game minute
        if (next >= 1440) {
          advanceDay();
          return 360; // 6:00 AM next day
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimePaused, advanceDay]);

  // NPC Autonomous Scheduler & Pathfinding Engine
  useEffect(() => {
    if (npcProfiles.length === 0) return;

    const interval = setInterval(() => {
      setNpcs(prevNpcs =>
        prevNpcs.map(npc => {
          const profile = npcProfiles.find(p => p.id === npc.id);
          if (!profile || !profile.schedule) return npc;

          // Find current schedule slot
          const currentSlot = profile.schedule.find(
            (s: any) => gameTimeMinutes >= s.timeStart && gameTimeMinutes < s.timeEnd
          ) || profile.schedule[0];

          let tx = currentSlot.x;
          let ty = currentSlot.y;

          // Add slight organic roaming offset when at location
          if (Math.random() < 0.05) {
            tx += (Math.random() - 0.5) * 40;
            ty += (Math.random() - 0.5) * 40;
          }

          const dx = tx - npc.x;
          const dy = ty - npc.y;
          const dist = Math.hypot(dx, dy);

          let nx = npc.x;
          let ny = npc.y;
          let isMoving = false;
          let direction = npc.direction;

          if (dist > 6) {
            isMoving = true;
            const moveX = (dx / dist) * npc.speed;
            const moveY = (dy / dist) * npc.speed;
            nx += moveX;
            ny += moveY;

            if (Math.abs(moveX) > Math.abs(moveY)) {
              direction = moveX > 0 ? "right" : "left";
            } else {
              direction = moveY > 0 ? "down" : "up";
            }
          }

          return {
            ...npc,
            x: nx,
            y: ny,
            targetX: tx,
            targetY: ty,
            direction,
            isMoving,
            currentActivity: currentSlot.activity,
            currentLocationName: currentSlot.locationName,
            currentScheduleSlot: currentSlot
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [npcProfiles, gameTimeMinutes]);

  // Farm Tile Interaction (Till, Water, Plant, Harvest)
  const handleFarmTileInteract = (tileId: string, toolOrItemId?: string) => {
    const tile = farmTiles.find(t => t.id === tileId);
    if (!tile) return;

    const activeItem = inventory[selectedSlotIndex]?.item;
    const itemId = activeItem?.id || toolOrItemId;

    // 1. Ready to harvest?
    if (tile.crop && tile.crop.stage >= tile.crop.maxStages) {
      audioEngine.playItemPickup();
      const harvestItem = ALL_ITEMS[tile.crop.harvestItemId] || ALL_ITEMS.fresh_strawberry;

      // Add harvest to inventory
      setInventory(prev => {
        const existing = prev.find(s => s.item.id === harvestItem.id);
        if (existing) {
          return prev.map(s => s.item.id === harvestItem.id ? { ...s, quantity: s.quantity + 2 } : s);
        }
        return [...prev, { item: harvestItem, quantity: 2 }];
      });

      // Clear crop on tile
      setFarmTiles(prev =>
        prev.map(t => t.id === tileId ? { ...t, crop: undefined } : t)
      );

      addXP("farming", 35);
      showToast(`🍓 Harvested 2x ${harvestItem.name}! (+35 Farming XP)`);
      return;
    }

    // 2. Till soil with Hoe
    if (itemId === "farming_hoe") {
      if (energy < 4) {
        showToast("⚠️ Too exhausted! Eat food or sleep to restore energy.");
        return;
      }
      audioEngine.playFootstep("grass");
      setEnergy(e => Math.max(0, e - 4));
      setFarmTiles(prev =>
        prev.map(t => t.id === tileId ? { ...t, tilled: true } : t)
      );
      addXP("farming", 5);
      showToast("🌱 Soil tilled! Ready for seeds.");
      return;
    }

    // 3. Water soil with Watering Can
    if (itemId === "watering_can") {
      if (!tile.tilled) {
        showToast("Till the soil with a Hoe first!");
        return;
      }
      if (energy < 2) {
        showToast("⚠️ Too exhausted! Eat food or sleep to restore energy.");
        return;
      }
      audioEngine.playWaterSplash();
      setEnergy(e => Math.max(0, e - 2));
      setFarmTiles(prev =>
        prev.map(t => t.id === tileId ? { ...t, watered: true } : t)
      );
      addXP("farming", 5);
      showToast("💧 Soil watered! Crops will grow tonight.");
      return;
    }

    // 4. Plant Seeds
    if (activeItem && activeItem.category === "seed") {
      if (!tile.tilled) {
        showToast("Till the soil first before planting!");
        return;
      }
      if (tile.crop) {
        showToast("There is already a crop growing here!");
        return;
      }

      audioEngine.playItemPickup();

      let harvestId = "fresh_strawberry";
      let cropName = "Strawberry";
      if (activeItem.id.includes("wheat")) {
        harvestId = "golden_wheat";
        cropName = "Golden Wheat";
      } else if (activeItem.id.includes("pumpkin")) {
        harvestId = "sweet_pumpkin";
        cropName = "Sweet Pumpkin";
      }

      // Deduct 1 seed
      setInventory(prev =>
        prev
          .map(s => s.item.id === activeItem.id ? { ...s, quantity: s.quantity - 1 } : s)
          .filter(s => s.quantity > 0)
      );

      setFarmTiles(prev =>
        prev.map(t =>
          t.id === tileId
            ? {
                ...t,
                crop: {
                  cropId: activeItem.id,
                  name: cropName,
                  stage: 0,
                  maxStages: 3,
                  harvestItemId: harvestId
                }
              }
            : t
        )
      );

      addXP("farming", 10);
      showToast(`🌱 Planted ${cropName} seeds! Remember to water daily.`);
      return;
    }

    // Default hint
    if (!tile.tilled) {
      showToast("Equip your Sturdy Hoe to till this farm plot.");
    } else if (!tile.crop) {
      showToast("Equip seeds to plant them in this tilled plot.");
    } else {
      showToast(`${tile.crop.name} is growing (Stage ${tile.crop.stage + 1}/4). Keep it watered!`);
    }
  };

  // Forage Collection Handler
  const handleCollectForage = (nodeId: string) => {
    const node = forageNodes.find(n => n.id === nodeId);
    if (!node || node.collected) return;

    audioEngine.playItemPickup();

    // Mark as collected
    setForageNodes(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, collected: true } : n))
    );

    // Add to inventory
    setInventory(prev => {
      const existing = prev.find(slot => slot.item.id === node.item.id);
      if (existing) {
        return prev.map(slot =>
          slot.item.id === node.item.id
            ? { ...slot, quantity: slot.quantity + 1 }
            : slot
        );
      }
      return [...prev, { item: node.item, quantity: 1 }];
    });

    addXP("foraging", 25, node.x, node.y);
    showToast(`🌿 Foraged ${node.item.name}! (+25 Foraging XP)`);
  };

  // Catch Fish Handler
  const handleCatchFish = (fishItem: Item) => {
    setInventory(prev => {
      const existing = prev.find(s => s.item.id === fishItem.id);
      if (existing) {
        return prev.map(s => s.item.id === fishItem.id ? { ...s, quantity: s.quantity + 1 } : s);
      }
      return [...prev, { item: fishItem, quantity: 1 }];
    });
    addXP("fishing", 50, 1800, 1260);
    showToast(`🎣 Reel in success! Caught a prize ${fishItem.name}! (+50 Fishing XP)`);
  };

  // Eat Food / Use Item Handler
  const handleUseItem = (slotIndex: number) => {
    const slot = inventory[slotIndex];
    if (!slot) return;

    if (slot.item.healEnergy) {
      audioEngine.playItemPickup();
      setEnergy(e => Math.min(maxEnergy, e + (slot.item.healEnergy || 25)));

      setInventory(prev =>
        prev
          .map((s, idx) => idx === slotIndex ? { ...s, quantity: s.quantity - 1 } : s)
          .filter(s => s.quantity > 0)
      );

      showToast(`✨ Consumed ${slot.item.name}! Restored +${slot.item.healEnergy} Energy.`);
    }
  };

  // Interactive Hearth Handler
  const handleInteractHearth = () => {
    audioEngine.playFireplaceCrackle();
    audioEngine.playCozyRest();
    setEnergy(e => Math.min(maxEnergy, e + 25));
    spawnFloatingPop("🔥 Restored +25 Energy!", 400, 320, "#ffb74d");
    showToast("🔥 Warmed up by the crackling stone hearth. Energy refreshed!");
  };

  // Interactive Bed Handler
  const handleInteractBed = () => {
    audioEngine.playUIClick();
    setShowSleepModal(true);
  };

  // Confirm Sleep Routine
  const handleConfirmSleep = () => {
    setShowSleepModal(false);
    advanceDay();
    setGameTimeMinutes(360); // 6:00 AM
  };

  // Interactive Daily Fortune Handler
  const handleInteractFortune = () => {
    audioEngine.playNotification();
    setShowFortuneModal(true);
  };

  // Interactive Pet Mochi Handler
  const handleInteractPet = () => {
    audioEngine.playPetPurr();
    addXP("social", 15, pet.x, pet.y);
    setPet(p => ({ ...p, isPurring: true, hearts: Math.min(5, p.hearts + 1) }));
    spawnFloatingPop("❤️ Purr! +15 Social XP", pet.x, pet.y, "#ff8a80");
    showToast("🐾 Pet Mochi! The calico purrs softly and rubs against your boots.");
  };

  // Complete Notice Board Quest
  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status === "completed") return;

    // Deduct items
    if (quest.targetItemId) {
      setInventory(prev =>
        prev
          .map(slot => {
            if (slot.item.id === quest.targetItemId) {
              return {
                ...slot,
                quantity: slot.quantity - (quest.targetItemCount || 1)
              };
            }
            return slot;
          })
          .filter(slot => slot.quantity > 0)
      );
    }

    // Award gold & points
    setGoldCoins(g => g + quest.rewardCoins);
    setQuests(prev =>
      prev.map(q => (q.id === questId ? { ...q, status: "completed" } : q))
    );

    // Update NPC friendship in state
    setNpcs(prev =>
      prev.map(n => {
        if (n.id === quest.requesterId) {
          const newPts = Math.min(100, n.friendshipPoints + quest.rewardPoints);
          return {
            ...n,
            friendshipPoints: newPts,
            hearts: Math.floor(newPts / 20)
          };
        }
        return n;
      })
    );

    addXP("social", 75);
    showToast(
      `🎉 Completed ${quest.title}! Earned ${quest.rewardCoins}g & +${quest.rewardPoints} friendship.`
    );
  };

  // Buy Shop Item Handler
  const handleBuyShopItem = (item: Item, cost: number) => {
    setGoldCoins(g => g - cost);
    setInventory(prev => {
      const existing = prev.find(s => s.item.id === item.id);
      if (existing) {
        return prev.map(s => s.item.id === item.id ? { ...s, quantity: s.quantity + 1 } : s);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  // Sell Item Handler
  const handleSellShopItem = (slotIndex: number, earning: number) => {
    setGoldCoins(g => g + earning);
    setInventory(prev =>
      prev
        .map((s, idx) => idx === slotIndex ? { ...s, quantity: s.quantity - 1 } : s)
        .filter(s => s.quantity > 0)
    );
  };

  // Crafting Station Recipe Execution Handler
  const handleCraftRecipe = (recipe: any) => {
    // Check & deduct gold
    if (recipe.goldCost && recipe.goldCost > 0) {
      if (goldCoins < recipe.goldCost) {
        showToast("⚠️ Not enough gold coins!");
        return;
      }
      setGoldCoins(g => g - recipe.goldCost);
    }

    // Deduct ingredients
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      setInventory(prev => {
        let updated = [...prev];
        for (const ing of recipe.ingredients) {
          let needed = ing.quantity;
          updated = updated
            .map(slot => {
              if (slot.item.id === ing.itemId && needed > 0) {
                const take = Math.min(slot.quantity, needed);
                needed -= take;
                return { ...slot, quantity: slot.quantity - take };
              }
              return slot;
            })
            .filter(slot => slot.quantity > 0);
        }
        return updated;
      });
    }

    // Grant Output Item
    if (recipe.outputItem) {
      setInventory(prev => {
        const existing = prev.find(s => s.item.id === recipe.outputItem.id);
        if (existing) {
          return prev.map(s => s.item.id === recipe.outputItem.id ? { ...s, quantity: s.quantity + (recipe.outputQuantity || 1) } : s);
        }
        return [...prev, { item: recipe.outputItem, quantity: recipe.outputQuantity || 1 }];
      });
    }

    // Grant Output Gold (e.g. Town Hall tax grants or rewards)
    if (recipe.outputGold) {
      setGoldCoins(g => g + recipe.outputGold);
    }

    // Grant Skill XP
    if (recipe.outputXP) {
      addXP(recipe.outputXP.skill, recipe.outputXP.amount);
    }

    // Grant Energy Buff / Floating text
    if (recipe.buffText) {
      spawnFloatingPop(recipe.buffText, 600, 400, "#ffd180");
      showToast(`✨ ${recipe.name}: ${recipe.buffText}`);
    } else {
      showToast(`✨ Crafted ${recipe.name}!`);
    }
  };

  // Mouse wheel listener to cycle hotbar slots 1-9
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't cycle if mouse is over a scrolling modal or open dialogue/journal
      if (activeDialogueNpcId || showJournal || showNoticeBoard || activeShop || activeCraftingStation || showHelp || showSleepModal || showFortuneModal) {
        return;
      }
      setSelectedSlotIndex(prev => {
        const delta = e.deltaY > 0 ? 1 : -1;
        return (prev + delta + 9) % 9;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeDialogueNpcId, showJournal, showNoticeBoard, activeShop, activeCraftingStation, showHelp, showSleepModal, showFortuneModal]);

  // Send Dialogue / Gift to NPC via Backend
  const handleSendMessage = async (text: string, giftItem?: string) => {
    if (!activeDialogueNpcId) throw new Error("No active NPC");

    const hours = Math.floor(gameTimeMinutes / 60);
    const minutes = Math.floor(gameTimeMinutes % 60);
    const timeFormatted = `Day ${day}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    const res = await fetch(`/api/npc/${activeDialogueNpcId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerMessage: text,
        gameTime: timeFormatted,
        weather,
        season,
        giftItem
      })
    });

    const data = await res.json();

    // Deduct gift item if used
    if (giftItem) {
      setInventory(prev =>
        prev
          .map(slot =>
            slot.item.name.toLowerCase() === giftItem.toLowerCase()
              ? { ...slot, quantity: slot.quantity - 1 }
              : slot
          )
          .filter(slot => slot.quantity > 0)
      );
    }

    // Sync state
    setNpcs(prev =>
      prev.map(n => {
        if (n.id === activeDialogueNpcId) {
          return {
            ...n,
            friendshipPoints: data.currentFriendshipPoints,
            hearts: data.currentHearts,
            trustLevel: data.trustLevel,
            currentEmotion: data.emotion,
            recentDialogue: data.reply,
            speechBubble: {
              text: data.reply,
              expiresAt: Date.now() + 8000
            }
          };
        }
        return n;
      })
    );

    addXP("social", giftItem ? 40 : 15);
    refreshNPCData();

    return {
      reply: data.reply,
      emotion: data.emotion,
      sentimentDelta: data.sentimentDelta,
      rumorOrHint: data.rumorOrHint
    };
  };

  // Simulate Social Encounter
  const handleSimulateMeeting = async (npcAId: string, npcBId: string, location: string) => {
    const hours = Math.floor(gameTimeMinutes / 60);
    const minutes = Math.floor(gameTimeMinutes % 60);
    const timeStr = `Day ${day}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    const res = await fetch("/api/npc/simulate-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        npcAId,
        npcBId,
        locationName: location,
        gameTime: timeStr
      })
    });

    const data = await res.json();
    if (data.rumorSummary) {
      showToast(`📢 Rumor: ${data.rumorSummary}`);
    }
    return data;
  };

  // Toggle Background Music
  const handleToggleBGM = () => {
    if (audioEngine.isBGMActive()) {
      audioEngine.stopBGM();
    } else {
      audioEngine.startBGM();
    }
  };

  // Toggle Audio Mute
  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  // Reset Simulation
  const handleResetSimulation = async () => {
    if (window.confirm("Reset all NPC dialogue memories and relationship scores?")) {
      audioEngine.playUIClick();
      await fetch("/api/reset", { method: "POST" });
      refreshNPCData();
      showToast("🔄 Simulation reset to Day 1 fresh state.");
    }
  };

  const activeNpc = npcs.find(n => n.id === activeDialogueNpcId);
  const activeNpcData = npcProfiles.find(p => p.id === activeDialogueNpcId);
  const activeItem = inventory[selectedSlotIndex]?.item || null;
  const currentInterior = currentInteriorId ? INTERIORS[currentInteriorId] : null;

  return (
    <div className="relative w-screen h-screen bg-[#1b1e12] overflow-hidden select-none font-sans">
      {/* 2D Canvas Game World (Exterior & Interiors) */}
      <GameCanvas
        npcs={npcs}
        forageNodes={forageNodes}
        farmTiles={farmTiles}
        activeItem={activeItem}
        currentInterior={currentInterior}
        onEnterInterior={id => {
          setCurrentInteriorId(id);
          showToast(`🏡 Entered ${INTERIORS[id]?.name || "Building"}`);
        }}
        onExitInterior={() => {
          setCurrentInteriorId(null);
          showToast("🌿 Stepped outside into Evergreen valley.");
        }}
        onInteractNPC={id => {
          audioEngine.playUIClick();
          setActiveDialogueNpcId(id);
        }}
        onCollectForage={handleCollectForage}
        onFarmTileInteract={handleFarmTileInteract}
        onCatchFish={handleCatchFish}
        onInteractHearth={handleInteractHearth}
        onInteractBed={handleInteractBed}
        onInteractFortune={handleInteractFortune}
        onInteractPet={handleInteractPet}
        onInteractStation={st => {
          audioEngine.playUIClick();
          setActiveCraftingStation(st as StationType);
        }}
        onSelectHotbarSlot={idx => setSelectedSlotIndex(idx)}
        pet={pet}
        floatingPops={floatingPops}
        gameTimeMinutes={gameTimeMinutes}
        weather={weather}
      />

      {/* Top Left: World Clock & Weather Widget */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <WorldClockWidget
          day={day}
          season={season}
          gameTimeMinutes={gameTimeMinutes}
          weather={weather}
          isPaused={isTimePaused}
          onTogglePause={() => setIsTimePaused(!isTimePaused)}
          onSkipTime={mins => setGameTimeMinutes(m => (m + mins) % 1440)}
          onSetTime={target => setGameTimeMinutes(target)}
        />
      </div>

      {/* Top Right: Action Buttons & Navigation (Minecraft-styled sleek bar) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Interior Exit Quick Button if inside */}
        {currentInterior && (
          <button
            onClick={() => {
              audioEngine.playDoor();
              setCurrentInteriorId(null);
              showToast("🌿 Stepped outside.");
            }}
            className="px-3 py-1.5 bg-[#4a3525] hover:bg-[#5c4330] text-[#ffe082] border-2 border-[#1f150e] rounded-sm font-mono font-bold text-xs flex items-center gap-1.5 shadow-[inset_-2px_-2px_0px_#1f150e,inset_2px_2px_0px_#7c5a41] transition-transform active:translate-y-0.5 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#ffb74d]" />
            <span>Step Outside</span>
          </button>
        )}

        {/* General Store Button */}
        <button
          onClick={() => {
            audioEngine.playUIClick();
            setActiveShop({
              title: "Evergreen General Store",
              owner: "Pierre & Village Guild",
              type: "store"
            });
          }}
          className="px-3 py-1.5 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#e0e0e0] font-mono font-bold text-xs flex items-center gap-1.5 shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Village General Store"
        >
          <ShoppingBag className="w-4 h-4 text-[#ffd54f]" />
          <span className="hidden sm:inline">Store</span>
        </button>

        {/* Daily Fortune Almanac Button */}
        <button
          onClick={() => {
            audioEngine.playNotification();
            setShowFortuneModal(true);
          }}
          className="px-3 py-1.5 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#e0e0e0] font-mono font-bold text-xs flex items-center gap-1.5 shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Daily Almanac & TV Forecast"
        >
          <Radio className="w-4 h-4 text-[#81c784]" />
          <span className="hidden sm:inline">Almanac</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playUIClick();
            setShowJournal(true);
          }}
          className="px-3 py-1.5 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#e0e0e0] font-mono font-bold text-xs flex items-center gap-1.5 shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Villager Journal & Social Network"
        >
          <Book className="w-4 h-4 text-[#64b5f6]" />
          <span className="hidden sm:inline">Journal</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playUIClick();
            setShowNoticeBoard(true);
          }}
          className="px-3 py-1.5 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#e0e0e0] font-mono font-bold text-xs flex items-center gap-1.5 shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Village Notice Board Quests"
        >
          <Pin className="w-4 h-4 text-[#ff8a65]" />
          <span className="hidden sm:inline">Quests</span>
        </button>

        <button
          onClick={handleToggleBGM}
          className="p-2 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#ffd54f] shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Toggle Background Music"
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleMute}
          className="p-2 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#a3b18a] hover:text-[#fefae0] shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title={isAudioMuted ? "Unmute SFX" : "Mute SFX"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            audioEngine.playUIClick();
            setShowHelp(true);
          }}
          className="p-2 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#ffd54f] shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Controls & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetSimulation}
          className="p-2 bg-[#2b2b2b] hover:bg-[#383838] border-2 border-[#111] rounded-sm text-[#a3b18a] hover:text-[#fefae0] shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#4f4f4f] transition-transform active:translate-y-0.5 cursor-pointer"
          title="Reset Simulation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center: Inventory Hotbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <InventoryBar
          inventory={inventory}
          selectedSlotIndex={selectedSlotIndex}
          onSelectSlot={idx => setSelectedSlotIndex(idx)}
          goldCoins={goldCoins}
          energy={energy}
          maxEnergy={maxEnergy}
          onUseItem={handleUseItem}
        />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-none">
          <div className="px-4 py-2 bg-[#202020]/95 border-2 border-[#111] text-[#fefae0] font-mono font-bold text-xs rounded-sm shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#444] backdrop-blur-md flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffd54f]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      {activeNpc && (
        <DialogueBox
          npc={activeNpc}
          npcData={activeNpcData}
          inventory={inventory}
          onSendMessage={handleSendMessage}
          onClose={() => setActiveDialogueNpcId(null)}
        />
      )}

      {activeShop && (
        <ShopModal
          shopTitle={activeShop.title}
          shopOwner={activeShop.owner}
          shopType={activeShop.type}
          goldCoins={goldCoins}
          inventory={inventory}
          onBuyItem={handleBuyShopItem}
          onSellItem={handleSellShopItem}
          onClose={() => setActiveShop(null)}
        />
      )}

      {activeCraftingStation && (
        <CraftingStationModal
          station={activeCraftingStation}
          inventory={inventory}
          goldCoins={goldCoins}
          onCraft={handleCraftRecipe}
          onClose={() => setActiveCraftingStation(null)}
        />
      )}

      {showJournal && (
        <VillagerJournal
          npcs={npcs}
          npcProfiles={npcProfiles}
          skills={skills}
          onClose={() => setShowJournal(false)}
          onSimulateMeeting={handleSimulateMeeting}
        />
      )}

      {showNoticeBoard && (
        <NoticeBoardModal
          quests={quests}
          inventory={inventory}
          onCompleteQuest={handleCompleteQuest}
          onClose={() => setShowNoticeBoard(false)}
        />
      )}

      {showSleepModal && (
        <SleepModal
          day={day}
          season={season}
          onConfirmSleep={handleConfirmSleep}
          onCancel={() => setShowSleepModal(false)}
        />
      )}

      {activeLevelUp && (
        <LevelUpModal
          skill={activeLevelUp.skill}
          newLevel={activeLevelUp.level}
          unlockedPerks={activeLevelUp.perks}
          onClose={() => setActiveLevelUp(null)}
        />
      )}

      {showFortuneModal && (
        <DailyFortuneModal
          fortune={todayFortune}
          onClose={() => setShowFortuneModal(false)}
        />
      )}

      {showHelp && <HelpControlsModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
