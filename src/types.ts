export type WeatherType = "Sunny" | "Gentle Breeze" | "Golden Mist" | "Light Rain" | "Starry Twilight";
export type SeasonType = "Spring" | "Summer" | "Autumn" | "Winter";

export interface Position {
  x: number;
  y: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: "forage" | "herb" | "mineral" | "food" | "tool" | "craft" | "seed" | "crop" | "fish";
  color: string;
  iconType: string;
  sellPrice: number;
  buyPrice?: number;
  healEnergy?: number;
}

export interface InventorySlot {
  item: Item;
  quantity: number;
}

export interface ForageNode {
  id: string;
  item: Item;
  x: number;
  y: number;
  respawnTimer: number;
  collected: boolean;
}

export interface CropState {
  cropId: string;
  name: string;
  stage: number; // 0: seeds, 1: sprout, 2: growing, 3: mature
  maxStages: number;
  plantedDay: number;
  harvestItemId: string;
}

export interface FarmTile {
  id: string;
  tileX: number;
  tileY: number;
  tilled: boolean;
  watered: boolean;
  crop?: CropState;
}

export interface FishingState {
  isFishing: boolean;
  state: "idle" | "casting" | "waiting" | "bite" | "reeling" | "caught";
  progress: number;
  timer: number;
  targetItem?: Item;
}

export interface InteriorFurniture {
  id: string;
  type: "bed" | "table" | "stove" | "bookshelf" | "counter" | "hearth" | "rug" | "chair" | "anvil" | "herbs" | "cask" | "cabinet" | "exam_cot";
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  color?: string;
}

export interface InteriorRoom {
  id: string;
  name: string;
  buildingId: string;
  ownerId?: string;
  width: number;
  height: number;
  floorType: "wood" | "stone" | "carpet" | "checker";
  wallColor: string;
  doorX: number;
  doorY: number;
  exitTarget: { x: number; y: number };
  furniture: InteriorFurniture[];
  ambientLight: string;
  bgmTrack?: string;
  residentNpcId?: string;
  residentScheduleHours?: [number, number]; // e.g. [1200, 1440]
}

export interface Building {
  id: string;
  name: string;
  ownerId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  roofColor: string;
  wallColor: string;
  accentColor: string;
  signType: "store" | "tavern" | "townhall" | "clinic" | "forge" | "cottage" | "carpenter" | "farmhouse";
  doorX: number;
  doorY: number;
  signText: string;
  description: string;
  interiorId?: string;
}

export interface ShopItem {
  item: Item;
  price: number;
  stock: number;
}

export interface NPCState {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  direction: "down" | "up" | "left" | "right" | "down-left" | "down-right" | "up-left" | "up-right";
  isMoving: boolean;
  speed: number;
  currentActivity: string;
  currentLocationName: string;
  currentScheduleSlot?: any;
  color: string;
  secondaryColor: string;
  hairColor: string;
  friendshipPoints: number;
  hearts: number;
  trustLevel: string;
  isPartner?: boolean;
  partnerConfessionDate?: string;
  recentDialogue?: string;
  currentEmotion: "neutral" | "happy" | "touched" | "thoughtful" | "surprised" | "warm" | "annoyed" | "excited";
  speechBubble?: {
    text: string;
    expiresAt: number;
  };
  currentInteriorId?: string | null;
}

export type SkillType = "farming" | "foraging" | "fishing" | "social";

export interface SkillProgress {
  level: number;
  xp: number;
  maxXp: number;
  title: string;
}

export interface PlayerSkills {
  farming: SkillProgress;
  foraging: SkillProgress;
  fishing: SkillProgress;
  social: SkillProgress;
}

export interface FloatingPop {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
  duration: number;
}

export interface FarmPet {
  name: string;
  type: "cat" | "dog";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  direction: "left" | "right" | "down" | "up";
  mood: "happy" | "purring" | "sleepy";
  pettedToday: boolean;
  hearts: number;
}

export interface DailyFortune {
  luckRating: "Joyous" | "Good" | "Neutral" | "Mild";
  title: string;
  description: string;
  bonus: string;
}

export interface Quest {
  id: string;
  requesterId: string;
  requesterName: string;
  title: string;
  description: string;
  rewardPoints: number;
  rewardCoins: number;
  targetItemId?: string;
  targetItemCount?: number;
  status: "available" | "active" | "completed";
}

export interface ActiveDialogue {
  npcId: string;
  npcName: string;
  npcTitle: string;
  message: string;
  emotion: "neutral" | "happy" | "touched" | "thoughtful" | "surprised" | "warm" | "annoyed" | "excited";
  isTyping: boolean;
  rumorOrHint?: string;
  history: Array<{ sender: "player" | "npc"; text: string }>;
}

