import { Item } from "../types";

export const ALL_ITEMS: Record<string, Item> = {
  // Tools
  farming_hoe: {
    id: "farming_hoe",
    name: "Sturdy Hoe",
    description: "A well-balanced forged iron hoe. Use on the farm field to till soil for planting seeds.",
    category: "tool",
    color: "#8d6e63",
    iconType: "hoe",
    sellPrice: 50,
    buyPrice: 120
  },
  watering_can: {
    id: "watering_can",
    name: "Copper Watering Can",
    description: "Holds refreshing well water. Water tilled crops daily to help them flourish and grow.",
    category: "tool",
    color: "#0288d1",
    iconType: "watering_can",
    sellPrice: 40,
    buyPrice: 100
  },
  fishing_rod: {
    id: "fishing_rod",
    name: "Bamboo Fishing Rod",
    description: "A flexible bamboo pole with fine silk line. Cast into Whispering Lake from the wooden pier to catch fish.",
    category: "tool",
    color: "#ffb300",
    iconType: "fishing_rod",
    sellPrice: 60,
    buyPrice: 150
  },

  // Seeds
  strawberry_seeds: {
    id: "strawberry_seeds",
    name: "Strawberry Seeds",
    description: "Tiny heirloom seeds that yield sweet, crimson valley strawberries in 2 days.",
    category: "seed",
    color: "#e53935",
    iconType: "seed",
    sellPrice: 15,
    buyPrice: 30
  },
  wheat_seeds: {
    id: "wheat_seeds",
    name: "Golden Wheat Seeds",
    description: "Hardy grains that grow into tall amber wheat stalks. Rowan loves these for fresh hearth breads.",
    category: "seed",
    color: "#fbc02d",
    iconType: "seed",
    sellPrice: 10,
    buyPrice: 20
  },
  pumpkin_seeds: {
    id: "pumpkin_seeds",
    name: "Sweet Pumpkin Seeds",
    description: "Seeds of a prized valley pumpkin with rich, velvety orange flesh.",
    category: "seed",
    color: "#f57c00",
    iconType: "seed",
    sellPrice: 25,
    buyPrice: 50
  },

  // Harvested Produce
  fresh_strawberry: {
    id: "fresh_strawberry",
    name: "Fresh Strawberry",
    description: "A plump, fragrant ripe strawberry fresh from your farm plot. Sweet and juicy.",
    category: "crop",
    color: "#e53935",
    iconType: "strawberry",
    sellPrice: 65,
    healEnergy: 30
  },
  golden_wheat: {
    id: "golden_wheat",
    name: "Golden Wheat",
    description: "A bundle of sun-ripened wheat grains, ready for milling into fine flour.",
    category: "crop",
    color: "#fbc02d",
    iconType: "wheat",
    sellPrice: 45,
    healEnergy: 15
  },
  sweet_pumpkin: {
    id: "sweet_pumpkin",
    name: "Sweet Pumpkin",
    description: "A heavy, beautiful golden pumpkin. A favorite across Evergreen during harvest festivals.",
    category: "crop",
    color: "#f57c00",
    iconType: "pumpkin",
    sellPrice: 120,
    healEnergy: 50
  },

  // Fish
  rainbow_trout: {
    id: "rainbow_trout",
    name: "Rainbow Trout",
    description: "A shimmering freshwater trout caught from Whispering Lake with iridescent pink and silver scales.",
    category: "fish",
    color: "#4dd0e1",
    iconType: "fish",
    sellPrice: 75,
    healEnergy: 35
  },
  whispering_bass: {
    id: "whispering_bass",
    name: "Whispering Bass",
    description: "A prized deep-water bass known to linger near the wooden dock reeds.",
    category: "fish",
    color: "#26a69a",
    iconType: "fish",
    sellPrice: 90,
    healEnergy: 40
  },
  golden_carp: {
    id: "golden_carp",
    name: "Golden Carp",
    description: "A legendary golden fish said to bring prosperity to whoever hooks it.",
    category: "fish",
    color: "#ffd54f",
    iconType: "fish",
    sellPrice: 180,
    healEnergy: 70
  },

  // Foragables & Herbs
  starflower: {
    id: "starflower",
    name: "Starflower",
    description: "A luminous celestial blossom that glows with a pale azure hue under shaded forest branches.",
    category: "herb",
    color: "#64b5f6",
    iconType: "starflower",
    sellPrice: 45,
    buyPrice: 90
  },
  glowmoss: {
    id: "glowmoss",
    name: "Glowmoss",
    description: "Luminescent emerald moss harvested from ancient stone ruins. Silas studies its trace minerals.",
    category: "herb",
    color: "#aed581",
    iconType: "glowmoss",
    sellPrice: 35,
    buyPrice: 70
  },
  river_mint: {
    id: "river_mint",
    name: "River Mint",
    description: "Refreshing wild mint found along the cool banks of Whispering Lake. Beloved by Mira for tea.",
    category: "herb",
    color: "#4db6ac",
    iconType: "river_mint",
    sellPrice: 20,
    buyPrice: 40
  },
  wild_berries: {
    id: "wild_berries",
    name: "Wild Berries",
    description: "Plump, sweet forest berries bursting with rich ruby juice. Rowan uses them for his spiced tarts.",
    category: "food",
    color: "#e91e63",
    iconType: "wild_berries",
    sellPrice: 15,
    buyPrice: 30,
    healEnergy: 15
  },
  honeycomb: {
    id: "honeycomb",
    name: "Honeycomb",
    description: "Golden wild honeycomb harvested from hollow oak boughs. A prized ingredient across the village.",
    category: "food",
    color: "#ffb300",
    iconType: "honeycomb",
    sellPrice: 40,
    buyPrice: 80,
    healEnergy: 25
  },
  oak_timber: {
    id: "oak_timber",
    name: "Oak Timber",
    description: "Sturdy seasoned oak heartwood with a straight grain. Perfect for Finn's carpentry projects.",
    category: "craft",
    color: "#8d6e63",
    iconType: "timber",
    sellPrice: 30,
    buyPrice: 60
  },
  iron_ore: {
    id: "iron_ore",
    name: "Iron Ore",
    description: "Dense chunk of raw iron extracted from the northern mountain crags. Elara's prized smithing material.",
    category: "mineral",
    color: "#78909c",
    iconType: "iron_ore",
    sellPrice: 50,
    buyPrice: 100
  },
  ancient_coin: {
    id: "ancient_coin",
    name: "Ancient Coin",
    description: "A weathered brass coin stamped with the original seal of the Evergreen settlement.",
    category: "mineral",
    color: "#ffd54f",
    iconType: "ancient_coin",
    sellPrice: 100
  },
  chamomile_tea: {
    id: "chamomile_tea",
    name: "Chamomile Tea",
    description: "Soothing hot brew infused with dried chamomile and clover honey. Calms the busiest mind.",
    category: "food",
    color: "#ffe082",
    iconType: "chamomile_tea",
    sellPrice: 25,
    buyPrice: 50,
    healEnergy: 35
  },
  spiced_cider: {
    id: "spiced_cider",
    name: "Spiced Apple Cider",
    description: "Warm, cinnamon-steeped cider brewed in Rowan's tavern casks.",
    category: "food",
    color: "#ff7043",
    iconType: "cup",
    sellPrice: 40,
    buyPrice: 75,
    healEnergy: 45
  },
  honey_bread: {
    id: "honey_bread",
    name: "Honey Bread Loaf",
    description: "Freshly baked artisan sourdough glazed with wildflower honey.",
    category: "food",
    color: "#ffb74d",
    iconType: "bread",
    sellPrice: 55,
    buyPrice: 90,
    healEnergy: 50
  },
  antique_quill: {
    id: "antique_quill",
    name: "Antique Quill",
    description: "A silver-dipped raven feather quill. Mayor Cora keeps one on her official registry desk.",
    category: "craft",
    color: "#b0bec5",
    iconType: "quill",
    sellPrice: 85,
    buyPrice: 160
  },
  tropical_coconut: {
    id: "tropical_coconut",
    name: "Tropical Coconut",
    description: "Fresh coastal coconut with cool sweet water and rich white flesh. Isla's favorite post-surf snack!",
    category: "food",
    color: "#795548",
    iconType: "food",
    sellPrice: 40,
    buyPrice: 80,
    healEnergy: 40
  },
  seashell: {
    id: "seashell",
    name: "Seashell",
    description: "A glistening spiral seashell polished smooth by ocean tides. Maya loves collecting these for the Tiki Bar.",
    category: "mineral",
    color: "#ffccbc",
    iconType: "seashell",
    sellPrice: 35,
    buyPrice: 70
  },
  starfish: {
    id: "starfish",
    name: "Starfish",
    description: "A radiant purple tidepool starfish. Marina studies their regenerative biology in the coral shoals.",
    category: "mineral",
    color: "#ab47bc",
    iconType: "starfish",
    sellPrice: 50,
    buyPrice: 100
  },
  sea_glass: {
    id: "sea_glass",
    name: "Sea Glass",
    description: "Frosty turquoise sea glass tumbled by waves. A sparkling keepsake from the shoreline.",
    category: "mineral",
    color: "#4dd0e1",
    iconType: "mineral",
    sellPrice: 30,
    buyPrice: 60
  }
};
