import { InteriorRoom } from "../types";

export const INTERIORS: Record<string, InteriorRoom> = {
  farmhouse: {
    id: "farmhouse",
    name: "Cozy Homestead Bedroom",
    buildingId: "farmhouse",
    width: 640,
    height: 480,
    floorType: "wood",
    wallColor: "#5d4037",
    doorX: 320,
    doorY: 440,
    exitTarget: { x: 520, y: 720 },
    ambientLight: "rgba(255, 236, 179, 0.22)",
    furniture: [
      { id: "hearth", type: "hearth", x: 320, y: 80, width: 80, height: 60, label: "Crackling Stone Hearth", color: "#424242" },
      { id: "bed", type: "bed", x: 110, y: 110, width: 80, height: 100, label: "Checkered Patchwork Bed", color: "#c62828" },
      { id: "nightstand", type: "cabinet", x: 60, y: 110, width: 40, height: 50, label: "Bedside Table & Glowing Shaded Lamp", color: "#6d4c41" },
      { id: "cat_chair", type: "table", x: 100, y: 260, width: 60, height: 60, label: "Wooden Chair with Sleeping Cat Mochi", color: "#8d6e63" },
      { id: "plant1", type: "herbs", x: 60, y: 200, width: 40, height: 40, label: "Potted Monstera Leaf", color: "#43a047" },
      { id: "rug", type: "rug", x: 320, y: 270, width: 150, height: 100, label: "Warm Patchwork Hearth Rug", color: "#8d6e63" },
      { id: "table", type: "table", x: 320, y: 240, width: 80, height: 50, label: "Oak Dining Table & Fresh Bread", color: "#6d4c41" },
      { id: "stove", type: "stove", x: 520, y: 90, width: 60, height: 60, label: "Cast Iron Stove & Teapot", color: "#212121" },
      { id: "bookshelf", type: "bookshelf", x: 540, y: 220, width: 60, height: 80, label: "Framed Wall Photos & Homestead Ledger", color: "#4e342e" }
    ]
  },
  tiki_bar: {
    id: "tiki_bar",
    name: "Maya's Tiki Bar & Shoreline Lounge",
    buildingId: "tiki_bar",
    ownerId: "maya",
    residentNpcId: "maya",
    width: 700,
    height: 500,
    floorType: "wood",
    wallColor: "#5d4037",
    doorX: 350,
    doorY: 460,
    exitTarget: { x: 1720, y: 1520 },
    ambientLight: "rgba(255, 204, 128, 0.2)",
    furniture: [
      { id: "tiki_counter", type: "counter", x: 350, y: 120, width: 260, height: 60, label: "Maya's Bamboo Tiki Counter & Coconut Bar", color: "#8d6e63" },
      { id: "blender_cask", type: "cask", x: 550, y: 80, width: 50, height: 40, label: "Chilled Coconut Punch Barrel", color: "#ffd54f" },
      { id: "torch1", type: "hearth", x: 120, y: 100, width: 50, height: 60, label: "Shoreline Bamboo Tiki Torch", color: "#ff7043" },
      { id: "torch2", type: "hearth", x: 580, y: 100, width: 50, height: 60, label: "Shoreline Bamboo Tiki Torch", color: "#ff7043" },
      { id: "beach_table1", type: "table", x: 180, y: 280, width: 80, height: 60, label: "Thatched Shade Table", color: "#a1887f" },
      { id: "beach_table2", type: "table", x: 500, y: 280, width: 80, height: 60, label: "Oceanview Cocktail Table", color: "#a1887f" },
      { id: "seashell_display", type: "cabinet", x: 100, y: 380, width: 70, height: 60, label: "Maya's Spiral Seashell & Sea Glass Cabinet", color: "#00897b" }
    ]
  },
  beach_bungalow: {
    id: "beach_bungalow",
    name: "Evergreen Beach Bungalow & Surf Inn",
    buildingId: "beach_bungalow",
    ownerId: "isla",
    residentNpcId: "isla",
    width: 680,
    height: 480,
    floorType: "wood",
    wallColor: "#00695c",
    doorX: 340,
    doorY: 440,
    exitTarget: { x: 1960, y: 1480 },
    ambientLight: "rgba(178, 235, 242, 0.2)",
    furniture: [
      { id: "surf_rack", type: "cabinet", x: 120, y: 100, width: 80, height: 90, label: "Isla's Custom Wave Surfboard Rack", color: "#0288d1" },
      { id: "bungalow_bed1", type: "bed", x: 540, y: 110, width: 70, height: 90, label: "Isla's Ocean-Stitched Cot", color: "#4dd0e1" },
      { id: "bungalow_bed2", type: "bed", x: 540, y: 320, width: 70, height: 90, label: "Marina's Coral Reef Bunk", color: "#e91e63" },
      { id: "tidepool_tank", type: "counter", x: 340, y: 110, width: 120, height: 60, label: "Marina's Saltwater Tidepool Habitat Tank", color: "#00acc1" },
      { id: "coastal_table", type: "table", x: 340, y: 270, width: 90, height: 60, label: "Driftwood Table with Sea Glass & Maps", color: "#8d6e63" }
    ]
  },
  cottage: {
    id: "cottage",
    name: "Mira's Herbalist Cottage",
    buildingId: "cottage",
    ownerId: "mira",
    residentNpcId: "mira",
    width: 640,
    height: 480,
    floorType: "wood",
    wallColor: "#33691e",
    doorX: 320,
    doorY: 440,
    exitTarget: { x: 420, y: 1380 },
    ambientLight: "rgba(230, 244, 234, 0.15)",
    furniture: [
      { id: "herbs_table", type: "herbs", x: 180, y: 90, width: 100, height: 60, label: "Botanical Drying Rack & Jars", color: "#558b2f" },
      { id: "tea_table", type: "table", x: 320, y: 240, width: 90, height: 60, label: "Tea Ceremony Table", color: "#6d4c41" },
      { id: "cabinet", type: "cabinet", x: 500, y: 90, width: 80, height: 80, label: "Herbal Medicine Cabinet", color: "#3e2723" },
      { id: "rug", type: "rug", x: 320, y: 250, width: 130, height: 90, label: "Floral Meadow Rug", color: "#7cb342" },
      { id: "bed", type: "bed", x: 100, y: 340, width: 70, height: 80, label: "Mira's Floral Cot", color: "#66bb6a" }
    ]
  },
  tavern: {
    id: "tavern",
    name: "The Sleeping Fox Tavern",
    buildingId: "tavern",
    ownerId: "rowan",
    residentNpcId: "rowan",
    width: 720,
    height: 520,
    floorType: "wood",
    wallColor: "#4e342e",
    doorX: 360,
    doorY: 480,
    exitTarget: { x: 1580, y: 830 },
    ambientLight: "rgba(255, 183, 77, 0.2)",
    furniture: [
      { id: "bar_counter", type: "counter", x: 360, y: 120, width: 260, height: 50, label: "Rowan's Tavern Bar", color: "#5d4037" },
      { id: "cask1", type: "cask", x: 560, y: 80, width: 50, height: 40, label: "Spiced Cider Cask", color: "#d84315" },
      { id: "cask2", type: "cask", x: 620, y: 80, width: 50, height: 40, label: "Elderberry Wine Barrel", color: "#bf360c" },
      { id: "hearth", type: "hearth", x: 120, y: 100, width: 80, height: 70, label: "Roaring Tavern Fireplace", color: "#3e2723" },
      { id: "table1", type: "table", x: 180, y: 280, width: 90, height: 60, label: "Patron Oak Table", color: "#6d4c41" },
      { id: "table2", type: "table", x: 480, y: 280, width: 90, height: 60, label: "Corner Hearth Table", color: "#6d4c41" },
      { id: "rug", type: "rug", x: 360, y: 340, width: 160, height: 90, label: "Fox Emblem Woven Carpet", color: "#e65100" }
    ]
  },
  clinic: {
    id: "clinic",
    name: "Doctor Silas's Clinic & Apothecary",
    buildingId: "clinic",
    ownerId: "silas",
    residentNpcId: "silas",
    width: 640,
    height: 480,
    floorType: "checker",
    wallColor: "#37474f",
    doorX: 320,
    doorY: 440,
    exitTarget: { x: 820, y: 490 },
    ambientLight: "rgba(227, 242, 253, 0.15)",
    furniture: [
      { id: "desk", type: "table", x: 220, y: 110, width: 110, height: 60, label: "Dr. Silas's Clinical Ledger", color: "#455a64" },
      { id: "cabinet", type: "cabinet", x: 500, y: 90, width: 90, height: 80, label: "Glass Potion & Remedy Shelf", color: "#1e88e5" },
      { id: "exam_cot", type: "exam_cot", x: 100, y: 260, width: 60, height: 100, label: "Patient Examination Cot", color: "#90caf9" },
      { id: "bookshelf", type: "bookshelf", x: 520, y: 240, width: 70, height: 90, label: "Botanical & Medical Tomes", color: "#37474f" }
    ]
  },
  forge: {
    id: "forge",
    name: "Elara's Smithy & Forge",
    buildingId: "forge",
    ownerId: "elara",
    residentNpcId: "elara",
    width: 680,
    height: 480,
    floorType: "stone",
    wallColor: "#263238",
    doorX: 340,
    doorY: 440,
    exitTarget: { x: 1880, y: 520 },
    ambientLight: "rgba(255, 112, 67, 0.25)",
    furniture: [
      { id: "furnace", type: "hearth", x: 340, y: 90, width: 120, height: 80, label: "Blazing Stone Smelting Furnace", color: "#bf360c" },
      { id: "anvil", type: "anvil", x: 220, y: 230, width: 60, height: 50, label: "Master Steel Anvil", color: "#212121" },
      { id: "water_trough", type: "table", x: 460, y: 230, width: 70, height: 50, label: "Quenching Water Trough", color: "#1976d2" },
      { id: "ingot_rack", type: "cabinet", x: 100, y: 110, width: 70, height: 90, label: "Iron & Copper Ingot Storage", color: "#455a64" }
    ]
  },
  townhall: {
    id: "townhall",
    name: "Evergreen Town Hall",
    buildingId: "townhall",
    ownerId: "cora",
    residentNpcId: "cora",
    width: 720,
    height: 520,
    floorType: "carpet",
    wallColor: "#4a148c",
    doorX: 360,
    doorY: 480,
    exitTarget: { x: 1200, y: 540 },
    ambientLight: "rgba(243, 229, 245, 0.15)",
    furniture: [
      { id: "mayor_desk", type: "table", x: 360, y: 120, width: 140, height: 70, label: "Mayor Cora's Official Council Desk", color: "#3e2723" },
      { id: "bookshelf1", type: "bookshelf", x: 140, y: 100, width: 80, height: 90, label: "Evergreen Civic Archives (1780-Present)", color: "#4e342e" },
      { id: "bookshelf2", type: "bookshelf", x: 580, y: 100, width: 80, height: 90, label: "Valley Geological & Land Maps", color: "#4e342e" },
      { id: "carpet", type: "rug", x: 360, y: 300, width: 220, height: 140, label: "Royal Purple Valley Crest Carpet", color: "#7b1fa2" }
    ]
  },
  carpenter: {
    id: "carpenter",
    name: "Finn's Carpentry Workshop",
    buildingId: "carpenter",
    ownerId: "finn",
    residentNpcId: "finn",
    width: 680,
    height: 480,
    floorType: "wood",
    wallColor: "#bf360c",
    doorX: 340,
    doorY: 440,
    exitTarget: { x: 1420, y: 1380 },
    ambientLight: "rgba(255, 224, 178, 0.18)",
    furniture: [
      { id: "workbench", type: "table", x: 340, y: 110, width: 160, height: 60, label: "Finn's Woodworking Bench & Lathe", color: "#5d4037" },
      { id: "sawhorse", type: "table", x: 160, y: 240, width: 80, height: 50, label: "Seasoned Cedar Timber Stack", color: "#8d6e63" },
      { id: "tool_chest", type: "cabinet", x: 540, y: 100, width: 70, height: 80, label: "Brass Hand Tools & Chisels", color: "#ff8f00" }
    ]
  },
  store: {
    id: "store",
    name: "Evergreen General Store",
    buildingId: "store",
    width: 680,
    height: 480,
    floorType: "wood",
    wallColor: "#1b5e20",
    doorX: 340,
    doorY: 440,
    exitTarget: { x: 960, y: 920 },
    ambientLight: "rgba(255, 248, 225, 0.18)",
    furniture: [
      { id: "shop_counter", type: "counter", x: 340, y: 110, width: 200, height: 50, label: "Produce & Seed Trade Register", color: "#5d4037" },
      { id: "display1", type: "table", x: 160, y: 230, width: 90, height: 60, label: "Spring Seed Sacks & Fertilizer", color: "#795548" },
      { id: "display2", type: "table", x: 520, y: 230, width: 90, height: 60, label: "Fresh Orchard Apples & Provisions", color: "#795548" }
    ]
  }
};
