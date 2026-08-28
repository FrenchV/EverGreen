/**
 * Evergreen High-Definition Painted Pixel Art Rendering Engine
 * Implements 32x32 base grid, 3/4 perspective, soft cel shading with rim-lighting,
 * and warm saturated golden-hour color palette.
 */

export interface SpriteFrame {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export class PixelRenderer {
  private static tileCache: Map<string, HTMLCanvasElement> = new Map();
  private static characterCache: Map<string, HTMLCanvasElement> = new Map();

  // Color Palettes
  public static readonly PALETTE = {
    grassDark: "#2c5c2d",
    grassBase: "#3d7e3e",
    grassLight: "#5aa05b",
    grassHighlight: "#88cc7e",
    dirtDark: "#6b4928",
    dirtBase: "#8c6239",
    dirtLight: "#b58757",
    stoneDark: "#4a5568",
    stoneBase: "#718096",
    stoneLight: "#a0aec0",
    stoneHighlight: "#e2e8f0",
    waterDeep: "#1a365d",
    waterBase: "#2b6cb0",
    waterLight: "#4299e1",
    waterFoam: "#bee3f8",
    woodDark: "#45260a",
    woodBase: "#784415",
    woodLight: "#a86a2e",
    woodPlank: "#c48849",
    goldTrim: "#d4af37",
    parchment: "#fbf6e2",
    parchmentBorder: "#3e2723"
  };

  /**
   * Helper to create an offscreen pixel-art canvas
   */
  public static createCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  /**
   * Render Grass Wang Tile with soft painted tufts and flower highlights
   */
  public static getGrassTile(seed: number = 0): HTMLCanvasElement {
    const key = `grass_${seed % 4}`;
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(32, 32);

    // Base gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 32);
    grad.addColorStop(0, this.PALETTE.grassLight);
    grad.addColorStop(1, this.PALETTE.grassBase);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    // Dappled texture
    ctx.fillStyle = this.PALETTE.grassDark;
    for (let i = 0; i < 6; i++) {
      const rx = (seed * 17 + i * 13) % 28 + 2;
      const ry = (seed * 23 + i * 11) % 28 + 2;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Grass blades highlights
    ctx.fillStyle = this.PALETTE.grassHighlight;
    const blades = [
      { x: 4, y: 6 }, { x: 18, y: 14 }, { x: 8, y: 22 }, { x: 24, y: 26 }
    ];
    blades.forEach((b, idx) => {
      if ((seed + idx) % 2 === 0) {
        ctx.fillRect(b.x, b.y, 1, 3);
        ctx.fillRect(b.x + 1, b.y - 1, 1, 2);
      }
    });

    // Small flower scatter
    if (seed % 3 === 0) {
      ctx.fillStyle = seed % 2 === 0 ? "#ffd54f" : "#81d4fa";
      ctx.fillRect(14, 18, 2, 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(15, 19, 1, 1);
    }

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Dirt Path Tile
   */
  public static getDirtTile(): HTMLCanvasElement {
    const key = "dirt_tile";
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(32, 32);
    ctx.fillStyle = this.PALETTE.dirtBase;
    ctx.fillRect(0, 0, 32, 32);

    // Warm gradients
    ctx.fillStyle = this.PALETTE.dirtDark;
    ctx.fillRect(2, 4, 3, 2);
    ctx.fillRect(18, 8, 4, 2);
    ctx.fillRect(10, 22, 5, 2);
    ctx.fillRect(24, 20, 3, 2);

    // Highlights
    ctx.fillStyle = this.PALETTE.dirtLight;
    ctx.fillRect(5, 6, 2, 1);
    ctx.fillRect(20, 10, 2, 1);
    ctx.fillRect(12, 24, 3, 1);

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Cobblestone Tile
   */
  public static getCobblestoneTile(): HTMLCanvasElement {
    const key = "cobble_tile";
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(32, 32);
    ctx.fillStyle = this.PALETTE.stoneDark;
    ctx.fillRect(0, 0, 32, 32);

    const stones = [
      { x: 1, y: 1, w: 14, h: 9 },
      { x: 17, y: 1, w: 14, h: 9 },
      { x: 1, y: 11, w: 8, h: 9 },
      { x: 10, y: 11, w: 12, h: 9 },
      { x: 23, y: 11, w: 8, h: 9 },
      { x: 1, y: 21, w: 14, h: 10 },
      { x: 17, y: 21, w: 14, h: 10 }
    ];

    stones.forEach(s => {
      ctx.fillStyle = this.PALETTE.stoneBase;
      ctx.fillRect(s.x, s.y, s.w, s.h);

      // 3D Rim light on top & left
      ctx.fillStyle = this.PALETTE.stoneLight;
      ctx.fillRect(s.x, s.y, s.w - 1, 2);
      ctx.fillRect(s.x, s.y, 2, s.h - 1);

      // Deep shadow on bottom & right
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(s.x, s.y + s.h - 1, s.w, 1);
      ctx.fillRect(s.x + s.w - 1, s.y, 1, s.h);
    });

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Water Tile with shimmering wavelets
   */
  public static getWaterTile(frame: number = 0): HTMLCanvasElement {
    const key = `water_tile_${frame % 4}`;
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(32, 32);
    const grad = ctx.createLinearGradient(0, 0, 0, 32);
    grad.addColorStop(0, this.PALETTE.waterBase);
    grad.addColorStop(1, this.PALETTE.waterDeep);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    // Wave ripples shifting with animation frame
    ctx.fillStyle = this.PALETTE.waterLight;
    const offset = (frame % 4) * 4;
    ctx.fillRect((4 + offset) % 32, 6, 8, 2);
    ctx.fillRect((16 + offset) % 32, 16, 10, 2);
    ctx.fillRect((8 + offset) % 32, 24, 7, 2);

    ctx.fillStyle = this.PALETTE.waterFoam;
    ctx.fillRect((5 + offset) % 32, 7, 3, 1);
    ctx.fillRect((18 + offset) % 32, 17, 4, 1);

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Ancient Oak Tree sprite (64x80px)
   */
  public static getOakTreeSprite(): HTMLCanvasElement {
    const key = "oak_tree";
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(64, 80);

    // Soft drop shadow
    ctx.fillStyle = "rgba(18, 32, 20, 0.4)";
    ctx.beginPath();
    ctx.ellipse(32, 72, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = this.PALETTE.woodDark;
    ctx.fillRect(27, 48, 10, 26);
    ctx.fillStyle = this.PALETTE.woodBase;
    ctx.fillRect(29, 48, 6, 25);
    ctx.fillStyle = this.PALETTE.woodLight;
    ctx.fillRect(30, 48, 2, 24);

    // Foliage canopy (layered spheres with cel shading)
    const clusters = [
      { x: 32, y: 26, r: 24, base: "#2d6a30", light: "#4c9b51", high: "#7ecc81" },
      { x: 20, y: 32, r: 18, base: "#245827", light: "#3f8743", high: "#6dbd70" },
      { x: 44, y: 32, r: 18, base: "#245827", light: "#459249", high: "#77c87a" },
      { x: 32, y: 16, r: 18, base: "#377b3b", light: "#5ab05f", high: "#92dc95" }
    ];

    clusters.forEach(c => {
      // Base shadow
      ctx.fillStyle = c.base;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Mid light
      ctx.fillStyle = c.light;
      ctx.beginPath();
      ctx.arc(c.x - 2, c.y - 3, c.r * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Top rim highlight
      ctx.fillStyle = c.high;
      ctx.beginPath();
      ctx.arc(c.x - 4, c.y - 6, c.r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dark rounded outline
    ctx.strokeStyle = "#132815";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(32, 28, 28, 0, Math.PI * 2);
    ctx.stroke();

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Pine Tree sprite (48x72px)
   */
  public static getPineTreeSprite(): HTMLCanvasElement {
    const key = "pine_tree";
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(48, 72);

    // Drop shadow
    ctx.fillStyle = "rgba(18, 32, 20, 0.4)";
    ctx.beginPath();
    ctx.ellipse(24, 66, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(21, 48, 6, 20);

    // Pine tiers (3 triangles)
    const tiers = [
      { y: 48, w: 38, h: 22, colorDark: "#1b3a24", colorMid: "#255734", colorLight: "#438e5b" },
      { y: 34, w: 30, h: 20, colorDark: "#20442b", colorMid: "#2e6a40", colorLight: "#54aa70" },
      { y: 18, w: 22, h: 18, colorDark: "#255734", colorMid: "#3b8350", colorLight: "#6dc88c" }
    ];

    tiers.forEach(t => {
      // Dark Base
      ctx.fillStyle = t.colorDark;
      ctx.beginPath();
      ctx.moveTo(24, t.y - t.h);
      ctx.lineTo(24 - t.w / 2, t.y);
      ctx.lineTo(24 + t.w / 2, t.y);
      ctx.closePath();
      ctx.fill();

      // Lit side (top-left)
      ctx.fillStyle = t.colorLight;
      ctx.beginPath();
      ctx.moveTo(24, t.y - t.h);
      ctx.lineTo(24 - t.w / 2, t.y);
      ctx.lineTo(24, t.y);
      ctx.closePath();
      ctx.fill();
    });

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Stone Fountain (64x64px) for Town Square
   */
  public static getFountainSprite(frame: number = 0): HTMLCanvasElement {
    const key = `fountain_${frame % 4}`;
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(64, 64);

    // Shadow
    ctx.fillStyle = "rgba(10, 20, 15, 0.45)";
    ctx.beginPath();
    ctx.ellipse(32, 52, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer stone basin
    ctx.fillStyle = this.PALETTE.stoneDark;
    ctx.beginPath();
    ctx.ellipse(32, 42, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.PALETTE.stoneBase;
    ctx.beginPath();
    ctx.ellipse(32, 40, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water in basin
    ctx.fillStyle = this.PALETTE.waterBase;
    ctx.beginPath();
    ctx.ellipse(32, 39, 21, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water shimmer
    ctx.fillStyle = this.PALETTE.waterLight;
    ctx.beginPath();
    ctx.ellipse(32, 38, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Central stone pillar
    ctx.fillStyle = this.PALETTE.stoneDark;
    ctx.fillRect(28, 18, 8, 20);
    ctx.fillStyle = this.PALETTE.stoneBase;
    ctx.fillRect(29, 18, 6, 20);
    ctx.fillStyle = this.PALETTE.stoneLight;
    ctx.fillRect(29, 18, 2, 20);

    // Top tier basin
    ctx.fillStyle = this.PALETTE.stoneBase;
    ctx.beginPath();
    ctx.ellipse(32, 18, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water jet
    ctx.fillStyle = this.PALETTE.waterFoam;
    const jetHeight = 6 + (frame % 3);
    ctx.fillRect(31, 18 - jetHeight, 2, jetHeight);
    ctx.fillRect(30, 18 - jetHeight + 1, 4, 2);

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Street Lantern (24x48px) with warm golden glow
   */
  public static getLanternSprite(isNight: boolean = false): HTMLCanvasElement {
    const key = `lantern_${isNight ? "night" : "day"}`;
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(32, 48);

    // Post
    ctx.fillStyle = "#263238";
    ctx.fillRect(15, 14, 3, 32);
    ctx.fillStyle = "#455a64";
    ctx.fillRect(15, 14, 1, 32);

    // Base footing
    ctx.fillStyle = "#263238";
    ctx.fillRect(13, 44, 7, 4);

    // Lamp cage
    ctx.fillStyle = "#263238";
    ctx.fillRect(11, 4, 11, 12);

    // Glass / Light
    ctx.fillStyle = isNight ? "#ffeb3b" : "#ffe082";
    ctx.fillRect(13, 6, 7, 8);

    // Bright core
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(15, 8, 3, 4);

    // Glow aura if night
    if (isNight) {
      const glow = ctx.createRadialGradient(16, 10, 2, 16, 10, 16);
      glow.addColorStop(0, "rgba(255, 235, 59, 0.4)");
      glow.addColorStop(1, "rgba(255, 235, 59, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(16, 10, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render 3/4 Perspective Building Exterior (Rich Painted Pixel Art)
   */
  public static renderBuilding(
    ctx: CanvasRenderingContext2D,
    b: {
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      roofColor: string;
      wallColor: string;
      accentColor: string;
      signText: string;
      signType: string;
    },
    isNight: boolean = false
  ) {
    const x = b.x;
    const y = b.y;
    const w = b.width;
    const h = b.height;

    // Drop shadow
    ctx.fillStyle = "rgba(10, 18, 12, 0.4)";
    ctx.fillRect(x - w / 2 + 6, y - h / 2 + 10, w, h + 12);

    // Main Wall Base (Front & Sides)
    const wallY = y - h / 2 + 40;
    const wallH = h - 40;
    ctx.fillStyle = b.wallColor;
    ctx.fillRect(x - w / 2, wallY, w, wallH);

    // Wall plank / stone texture lines
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    for (let py = wallY + 12; py < wallY + wallH; py += 12) {
      ctx.fillRect(x - w / 2, py, w, 1);
    }

    // Timber corner posts & beams
    ctx.fillStyle = this.PALETTE.woodDark;
    ctx.fillRect(x - w / 2, wallY, 8, wallH);
    ctx.fillRect(x + w / 2 - 8, wallY, 8, wallH);
    ctx.fillRect(x - w / 2, wallY + wallH - 6, w, 6);

    ctx.fillStyle = this.PALETTE.woodBase;
    ctx.fillRect(x - w / 2 + 2, wallY, 4, wallH);
    ctx.fillRect(x + w / 2 - 6, wallY, 4, wallH);

    // Roof (Gabled 3/4 perspective roof)
    const roofY = y - h / 2;
    const roofH = 48;
    const roofOverhang = 12;

    // Roof Dark Shading (underside/right)
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x - w / 2 - roofOverhang, roofY + roofH - 4, w + roofOverhang * 2, 4);

    // Roof Body
    ctx.fillStyle = b.roofColor;
    ctx.fillRect(x - w / 2 - roofOverhang, roofY, w + roofOverhang * 2, roofH);

    // Roof Shingle Highlight lines
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(x - w / 2 - roofOverhang, roofY, w + roofOverhang * 2, 3);
    for (let sy = roofY + 10; sy < roofY + roofH; sy += 10) {
      ctx.fillRect(x - w / 2 - roofOverhang, sy, w + roofOverhang * 2, 2);
    }

    // Chimney on Tavern & Forge & Cottage
    if (b.signType === "tavern" || b.signType === "forge" || b.signType === "cottage" || b.signType === "farmhouse") {
      const chimX = x + w / 2 - 24;
      const chimY = roofY - 14;
      ctx.fillStyle = this.PALETTE.stoneDark;
      ctx.fillRect(chimX, chimY, 14, 20);
      ctx.fillStyle = this.PALETTE.stoneBase;
      ctx.fillRect(chimX + 2, chimY, 10, 18);
      ctx.fillStyle = "#263238";
      ctx.fillRect(chimX - 1, chimY, 16, 4);

      // Warm smoke particles
      ctx.fillStyle = "rgba(230, 230, 230, 0.45)";
      ctx.beginPath();
      ctx.arc(chimX + 7, chimY - 4, 4, 0, Math.PI * 2);
      ctx.arc(chimX + 11, chimY - 10, 6, 0, Math.PI * 2);
      ctx.arc(chimX + 16, chimY - 18, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Windows (Glowing warm light)
    const winY = wallY + 16;
    const winW = 18;
    const winH = 22;
    const windowPositions = [x - w / 2 + 24, x + w / 2 - 42];

    windowPositions.forEach(wx => {
      // Frame
      ctx.fillStyle = this.PALETTE.woodDark;
      ctx.fillRect(wx - 2, winY - 2, winW + 4, winH + 4);

      // Glass (Warm amber if dusk/night, sky blue if day)
      ctx.fillStyle = isNight ? "#ffb74d" : "#e0f7fa";
      ctx.fillRect(wx, winY, winW, winH);

      // Window panes
      ctx.fillStyle = this.PALETTE.woodDark;
      ctx.fillRect(wx + winW / 2 - 1, winY, 2, winH);
      ctx.fillRect(wx, winY + winH / 2 - 1, winW, 2);

      // Flower box under window
      ctx.fillStyle = this.PALETTE.woodBase;
      ctx.fillRect(wx - 3, winY + winH + 1, winW + 6, 5);
      ctx.fillStyle = "#e91e63";
      ctx.fillRect(wx, winY + winH - 1, 4, 3);
      ctx.fillStyle = "#ffd54f";
      ctx.fillRect(wx + 7, winY + winH - 1, 4, 3);
      ctx.fillStyle = "#81c784";
      ctx.fillRect(wx + 13, winY + winH - 1, 4, 3);
    });

    // Central Door
    const doorW = 26;
    const doorH = 38;
    const doorX = x - doorW / 2;
    const doorY = wallY + wallH - doorH;

    // Door Frame
    ctx.fillStyle = this.PALETTE.woodDark;
    ctx.fillRect(doorX - 2, doorY - 3, doorW + 4, doorH + 3);

    // Door Planks
    ctx.fillStyle = this.PALETTE.woodBase;
    ctx.fillRect(doorX, doorY, doorW, doorH);

    // Plank lines & brass handle
    ctx.fillStyle = this.PALETTE.woodDark;
    ctx.fillRect(doorX + doorW / 2 - 1, doorY, 2, doorH);
    ctx.fillStyle = "#ffd54f";
    ctx.fillRect(doorX + doorW - 6, doorY + doorH / 2, 3, 3);

    // Hanging Wooden Sign above Door
    const signW = 76;
    const signH = 18;
    const signX = x - signW / 2;
    const signY = doorY - 26;

    // Chains
    ctx.fillStyle = "#37474f";
    ctx.fillRect(signX + 10, signY - 6, 2, 6);
    ctx.fillRect(signX + signW - 12, signY - 6, 2, 6);

    // Board
    ctx.fillStyle = this.PALETTE.woodDark;
    ctx.fillRect(signX - 1, signY - 1, signW + 2, signH + 2);
    ctx.fillStyle = this.PALETTE.woodPlank;
    ctx.fillRect(signX, signY, signW, signH);

    // Sign Text
    ctx.fillStyle = "#2c1802";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.signText, x, signY + signH / 2);

    // Special Building Props
    if (b.signType === "forge") {
      // Anvil outside
      ctx.fillStyle = "#37474f";
      ctx.fillRect(x + w / 2 - 30, wallY + wallH - 14, 14, 14);
      ctx.fillStyle = "#78909c";
      ctx.fillRect(x + w / 2 - 32, wallY + wallH - 14, 18, 5);
    } else if (b.signType === "store") {
      // Fruit barrels
      ctx.fillStyle = this.PALETTE.woodBase;
      ctx.beginPath();
      ctx.arc(x - w / 2 + 18, wallY + wallH - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e53935";
      ctx.fillRect(x - w / 2 + 15, wallY + wallH - 12, 6, 6);
    }
  }

  /**
   * Render 8-Directional Character Sprite (32x32px)
   */
  public static renderCharacter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    char: {
      name: string;
      direction: string;
      isMoving: boolean;
      color: string;
      secondaryColor: string;
      hairColor: string;
      id?: string;
    },
    animTick: number = 0
  ) {
    // Soft shadow
    ctx.fillStyle = "rgba(12, 24, 16, 0.4)";
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const walkOffset = char.isMoving ? Math.sin(animTick * 8) * 2 : 0;
    const legOffset = char.isMoving ? Math.sin(animTick * 8) * 3 : 0;

    // Body baseline y
    const cy = y - 10 + walkOffset;

    // Legs / Shoes / Beach shorts
    ctx.fillStyle = char.name.toLowerCase().includes("kai") || char.name.toLowerCase().includes("isla") ? "#00838f" : "#212121";
    if (char.direction.includes("up") || char.direction.includes("down")) {
      ctx.fillRect(x - 5, cy + 18 + legOffset, 4, 6);
      ctx.fillRect(x + 1, cy + 18 - legOffset, 4, 6);
    } else {
      ctx.fillRect(x - 4 + legOffset, cy + 18, 4, 6);
      ctx.fillRect(x + 1 - legOffset, cy + 18, 4, 6);
    }

    // Torso / Shirt (Primary Color)
    ctx.fillStyle = char.color;
    ctx.fillRect(x - 6, cy + 6, 12, 13);

    // Torso Trim / Vest (Secondary Color)
    ctx.fillStyle = char.secondaryColor;
    ctx.fillRect(x - 4, cy + 8, 8, 10);

    // Arms
    ctx.fillStyle = char.color;
    if (char.direction === "left") {
      ctx.fillRect(x - 8, cy + 7, 3, 9);
    } else if (char.direction === "right") {
      ctx.fillRect(x + 5, cy + 7, 3, 9);
    } else {
      ctx.fillRect(x - 8, cy + 7, 3, 9);
      ctx.fillRect(x + 5, cy + 7, 3, 9);
    }

    // Hands (Tan skin for Kai, peach for others)
    ctx.fillStyle = char.name.toLowerCase().includes("kai") ? "#d7a15c" : "#ffcc80";
    ctx.fillRect(x - 8, cy + 15, 3, 3);
    ctx.fillRect(x + 5, cy + 15, 3, 3);

    // Head / Face
    ctx.fillStyle = char.name.toLowerCase().includes("kai") ? "#d7a15c" : "#ffcc80";
    ctx.fillRect(x - 6, cy - 6, 12, 12);

    // Hair Base
    ctx.fillStyle = char.hairColor;
    ctx.fillRect(x - 7, cy - 9, 14, 6);
    ctx.fillRect(x - 7, cy - 6, 3, 8);
    ctx.fillRect(x + 4, cy - 6, 3, 8);

    // Specific Character Accents on World Map
    const lowerName = (char.name || "").toLowerCase();
    if (lowerName.includes("maya")) {
      // Maya's signature red bandana
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(x - 7, cy - 8, 14, 3);
      // Bandana tie knot on side
      ctx.fillRect(x + 5, cy - 7, 3, 4);
    } else if (lowerName.includes("isla")) {
      // Isla's sun visor / floral clip
      ctx.fillStyle = "#ffb300";
      ctx.fillRect(x - 6, cy - 8, 12, 2);
    } else if (lowerName.includes("marina")) {
      // Marina's starfish hair accessory
      ctx.fillStyle = "#ba68c8";
      ctx.fillRect(x + 4, cy - 7, 3, 3);
    }

    // Facial features based on direction
    ctx.fillStyle = "#212121";
    if (char.direction === "down" || char.direction.includes("down")) {
      // Eyes
      ctx.fillRect(x - 4, cy - 2, 2, 3);
      ctx.fillRect(x + 2, cy - 2, 2, 3);
      // Friendly smile
      ctx.fillStyle = "#d84315";
      ctx.fillRect(x - 2, cy + 3, 4, 1);
    } else if (char.direction === "left" || char.direction.includes("left")) {
      ctx.fillRect(x - 5, cy - 2, 2, 3);
    } else if (char.direction === "right" || char.direction.includes("right")) {
      ctx.fillRect(x + 3, cy - 2, 2, 3);
    }
    // Up shows back of hair
    if (char.direction === "up" || char.direction.includes("up")) {
      ctx.fillStyle = char.hairColor;
      ctx.fillRect(x - 6, cy - 6, 12, 10);
      if (lowerName.includes("maya")) {
        ctx.fillStyle = "#d32f2f";
        ctx.fillRect(x - 7, cy - 7, 14, 3);
      }
    }

    // Dark outline rim
    ctx.strokeStyle = "rgba(20, 10, 5, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6.5, cy - 8.5, 13, 27);
  }

  /**
   * Render High-Definition Expressive NPC Portrait for Dialogue Modal (128x128px)
   */
  public static renderPortrait(
    canvas: HTMLCanvasElement,
    npcId: string,
    emotion: "neutral" | "happy" | "touched" | "thoughtful" | "surprised" | "warm" | "annoyed" | "excited",
    hairColor: string,
    skinColor: string = "#ffd59e",
    accessoryColor: string = "#2e7d32",
    blink: boolean = false,
    talkFrame: number = 0,
    idleTick: number = 0
  ) {
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 128, 128);

    // Warm Sunset/Parchment Frame Background
    const bgGrad = ctx.createLinearGradient(0, 0, 128, 128);
    bgGrad.addColorStop(0, "#fbf6e2");
    bgGrad.addColorStop(1, "#eadbb6");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 128, 128);

    // Idle breathing offset
    const breatheY = Math.sin(idleTick * 0.08) * 1.5;

    // Soft portrait rim gradient
    const rimGrad = ctx.createRadialGradient(64, 64 + breatheY, 40, 64, 64, 64);
    rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.25)");
    rimGrad.addColorStop(1, "rgba(93, 64, 55, 0.35)");
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, 128, 128);

    // Shoulders / Garment
    ctx.fillStyle = accessoryColor;
    ctx.beginPath();
    ctx.ellipse(64, 120 + breatheY * 0.5, 48, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Specific Garment Trim per NPC
    if (npcId === "maya") {
      // Maya's coral halter top & puka shell necklace
      ctx.fillStyle = "#ff7043";
      ctx.beginPath();
      ctx.moveTo(42, 102 + breatheY);
      ctx.lineTo(86, 102 + breatheY);
      ctx.lineTo(64, 124 + breatheY);
      ctx.closePath();
      ctx.fill();
      // Shell beads
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(58, 88 + breatheY, 2.5, 0, Math.PI * 2);
      ctx.arc(64, 91 + breatheY, 3, 0, Math.PI * 2);
      ctx.arc(70, 88 + breatheY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (npcId === "kai") {
      // Open linen beach shirt & cord necklace
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(48, 96 + breatheY, 32, 28);
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(63, 90 + breatheY, 2, 16);
      ctx.fillStyle = "#fff8e1";
      ctx.fillRect(62, 104 + breatheY, 4, 6);
    } else {
      // Collar trim
      ctx.fillStyle = "#fff8e1";
      ctx.fillRect(52, 94 + breatheY, 24, 12);
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(63, 94 + breatheY, 2, 34);
    }

    // Neck
    const activeSkin = npcId === "kai" ? "#d7a15c" : skinColor;
    ctx.fillStyle = activeSkin;
    ctx.fillRect(54, 78 + breatheY, 20, 20);

    // Hair Back (Layered locks)
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(64, 44 + breatheY, 34, 0, Math.PI * 2);
    ctx.fill();

    // Head Base
    ctx.fillStyle = activeSkin;
    ctx.beginPath();
    ctx.ellipse(64, 54 + breatheY, 28, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cheeks Blush / Freckles
    if (npcId === "isla") {
      // Freckles
      ctx.fillStyle = "#bcaaa4";
      ctx.fillRect(46, 62 + breatheY, 2, 2);
      ctx.fillRect(51, 64 + breatheY, 2, 2);
      ctx.fillRect(77, 64 + breatheY, 2, 2);
      ctx.fillRect(82, 62 + breatheY, 2, 2);
    }
    if (emotion === "happy" || emotion === "warm" || emotion === "touched" || emotion === "excited") {
      ctx.fillStyle = "rgba(239, 83, 80, 0.4)";
      ctx.beginPath();
      ctx.ellipse(45, 62 + breatheY, 7, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(83, 62 + breatheY, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // NPC Unique Hair & Accessories
    if (npcId === "maya") {
      // Maya's signature crimson bandana tied across brow with fold details
      ctx.fillStyle = "#d32f2f";
      ctx.beginPath();
      ctx.moveTo(34, 38 + breatheY);
      ctx.quadraticCurveTo(64, 30 + breatheY, 94, 38 + breatheY);
      ctx.lineTo(96, 46 + breatheY);
      ctx.quadraticCurveTo(64, 38 + breatheY, 32, 46 + breatheY);
      ctx.closePath();
      ctx.fill();
      // Bandana knot & hanging ends
      ctx.fillStyle = "#b71c1c";
      ctx.beginPath();
      ctx.arc(96, 42 + breatheY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(94, 46 + breatheY, 5, 16);
      ctx.fillRect(98, 48 + breatheY, 4, 12);
      // Flowing wavy bangs framing face
      ctx.fillStyle = hairColor;
      ctx.fillRect(36, 44 + breatheY, 8, 22);
      ctx.fillRect(84, 44 + breatheY, 8, 22);
    } else if (npcId === "isla") {
      // Isla's wavy beach curls & shell choker
      ctx.fillStyle = hairColor;
      ctx.fillRect(34, 42 + breatheY, 10, 26);
      ctx.fillRect(84, 42 + breatheY, 10, 26);
      // Golden sun shimmer highlight
      ctx.fillStyle = "#fff59d";
      ctx.fillRect(48, 22 + breatheY, 16, 4);
    } else if (npcId === "marina") {
      // Marina's ocean-cyan waves & purple starfish clip
      ctx.fillStyle = "#ab47bc";
      ctx.beginPath();
      ctx.arc(88, 36 + breatheY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e1bee7";
      ctx.fillRect(87, 35 + breatheY, 2, 2);
    } else if (npcId === "kai") {
      // Kai's wind-tousled spiked bangs
      ctx.fillStyle = hairColor;
      ctx.fillRect(44, 28 + breatheY, 12, 10);
      ctx.fillRect(58, 24 + breatheY, 16, 12);
    } else if (npcId === "mira") {
      // Emerald woven headband
      ctx.fillStyle = "#2e7d32";
      ctx.fillRect(36, 36 + breatheY, 56, 7);
      ctx.fillStyle = "#81c784";
      ctx.fillRect(36, 37 + breatheY, 56, 2);
      // Wild flowers tucked in hair
      ctx.fillStyle = "#64b5f6";
      ctx.fillRect(86, 32 + breatheY, 6, 6);
    } else if (npcId === "elara") {
      // Soot smudge on cheek
      ctx.fillStyle = "rgba(55, 71, 79, 0.5)";
      ctx.fillRect(76, 58 + breatheY, 8, 4);
    } else if (npcId === "silas") {
      // Wire-rimmed spectacles
      ctx.strokeStyle = "#cfd8dc";
      ctx.lineWidth = 3;
      ctx.strokeRect(44, 48 + breatheY, 14, 10);
      ctx.strokeRect(70, 48 + breatheY, 14, 10);
      ctx.beginPath();
      ctx.moveTo(58, 53 + breatheY);
      ctx.lineTo(70, 53 + breatheY);
      ctx.stroke();
    } else if (npcId === "rowan") {
      // Ginger trimmed beard
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.ellipse(64, 72 + breatheY, 22, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (npcId === "finn") {
      // Wood shavings in hair
      ctx.fillStyle = "#ffe082";
      ctx.fillRect(48, 26 + breatheY, 4, 4);
      ctx.fillRect(76, 30 + breatheY, 5, 3);
    } else if (npcId === "cora") {
      // Braided hair crown & pearl pin
      ctx.fillStyle = "#d81b60";
      ctx.fillRect(40, 24 + breatheY, 48, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(62, 22 + breatheY, 5, 5);
    }

    // Eyes
    ctx.fillStyle = "#212121";
    if (blink) {
      // Blinking lines
      ctx.fillRect(46, 52 + breatheY, 12, 3);
      ctx.fillRect(70, 52 + breatheY, 12, 3);
    } else if (emotion === "happy" || emotion === "warm") {
      // Curved happy eyes ^ ^
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#212121";
      ctx.beginPath();
      ctx.arc(52, 54 + breatheY, 6, Math.PI, 0);
      ctx.arc(76, 54 + breatheY, 6, Math.PI, 0);
      ctx.stroke();
    } else if (emotion === "surprised") {
      // Wide open round eyes
      ctx.beginPath();
      ctx.arc(52, 52 + breatheY, 6, 0, Math.PI * 2);
      ctx.arc(76, 52 + breatheY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(50, 50 + breatheY, 3, 3);
      ctx.fillRect(74, 50 + breatheY, 3, 3);
    } else {
      // Standard expressive eyes with catchlight
      ctx.fillRect(47, 49 + breatheY, 10, 8);
      ctx.fillRect(71, 49 + breatheY, 10, 8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(49, 50 + breatheY, 4, 3);
      ctx.fillRect(73, 50 + breatheY, 4, 3);
    }

    // Eyebrows
    ctx.fillStyle = hairColor;
    if (emotion === "thoughtful") {
      ctx.fillRect(46, 43 + breatheY, 12, 3);
      ctx.fillRect(70, 41 + breatheY, 12, 3);
    } else if (emotion === "surprised") {
      ctx.fillRect(46, 40 + breatheY, 12, 3);
      ctx.fillRect(70, 40 + breatheY, 12, 3);
    } else {
      ctx.fillRect(46, 44 + breatheY, 12, 3);
      ctx.fillRect(70, 44 + breatheY, 12, 3);
    }

    // Nose
    ctx.fillStyle = "#e0a96d";
    ctx.fillRect(62, 58 + breatheY, 4, 6);

    // Mouth (Animated while typing)
    const mouthOpen = talkFrame % 2 === 1;
    ctx.fillStyle = "#c2185b";
    if (mouthOpen) {
      ctx.fillRect(58, 69 + breatheY, 12, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(60, 69 + breatheY, 8, 2);
    } else if (emotion === "happy" || emotion === "warm" || emotion === "excited") {
      ctx.beginPath();
      ctx.arc(64, 68 + breatheY, 8, 0, Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(59, 70 + breatheY, 10, 3);
    }

    // Floating Emote Particles based on Reaction
    const emoteOffset = Math.sin(idleTick * 0.12) * 3;
    if (emotion === "warm" || emotion === "touched") {
      // Floating Pink Hearts
      ctx.fillStyle = "#e91e63";
      ctx.beginPath();
      ctx.arc(20, 26 + emoteOffset, 5, 0, Math.PI * 2);
      ctx.arc(28, 26 + emoteOffset, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(15, 28 + emoteOffset);
      ctx.lineTo(33, 28 + emoteOffset);
      ctx.lineTo(24, 38 + emoteOffset);
      ctx.closePath();
      ctx.fill();
    } else if (emotion === "happy" || emotion === "excited") {
      // Sparkling Golden Stars
      ctx.fillStyle = "#ffd54f";
      const sx = 104;
      const sy = 24 + emoteOffset;
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(sx - 1, sy - 4, 2, 8);
      ctx.fillRect(sx - 4, sy - 1, 8, 2);
    } else if (emotion === "thoughtful") {
      // Glowing Question / Lightbulb Bubble
      ctx.fillStyle = "#64b5f6";
      ctx.beginPath();
      ctx.arc(104, 26 + emoteOffset, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("?", 102, 30 + emoteOffset);
    } else if (emotion === "surprised") {
      // Surprise Exclamation Mark
      ctx.fillStyle = "#ff7043";
      ctx.beginPath();
      ctx.arc(104, 26 + emoteOffset, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("!", 102, 30 + emoteOffset);
    }

    // Chunky Brass & Dark Wood Outer Border
    ctx.strokeStyle = "#3e2723";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 122, 122);

    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 116, 116);

    // Corner brass studs
    ctx.fillStyle = "#ffd54f";
    ctx.fillRect(6, 6, 6, 6);
    ctx.fillRect(116, 6, 6, 6);
    ctx.fillRect(6, 116, 6, 6);
    ctx.fillRect(116, 116, 6, 6);
  }

  /**
   * Render Tilled Soil Tile
   */
  public static getTilledTile(watered: boolean = false): HTMLCanvasElement {
    const key = `tilled_${watered ? "wet" : "dry"}`;
    if (this.tileCache.has(key)) return this.tileCache.get(key)!;

    const { canvas, ctx } = this.createCanvas(32, 32);

    const baseColor = watered ? "#3e2723" : "#6d4c41";
    const ridgeDark = watered ? "#27160c" : "#4e342e";
    const ridgeLight = watered ? "#5d4037" : "#8d6e63";

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 32, 32);

    // Tilled furrows / ridges
    for (let y = 3; y < 30; y += 8) {
      ctx.fillStyle = ridgeDark;
      ctx.fillRect(2, y, 28, 4);
      ctx.fillStyle = ridgeLight;
      ctx.fillRect(2, y + 4, 28, 2);
    }

    if (watered) {
      // Wet sheen sparkles
      ctx.fillStyle = "rgba(129, 212, 250, 0.4)";
      ctx.fillRect(6, 6, 3, 2);
      ctx.fillRect(18, 14, 3, 2);
      ctx.fillRect(10, 22, 3, 2);
    }

    this.tileCache.set(key, canvas);
    return canvas;
  }

  /**
   * Render Crops in Growth Stages
   */
  public static renderCrop(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    crop: { cropId: string; stage: number; maxStages: number; harvestItemId: string },
    animTick: number
  ) {
    const sway = Math.sin(animTick * 2 + x) * 1.5;

    if (crop.stage === 0) {
      // Stage 0: Planted seeds / mound
      ctx.fillStyle = "#8d6e63";
      ctx.beginPath();
      ctx.ellipse(x, y + 4, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff8e1";
      ctx.fillRect(x - 2, y + 3, 2, 2);
      ctx.fillRect(x + 1, y + 4, 2, 2);
    } else if (crop.stage === 1) {
      // Stage 1: Green Sprout
      ctx.fillStyle = "#43a047";
      ctx.fillRect(x - 1, y - 2, 2, 8);
      ctx.beginPath();
      ctx.ellipse(x - 3 + sway * 0.5, y - 2, 3, 2, -0.4, 0, Math.PI * 2);
      ctx.ellipse(x + 3 + sway * 0.5, y - 2, 3, 2, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (crop.stage === 2) {
      // Stage 2: Growing Bushy Plant
      ctx.fillStyle = "#2e7d32";
      ctx.beginPath();
      ctx.arc(x + sway, y - 4, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#66bb6a";
      ctx.beginPath();
      ctx.arc(x + sway - 2, y - 6, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Stage 3: Mature Crop ready for harvest
      ctx.fillStyle = "#1b5e20";
      ctx.beginPath();
      ctx.arc(x + sway, y - 6, 10, 0, Math.PI * 2);
      ctx.fill();

      if (crop.cropId.includes("strawberry")) {
        // Red Strawberries
        ctx.fillStyle = "#e53935";
        ctx.beginPath();
        ctx.arc(x - 4 + sway, y - 4, 4, 0, Math.PI * 2);
        ctx.arc(x + 4 + sway, y - 6, 4, 0, Math.PI * 2);
        ctx.arc(x + sway, y - 1, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff9c4";
        ctx.fillRect(x - 4 + sway, y - 4, 1, 1);
        ctx.fillRect(x + 4 + sway, y - 6, 1, 1);
      } else if (crop.cropId.includes("wheat")) {
        // Golden Wheat Stalks
        ctx.fillStyle = "#fbc02d";
        for (let i = -6; i <= 6; i += 4) {
          ctx.fillRect(x + i + sway, y - 16, 3, 16);
          ctx.fillStyle = "#ffd54f";
          ctx.beginPath();
          ctx.ellipse(x + i + sway + 1, y - 18, 3, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fbc02d";
        }
      } else {
        // Pumpkin
        ctx.fillStyle = "#f57c00";
        ctx.beginPath();
        ctx.arc(x + sway, y - 4, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffb74d";
        ctx.beginPath();
        ctx.arc(x + sway - 2, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#33691e";
        ctx.fillRect(x + sway - 1, y - 14, 3, 5);
      }

      // Ready harvest sparkle
      const sparkleAlpha = 0.5 + Math.sin(animTick * 4) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
      ctx.fillRect(x - 6, y - 16, 3, 3);
      ctx.fillRect(x + 6, y - 12, 2, 2);
    }
  }

  /**
   * Render Interior Rooms with warm flooring, walls, lighting and furniture
   */
  public static renderInteriorRoom(
    ctx: CanvasRenderingContext2D,
    room: any,
    animTick: number
  ) {
    const { width, height, wallColor, floorType, doorX, doorY, furniture } = room;

    // Room Outer Wall / Border
    ctx.fillStyle = "#14180d";
    ctx.fillRect(-20, -20, width + 40, height + 40);

    // North Wall
    ctx.fillStyle = wallColor;
    ctx.fillRect(0, 0, width, 70);

    // Wall top trim moulding
    ctx.fillStyle = "#ffd180";
    ctx.fillRect(0, 0, width, 5);
    ctx.fillStyle = "#4a2e19";
    ctx.fillRect(0, 66, width, 4);

    // Floor
    if (floorType === "checker") {
      const tileSize = 32;
      for (let y = 70; y < height; y += tileSize) {
        for (let x = 0; x < width; x += tileSize) {
          const isWhite = ((x / tileSize) + (y / tileSize)) % 2 === 0;
          ctx.fillStyle = isWhite ? "#eceff1" : "#78909c";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    } else if (floorType === "stone") {
      const cobble = this.getCobblestoneTile();
      for (let y = 70; y < height; y += 32) {
        for (let x = 0; x < width; x += 32) {
          ctx.drawImage(cobble, x, y);
        }
      }
    } else if (floorType === "carpet") {
      ctx.fillStyle = "#4a148c";
      ctx.fillRect(0, 70, width, height - 70);
      ctx.fillStyle = "#6a1b9a";
      for (let y = 70; y < height; y += 24) {
        ctx.fillRect(0, y, width, 2);
      }
    } else {
      // Wood floorboards
      for (let y = 70; y < height; y += 20) {
        const isAlt = (y / 20) % 2 === 0;
        ctx.fillStyle = isAlt ? "#8d6e63" : "#795548";
        ctx.fillRect(0, y, width, 18);
        ctx.fillStyle = "#4e342e";
        ctx.fillRect(0, y + 18, width, 2);
        // Vertical seam
        for (let x = (isAlt ? 40 : 80); x < width; x += 80) {
          ctx.fillRect(x, y, 2, 18);
        }
      }
    }

    // Doorway / Exit Mat
    ctx.fillStyle = "#ffd180";
    ctx.fillRect(doorX - 24, doorY - 12, 48, 24);
    ctx.fillStyle = "#4a2e19";
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EXIT", doorX, doorY + 4);

    // Render Furniture items
    if (furniture) {
      furniture.forEach((f: any) => {
        this.renderFurniture(ctx, f, animTick);
      });
    }
  }

  /**
   * Render Individual Furniture Items
   */
  public static renderFurniture(ctx: CanvasRenderingContext2D, f: any, animTick: number) {
    const { x, y, width, height, type, label, color } = f;

    switch (type) {
      case "hearth": {
        // Stone Fireplace with animated flames
        ctx.fillStyle = "#424242";
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
        ctx.fillStyle = "#212121";
        ctx.fillRect(x - width / 2 + 10, y - height / 2 + 15, width - 20, height - 15);

        // Animated fire
        const flameH = 15 + Math.sin(animTick * 8) * 4;
        ctx.fillStyle = "#ff6f00";
        ctx.beginPath();
        ctx.arc(x, y + 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffeb3b";
        ctx.beginPath();
        ctx.arc(x, y + 10 - flameH * 0.3, 7, 0, Math.PI * 2);
        ctx.fill();

        // Fire glow aura
        ctx.fillStyle = "rgba(255, 179, 0, 0.25)";
        ctx.beginPath();
        ctx.arc(x, y, 45, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case "bed": {
        // Bed frame
        ctx.fillStyle = "#4e342e";
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
        // Quilted blanket
        ctx.fillStyle = color || "#c62828";
        ctx.fillRect(x - width / 2 + 4, y - height / 2 + 20, width - 8, height - 24);
        // Pillow
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - width / 2 + 8, y - height / 2 + 4, width - 16, 14);
        break;
      }

      case "table":
      case "counter": {
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(x - width / 2 + 4, y + height / 2 - 8, 6, 10);
        ctx.fillRect(x + width / 2 - 10, y + height / 2 - 8, 6, 10);
        // Table top
        ctx.fillStyle = color || "#6d4c41";
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
        ctx.fillStyle = "#8d6e63";
        ctx.fillRect(x - width / 2 + 2, y - height / 2 + 2, width - 4, 4);
        break;
      }

      case "bookshelf":
      case "cabinet": {
        ctx.fillStyle = color || "#3e2723";
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
        ctx.fillStyle = "#4e342e";
        ctx.fillRect(x - width / 2 + 4, y - height / 2 + 4, width - 8, height - 8);
        // Book rows
        const bookColors = ["#c62828", "#1565c0", "#2e7d32", "#f57f17", "#6a1b9a", "#ffd54f"];
        for (let row = 0; row < 2; row++) {
          const rowY = y - height / 2 + 10 + row * 32;
          for (let bx = x - width / 2 + 8; bx < x + width / 2 - 12; bx += 8) {
            ctx.fillStyle = bookColors[(bx + row) % bookColors.length];
            ctx.fillRect(bx, rowY, 6, 20);
          }
        }
        break;
      }

      case "rug": {
        ctx.fillStyle = color || "#8d6e63";
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffd54f";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }

      case "anvil": {
        ctx.fillStyle = "#212121";
        ctx.fillRect(x - 14, y - 8, 28, 16);
        ctx.fillStyle = "#78909c";
        ctx.fillRect(x - 12, y - 14, 24, 8);
        ctx.fillRect(x + 10, y - 12, 8, 4);
        break;
      }

      default: {
        ctx.fillStyle = color || "#5d4037";
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
        break;
      }
    }

    if (label) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(x - 36, y - height / 2 - 14, 72, 12);
      ctx.fillStyle = "#fefae0";
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label.slice(0, 16), x, y - height / 2 - 5);
    }
  }

  /**
   * Render Farm Pet (Calico Cat "Mochi")
   */
  public static renderPet(
    ctx: CanvasRenderingContext2D,
    pet: {
      name: string;
      type: "cat" | "dog";
      x: number;
      y: number;
      direction: string;
      mood: string;
      hearts: number;
    },
    animTick: number = 0
  ) {
    const { x, y, direction, mood, name } = pet;

    // Shadow
    ctx.fillStyle = "rgba(10, 15, 8, 0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const breathe = Math.sin(animTick * 4) * 1.2;
    const tailWag = Math.sin(animTick * 6) * 4;

    // Cat Body (Calico: cream base with ginger & black patches)
    ctx.fillStyle = "#fff8e1"; // warm cream
    ctx.beginPath();
    ctx.ellipse(x, y + 2 + breathe * 0.5, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ginger patch
    ctx.fillStyle = "#e65100";
    ctx.beginPath();
    ctx.arc(x - 3, y + 1, 4, 0, Math.PI * 2);
    ctx.fill();

    // Dark patch
    ctx.fillStyle = "#37474f";
    ctx.beginPath();
    ctx.arc(x + 4, y + 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = "#e65100";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 2);
    ctx.quadraticCurveTo(x - 12 + tailWag, y - 4, x - 10 + tailWag * 1.5, y - 8);
    ctx.stroke();

    // Paws
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 6, y + 6, 3, 3);
    ctx.fillRect(x + 3, y + 6, 3, 3);

    // Head
    const headX = direction === "left" ? x - 4 : direction === "right" ? x + 4 : x;
    const headY = y - 4 + breathe * 0.5;

    ctx.fillStyle = "#fff8e1";
    ctx.beginPath();
    ctx.arc(headX, headY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Cat Ears
    ctx.fillStyle = "#e65100";
    ctx.beginPath();
    ctx.moveTo(headX - 6, headY - 3);
    ctx.lineTo(headX - 3, headY - 9);
    ctx.lineTo(headX - 1, headY - 4);
    ctx.fill();

    ctx.fillStyle = "#37474f";
    ctx.beginPath();
    ctx.moveTo(headX + 1, headY - 4);
    ctx.lineTo(headX + 3, headY - 9);
    ctx.lineTo(headX + 6, headY - 3);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#2e7d32"; // green cat eyes
    if (mood === "purring" || mood === "sleepy") {
      // Happy closed eye curves
      ctx.strokeStyle = "#212121";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(headX - 2.5, headY, 2, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(headX + 2.5, headY, 2, Math.PI, 0);
      ctx.stroke();
    } else {
      ctx.fillRect(headX - 3.5, headY - 1, 2, 2.5);
      ctx.fillRect(headX + 1.5, headY - 1, 2, 2.5);
    }

    // Little pink nose
    ctx.fillStyle = "#f48fb1";
    ctx.fillRect(headX - 0.5, headY + 1.5, 1.5, 1);

    // Name tag & mood
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(x - 22, y - 18, 44, 10);
    ctx.fillStyle = "#ffe082";
    ctx.font = "bold 7px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${name} ${mood === "purring" ? "❤️" : "🐾"}`, x, y - 11);
  }
}


