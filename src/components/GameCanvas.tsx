import React, { useEffect, useRef, useState, useCallback } from "react";
import { PixelRenderer } from "../engine/pixelRenderer";
import { audioEngine } from "../engine/audioEngine";
import { BUILDINGS, WORLD_WIDTH, WORLD_HEIGHT } from "../data/worldData";
import { INTERIORS } from "../data/interiors";
import { ALL_ITEMS } from "../data/items";
import { FarmTile, FishingState, ForageNode, InteriorRoom, Item, NPCState, Position } from "../types";

interface GameCanvasProps {
  npcs: NPCState[];
  forageNodes: ForageNode[];
  farmTiles: FarmTile[];
  activeItem: Item | null;
  currentInterior: InteriorRoom | null;
  onEnterInterior: (interiorId: string) => void;
  onExitInterior: () => void;
  onInteractNPC: (npcId: string) => void;
  onCollectForage: (nodeId: string) => void;
  onFarmTileInteract: (tileId: string, toolOrItemId?: string) => void;
  onCatchFish: (fishItem: Item) => void;
  onInteractHearth?: () => void;
  onInteractBed?: () => void;
  onInteractFortune?: () => void;
  onInteractPet?: () => void;
  onInteractStation?: (stationType: string) => void;
  onSelectHotbarSlot?: (index: number) => void;
  pet?: any;
  floatingPops?: Array<{ id: string; x: number; y: number; text: string; color: string; createdAt: number; duration: number }>;
  gameTimeMinutes: number; // 0 to 1440
  weather: string;
  onPlayerPositionChange?: (pos: Position) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  type: "leaf" | "firefly" | "pollen" | "rain" | "water_splash";
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  npcs,
  forageNodes,
  farmTiles,
  activeItem,
  currentInterior,
  onEnterInterior,
  onExitInterior,
  onInteractNPC,
  onCollectForage,
  onFarmTileInteract,
  onCatchFish,
  onInteractHearth,
  onInteractBed,
  onInteractFortune,
  onInteractPet,
  onInteractStation,
  onSelectHotbarSlot,
  pet,
  floatingPops,
  gameTimeMinutes,
  weather,
  onPlayerPositionChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Player state ref
  const playerRef = useRef({
    x: 1200,
    y: 980,
    vx: 0,
    vy: 0,
    speed: 3.4,
    direction: "down" as "down" | "up" | "left" | "right",
    isMoving: false,
    color: "#0277bd",
    secondaryColor: "#ffb74d",
    hairColor: "#4e342e"
  });

  // Saved exterior position when entering interiors
  const exteriorPosRef = useRef({ x: 520, y: 720 });

  // Camera state ref
  const cameraRef = useRef({
    x: 1200,
    y: 980,
    width: 800,
    height: 600
  });

  // Input & Animation refs
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseTargetRef = useRef<{ x: number; y: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animTickRef = useRef(0);
  const footstepTimerRef = useRef(0);

  // Fishing state
  const fishingRef = useRef<FishingState>({
    isFishing: false,
    state: "idle",
    progress: 0,
    timer: 0
  });
  const [fishingUIState, setFishingUIState] = useState<FishingState>({
    isFishing: false,
    state: "idle",
    progress: 0,
    timer: 0
  });

  // State refs to keep animation loop decoupled from React state updates (prevents canvas re-mount flicker)
  const npcsRef = useRef(npcs);
  const forageNodesRef = useRef(forageNodes);
  const farmTilesRef = useRef(farmTiles);
  const activeItemRef = useRef(activeItem);
  const currentInteriorRef = useRef(currentInterior);
  const gameTimeRef = useRef(gameTimeMinutes);
  const weatherRef = useRef(weather);
  const petRef = useRef(pet);
  const floatingPopsRef = useRef(floatingPops);

  useEffect(() => { npcsRef.current = npcs; }, [npcs]);
  useEffect(() => { forageNodesRef.current = forageNodes; }, [forageNodes]);
  useEffect(() => { farmTilesRef.current = farmTiles; }, [farmTiles]);
  useEffect(() => { activeItemRef.current = activeItem; }, [activeItem]);
  useEffect(() => { currentInteriorRef.current = currentInterior; }, [currentInterior]);
  useEffect(() => { gameTimeRef.current = gameTimeMinutes; }, [gameTimeMinutes]);
  useEffect(() => { weatherRef.current = weather; }, [weather]);
  useEffect(() => { petRef.current = pet; }, [pet]);
  useEffect(() => { floatingPopsRef.current = floatingPops; }, [floatingPops]);

  // Target interaction prompt state
  const [nearbyInteractable, setNearbyInteractable] = useState<{
    type: "npc" | "forage" | "door" | "exit" | "farm" | "fish" | "hearth" | "bed" | "fortune" | "pet" | "station";
    id: string;
    name: string;
    x: number;
    y: number;
    actionLabel: string;
    stationType?: string;
  } | null>(null);

  // Initialize atmospheric particles
  useEffect(() => {
    const parts: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      parts.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        vx: (Math.random() - 0.5) * 0.8 + 0.3,
        vy: Math.random() * 0.5 + 0.2,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.5 ? "#81c784" : "#ffe082",
        alpha: Math.random() * 0.6 + 0.2,
        type: "leaf"
      });
    }
    particlesRef.current = parts;
  }, []);

  // Keyboard and Wheel input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in text inputs or textareas
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Hotbar numbers 1 through 9
      if (e.key >= "1" && e.key <= "9") {
        const slotIdx = parseInt(e.key) - 1;
        if (onSelectHotbarSlot) {
          onSelectHotbarSlot(slotIdx);
        }
        return;
      }

      keysRef.current[e.key.toLowerCase()] = true;

      // Quick interact key [E] or [Space] or [Enter]
      if (e.key === "e" || e.key === "E" || e.key === " " || e.key === "Enter") {
        if (fishingRef.current.isFishing) {
          handleFishingAction();
          return;
        }

        if (nearbyInteractable) {
          triggerInteractable(nearbyInteractable);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [nearbyInteractable, onSelectHotbarSlot]);

  // Execute interactable action
  const triggerInteractable = useCallback((target: any) => {
    if (!target) return;

    if (target.type === "npc") {
      onInteractNPC(target.id);
    } else if (target.type === "forage") {
      onCollectForage(target.id);
    } else if (target.type === "station") {
      if (onInteractStation && target.stationType) {
        onInteractStation(target.stationType);
      }
    } else if (target.type === "door") {
      // Save exterior coords before entering
      exteriorPosRef.current = { x: playerRef.current.x, y: playerRef.current.y };
      const room = INTERIORS[target.id];
      if (room) {
        playerRef.current.x = room.doorX;
        playerRef.current.y = room.doorY - 30;
        mouseTargetRef.current = null;
        audioEngine.playDoor();
        onEnterInterior(target.id);
      }
    } else if (target.type === "exit") {
      const exitCoords = currentInteriorRef.current?.exitTarget || exteriorPosRef.current;
      playerRef.current.x = exitCoords.x;
      playerRef.current.y = exitCoords.y;
      mouseTargetRef.current = null;
      audioEngine.playDoor();
      onExitInterior();
    } else if (target.type === "farm") {
      onFarmTileInteract(target.id, activeItemRef.current?.id);
    } else if (target.type === "fish") {
      startFishing();
    } else if (target.type === "hearth") {
      if (onInteractHearth) onInteractHearth();
    } else if (target.type === "bed") {
      if (onInteractBed) onInteractBed();
    } else if (target.type === "fortune") {
      if (onInteractFortune) onInteractFortune();
    } else if (target.type === "pet") {
      if (onInteractPet) onInteractPet();
    }
  }, [onInteractNPC, onCollectForage, onEnterInterior, onExitInterior, onFarmTileInteract, onInteractHearth, onInteractBed, onInteractFortune, onInteractPet, onInteractStation]);

  // Fishing Logic Handlers
  const startFishing = () => {
    if (fishingRef.current.isFishing) return;
    audioEngine.playWaterSplash();
    fishingRef.current = {
      isFishing: true,
      state: "waiting",
      progress: 0,
      timer: Date.now() + Math.random() * 2500 + 1500
    };
    setFishingUIState({ ...fishingRef.current });
  };

  const handleFishingAction = () => {
    const f = fishingRef.current;
    if (!f.isFishing) return;

    if (f.state === "bite") {
      // Hooked successfully!
      audioEngine.playItemPickup();
      const possibleFish = [ALL_ITEMS.rainbow_trout, ALL_ITEMS.whispering_bass, ALL_ITEMS.golden_carp];
      const caught = possibleFish[Math.floor(Math.random() * possibleFish.length)];
      f.state = "caught";
      f.targetItem = caught;
      setFishingUIState({ ...f });
      onCatchFish(caught);

      setTimeout(() => {
        fishingRef.current = { isFishing: false, state: "idle", progress: 0, timer: 0 };
        setFishingUIState({ ...fishingRef.current });
      }, 2000);
    } else if (f.state === "waiting") {
      // Reeled too early
      audioEngine.playUIClick();
      fishingRef.current = { isFishing: false, state: "idle", progress: 0, timer: 0 };
      setFishingUIState({ ...fishingRef.current });
    }
  };

  // Mouse / Touch click to move and interact
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (fishingRef.current.isFishing) {
        handleFishingAction();
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Transform screen space to world space
      const isInterior = !!currentInteriorRef.current;
      let worldX = clickX + (cameraRef.current.x - cameraRef.current.width / 2);
      let worldY = clickY + (cameraRef.current.y - cameraRef.current.height / 2);

      if (isInterior) {
        const room = currentInteriorRef.current!;
        worldX = clickX - (canvas.width / 2 - room.width / 2);
        worldY = clickY - (canvas.height / 2 - room.height / 2);

        // Check door exit click
        if (Math.hypot(worldX - room.doorX, worldY - room.doorY) < 40) {
          triggerInteractable({ type: "exit" });
          return;
        }
      } else {
        // Check NPC click
        for (const npc of npcsRef.current) {
          if (!npc.currentInteriorId && Math.hypot(npc.x - worldX, npc.y - worldY) < 36) {
            onInteractNPC(npc.id);
            return;
          }
        }

        // Check Forage click
        for (const node of forageNodesRef.current) {
          if (!node.collected && Math.hypot(node.x - worldX, node.y - worldY) < 32) {
            onCollectForage(node.id);
            return;
          }
        }

        // Check Farm Tile click
        for (const tile of farmTilesRef.current) {
          const fx = tile.tileX * 32 + 16;
          const fy = tile.tileY * 32 + 16;
          if (Math.hypot(fx - worldX, fy - worldY) < 24) {
            onFarmTileInteract(tile.id, activeItemRef.current?.id);
            return;
          }
        }

        // Check Building Door click
        for (const b of BUILDINGS) {
          if (Math.hypot(b.doorX - worldX, b.doorY - worldY) < 36) {
            triggerInteractable({ type: "door", id: b.id });
            return;
          }
        }

        // Check Lake Pier fishing click
        if (activeItemRef.current?.id === "fishing_rod" && worldX > 1700 && worldX < 1900 && worldY > 1200 && worldY < 1400) {
          startFishing();
          return;
        }
      }

      // Set smooth movement destination
      mouseTargetRef.current = { x: worldX, y: worldY };
    },
    [onInteractNPC, onCollectForage, onFarmTileInteract, triggerInteractable]
  );

  // Main 60FPS Game Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Resize observer
    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        cameraRef.current.width = canvas.width;
        cameraRef.current.height = canvas.height;
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    const checkCollision = (nx: number, ny: number): boolean => {
      const room = currentInteriorRef.current;
      if (room) {
        // Interior collision
        if (nx < 30 || nx > room.width - 30 || ny < 75 || ny > room.height - 30) {
          return true;
        }
        for (const f of room.furniture) {
          if (f.type !== "rug" && Math.abs(nx - f.x) < f.width / 2 + 10 && Math.abs(ny - f.y) < f.height / 2 + 10) {
            return true;
          }
        }
        return false;
      }

      // Exterior Map boundaries
      if (nx < 60 || nx > WORLD_WIDTH - 60 || ny < 80 || ny > WORLD_HEIGHT - 80) {
        return true;
      }

      // Building bounds collision
      for (const b of BUILDINGS) {
        const bxMin = b.x - b.width / 2 + 8;
        const bxMax = b.x + b.width / 2 - 8;
        const byMin = b.y - b.height / 2 + 20;
        const byMax = b.y + b.height / 2 - 4;

        if (nx > bxMin && nx < bxMax && ny > byMin && ny < byMax) {
          // Allow entering doorway threshold
          if (Math.abs(nx - b.doorX) < 22 && ny >= byMax - 14) {
            return false;
          }
          return true;
        }
      }

      // Whispering Lake collision
      if (nx > 1650 && nx < 2050 && ny > 1150 && ny < 1450) {
        // Wooden Dock pier is walkable
        if (nx > 1750 && nx < 1850 && ny > 1200 && ny < 1380) {
          return false;
        }
        return true;
      }

      // Central Fountain collision
      if (Math.hypot(nx - 1200, ny - 920) < 32) {
        return true;
      }

      return false;
    };

    const renderLoop = () => {
      animTickRef.current += 0.05;
      const animTick = animTickRef.current;
      const p = playerRef.current;
      const keys = keysRef.current;
      const room = currentInteriorRef.current;
      const npcsList = npcsRef.current;
      const forageList = forageNodesRef.current;
      const farmList = farmTilesRef.current;
      const gameTime = gameTimeRef.current;
      const activeTool = activeItemRef.current;

      // 1. Process Fishing State Updates
      const f = fishingRef.current;
      if (f.isFishing) {
        if (f.state === "waiting" && Date.now() > f.timer) {
          f.state = "bite";
          audioEngine.playNotification();
          setFishingUIState({ ...f });
        }
      }

      // 2. Process Player Movement (disabled while fishing)
      if (!f.isFishing) {
        let moveX = 0;
        let moveY = 0;

        if (keys["w"] || keys["arrowup"]) moveY -= 1;
        if (keys["s"] || keys["arrowdown"]) moveY += 1;
        if (keys["a"] || keys["arrowleft"]) moveX -= 1;
        if (keys["d"] || keys["arrowright"]) moveX += 1;

        // If mouse target is active
        if (mouseTargetRef.current && moveX === 0 && moveY === 0) {
          const dx = mouseTargetRef.current.x - p.x;
          const dy = mouseTargetRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 8) {
            moveX = dx / dist;
            moveY = dy / dist;
          } else {
            mouseTargetRef.current = null;
          }
        } else if (moveX !== 0 || moveY !== 0) {
          mouseTargetRef.current = null;
        }

        // Normalize diagonal speed
        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        p.isMoving = moveX !== 0 || moveY !== 0;

        if (p.isMoving) {
          if (Math.abs(moveX) > Math.abs(moveY)) {
            p.direction = moveX > 0 ? "right" : "left";
          } else {
            p.direction = moveY > 0 ? "down" : "up";
          }

          const nextX = p.x + moveX * p.speed;
          const nextY = p.y + moveY * p.speed;

          if (!checkCollision(nextX, p.y)) p.x = nextX;
          if (!checkCollision(p.x, nextY)) p.y = nextY;

          // Footstep sound interval
          footstepTimerRef.current += 1;
          if (footstepTimerRef.current % 18 === 0) {
            const isStone =
              room?.floorType === "stone" ||
              (!room && (
                (p.x > 1050 && p.x < 1350 && p.y > 800 && p.y < 1050) ||
                (p.x > 1150 && p.x < 1250 && p.y > 450 && p.y < 850)
              ));
            audioEngine.playFootstep(isStone ? "stone" : "grass");
          }

          if (onPlayerPositionChange) {
            onPlayerPositionChange({ x: p.x, y: p.y });
          }
        }
      }

      // 3. Camera Positioning
      const cam = cameraRef.current;
      if (room) {
        // Center camera on room
        cam.x = room.width / 2;
        cam.y = room.height / 2;
      } else {
        // Follow player smoothly
        cam.x += (p.x - cam.x) * 0.1;
        cam.y += (p.y - cam.y) * 0.1;
        cam.x = Math.max(cam.width / 2, Math.min(WORLD_WIDTH - cam.width / 2, cam.x));
        cam.y = Math.max(cam.height / 2, Math.min(WORLD_HEIGHT - cam.height / 2, cam.y));
      }

      const camOffsetX = cam.x - cam.width / 2;
      const camOffsetY = cam.y - cam.height / 2;

      // 4. Find Nearby Interactables
      let foundInteract: any = null;
      let closestDist = 52;

      if (room) {
        // Check Exit Door
        if (Math.hypot(p.x - room.doorX, p.y - room.doorY) < 40) {
          foundInteract = {
            type: "exit",
            id: room.id,
            name: "Exit to Village",
            x: room.doorX,
            y: room.doorY,
            actionLabel: "Step outside"
          };
        }
        // Check resident NPC if inside
        for (const npc of npcsList) {
          if (npc.currentInteriorId === room.id || room.residentNpcId === npc.id) {
            const d = Math.hypot(npc.x - p.x, npc.y - p.y);
            if (d < closestDist) {
              closestDist = d;
              foundInteract = {
                type: "npc",
                id: npc.id,
                name: `${npc.name} (${npc.title})`,
                x: npc.x,
                y: npc.y,
                actionLabel: `Talk with ${npc.name}`
              };
            }
          }
        }

        // Check Farm Pet if in Farmhouse
        const farmPet = petRef.current;
        if (!foundInteract && room.id === "farmhouse" && farmPet) {
          const d = Math.hypot(farmPet.x - p.x, farmPet.y - p.y);
          if (d < 45) {
            foundInteract = {
              type: "pet",
              id: "pet_mochi",
              name: farmPet.name,
              x: farmPet.x,
              y: farmPet.y,
              actionLabel: `Pet ${farmPet.name} ❤️`
            };
          }
        }

        // Check Room Furniture (Stations, Hearth, Bed, Bookshelf/Radio)
        if (!foundInteract && room.furniture) {
          for (const furn of room.furniture) {
            const d = Math.hypot(furn.x - p.x, furn.y - p.y);
            if (d < 56) {
              if (furn.type === "stove") {
                foundInteract = {
                  type: "station",
                  stationType: "cooking",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Cook Recipes on Stove 🍳"
                };
                break;
              } else if (room.id === "forge" && (furn.type === "anvil" || furn.id === "furnace" || furn.type === "hearth")) {
                foundInteract = {
                  type: "station",
                  stationType: "forge",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Smelt Ores & Forge Tools ⚒️"
                };
                break;
              } else if (room.id === "cottage" && (furn.type === "herbs" || furn.id === "cabinet")) {
                foundInteract = {
                  type: "station",
                  stationType: "herbalism",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Brew Botanical Elixirs 🧪"
                };
                break;
              } else if (room.id === "tiki_bar" && (furn.id === "tiki_counter" || furn.id === "blender_cask")) {
                foundInteract = {
                  type: "station",
                  stationType: "tiki",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Blend Tropical Smoothies 🍹"
                };
                break;
              } else if (room.id === "beach_bungalow" && furn.id === "tidepool_tank") {
                foundInteract = {
                  type: "station",
                  stationType: "aquarium",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Coral Reef Sanctuary Aquarium 🐠"
                };
                break;
              } else if (room.id === "townhall" && furn.id === "mayor_desk") {
                foundInteract = {
                  type: "station",
                  stationType: "townhall",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Mayor's Civic Council Desk 📜"
                };
                break;
              } else if (furn.type === "hearth") {
                foundInteract = {
                  type: "hearth",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Warm up by Fireplace 🔥"
                };
                break;
              } else if (furn.type === "bed") {
                foundInteract = {
                  type: "bed",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Sleep until Morning 🌙"
                };
                break;
              } else if (furn.type === "bookshelf" || furn.id === "desk") {
                foundInteract = {
                  type: "fortune",
                  id: furn.id,
                  name: furn.label,
                  x: furn.x,
                  y: furn.y,
                  actionLabel: "Read Valley Almanac 📻"
                };
                break;
              }
            }
          }
        }
      } else {
        // Check Exterior NPCs
        for (const npc of npcsList) {
          if (!npc.currentInteriorId) {
            const d = Math.hypot(npc.x - p.x, npc.y - p.y);
            if (d < closestDist) {
              closestDist = d;
              foundInteract = {
                type: "npc",
                id: npc.id,
                name: `${npc.name} (${npc.title})`,
                x: npc.x,
                y: npc.y,
                actionLabel: `Talk with ${npc.name}`
              };
            }
          }
        }

        // Check Exterior Town Square Wishing Well / Fountain (x: 1200, y: 920)
        if (!foundInteract && Math.hypot(p.x - 1200, p.y - 920) < 55) {
          foundInteract = {
            type: "station",
            stationType: "wishing_well",
            id: "wishing_well",
            name: "Town Square Wishing Well",
            x: 1200,
            y: 920,
            actionLabel: "Toss Coin for Good Fortune ✨"
          };
        }

        // Check Building Doors
        if (!foundInteract) {
          for (const b of BUILDINGS) {
            const d = Math.hypot(b.doorX - p.x, b.doorY - p.y);
            if (d < 45) {
              foundInteract = {
                type: "door",
                id: b.id,
                name: b.name,
                x: b.doorX,
                y: b.doorY,
                actionLabel: `Enter ${b.name}`
              };
              break;
            }
          }
        }

        // Check Farm Tiles
        if (!foundInteract) {
          for (const tile of farmList) {
            const fx = tile.tileX * 32 + 16;
            const fy = tile.tileY * 32 + 16;
            const d = Math.hypot(fx - p.x, fy - p.y);
            if (d < 36) {
              let label = "Farm Plot";
              if (tile.crop && tile.crop.stage >= 3) {
                label = `Harvest ${tile.crop.name}`;
              } else if (tile.crop) {
                label = `${tile.crop.name} (Stage ${tile.crop.stage + 1}/4)`;
              } else if (tile.tilled) {
                label = activeTool?.category === "seed" ? `Plant ${activeTool.name}` : tile.watered ? "Watered Soil" : "Water Soil";
              } else {
                label = "Till with Hoe";
              }
              foundInteract = {
                type: "farm",
                id: tile.id,
                name: label,
                x: fx,
                y: fy,
                actionLabel: label
              };
              break;
            }
          }
        }

        // Check Lake Pier for Fishing
        if (!foundInteract && activeTool?.id === "fishing_rod" && p.x > 1720 && p.x < 1880 && p.y > 1220 && p.y < 1400) {
          foundInteract = {
            type: "fish",
            id: "fishing_spot",
            name: "Whispering Lake Pier",
            x: p.x,
            y: p.y,
            actionLabel: "Cast Fishing Line"
          };
        }

        // Check Forage items
        if (!foundInteract) {
          for (const node of forageList) {
            if (!node.collected) {
              const d = Math.hypot(node.x - p.x, node.y - p.y);
              if (d < closestDist) {
                closestDist = d;
                foundInteract = {
                  type: "forage",
                  id: node.id,
                  name: node.item.name,
                  x: node.x,
                  y: node.y,
                  actionLabel: `Pick up ${node.item.name}`
                };
              }
            }
          }
        }
      }

      setNearbyInteractable(foundInteract);

      // ==========================================
      // 5. RENDER CANVAS SCENE
      // ==========================================
      ctx.fillStyle = "#1b1e12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      if (room) {
        // RENDER INTERIOR ROOM
        const roomOffsetX = Math.floor(canvas.width / 2 - room.width / 2);
        const roomOffsetY = Math.floor(canvas.height / 2 - room.height / 2);
        ctx.translate(roomOffsetX, roomOffsetY);

        PixelRenderer.renderInteriorRoom(ctx, room, animTick);

        // Render Farm Pet in Farmhouse
        const currentPet = petRef.current;
        if (room.id === "farmhouse" && currentPet) {
          PixelRenderer.renderPet(ctx, currentPet, animTick);
        }

        // Render Player Inside
        PixelRenderer.renderCharacter(
          ctx,
          p.x,
          p.y,
          {
            name: "You",
            direction: p.direction,
            isMoving: p.isMoving,
            color: p.color,
            secondaryColor: p.secondaryColor,
            hairColor: p.hairColor
          },
          animTick
        );

        // Ambient Warm Room Lighting Overlay
        ctx.fillStyle = room.ambientLight || "rgba(255, 236, 179, 0.12)";
        ctx.fillRect(0, 0, room.width, room.height);

        // Warm radial hearth glow
        const hearth = room.furniture.find(f => f.type === "hearth");
        if (hearth) {
          const hearthGlow = ctx.createRadialGradient(hearth.x, hearth.y, 10, hearth.x, hearth.y, 120);
          hearthGlow.addColorStop(0, "rgba(255, 183, 77, 0.25)");
          hearthGlow.addColorStop(1, "rgba(255, 183, 77, 0)");
          ctx.fillStyle = hearthGlow;
          ctx.fillRect(0, 0, room.width, room.height);
        }

        // Render Floating Popups in Room
        const pops = floatingPopsRef.current || [];
        const now = Date.now();
        pops.forEach(pop => {
          const elapsed = now - pop.createdAt;
          if (elapsed < pop.duration) {
            const progress = elapsed / pop.duration;
            const riseY = pop.y - progress * 24;
            const alpha = 1 - Math.pow(progress, 2);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(pop.text, pop.x + 1, riseY + 1);
            ctx.fillStyle = pop.color || "#ffd180";
            ctx.fillText(pop.text, pop.x, riseY);
            ctx.restore();
          }
        });
      } else {
        // RENDER EXTERIOR WORLD
        ctx.translate(-camOffsetX, -camOffsetY);

        // A. Ground Wang Tiles
        const tileGridSize = 32;
        const startTileX = Math.floor(Math.max(0, camOffsetX) / tileGridSize);
        const endTileX = Math.ceil(Math.min(WORLD_WIDTH, camOffsetX + cam.width) / tileGridSize);
        const startTileY = Math.floor(Math.max(0, camOffsetY) / tileGridSize);
        const endTileY = Math.ceil(Math.min(WORLD_HEIGHT, camOffsetY + cam.height) / tileGridSize);

        for (let ty = startTileY; ty <= endTileY; ty++) {
          for (let tx = startTileX; tx <= endTileX; tx++) {
            const gx = tx * tileGridSize;
            const gy = ty * tileGridSize;

            // Cobblestone Plaza & Main Street
            const isPlaza =
              (gx >= 1060 && gx <= 1340 && gy >= 820 && gy <= 1040) ||
              (gx >= 1160 && gx <= 1240 && gy >= 500 && gy <= 840) ||
              (gx >= 920 && gx <= 1640 && gy >= 860 && gy <= 920);

            // Dirt trails
            const isDirtTrail =
              (gx >= 400 && gx <= 1080 && gy >= 880 && gy <= 920) ||
              (gx >= 1340 && gx <= 1900 && gy >= 880 && gy <= 920) ||
              (gx >= 1400 && gx <= 1460 && gy >= 920 && gy <= 1340) ||
              (gx >= 420 && gx <= 480 && gy >= 920 && gy <= 1340) ||
              (gx >= 500 && gx <= 560 && gy >= 640 && gy <= 880);

            // Whispering Lake
            const isWater = gx >= 1660 && gx <= 2040 && gy >= 1160 && gy <= 1440;

            if (isWater) {
              const waterTile = PixelRenderer.getWaterTile(Math.floor(animTick * 3));
              ctx.drawImage(waterTile, gx, gy);
            } else if (isPlaza) {
              const cobbleTile = PixelRenderer.getCobblestoneTile();
              ctx.drawImage(cobbleTile, gx, gy);
            } else if (isDirtTrail) {
              const dirtTile = PixelRenderer.getDirtTile();
              ctx.drawImage(dirtTile, gx, gy);
            } else {
              const grassTile = PixelRenderer.getGrassTile((tx * 7 + ty * 13) % 4);
              ctx.drawImage(grassTile, gx, gy);
            }
          }
        }

        // B. Farm Soil Plots & Crops
        farmList.forEach(tile => {
          const fx = tile.tileX * 32;
          const fy = tile.tileY * 32;
          const soilTile = PixelRenderer.getTilledTile(tile.watered);
          ctx.drawImage(soilTile, fx, fy);

          if (tile.crop) {
            PixelRenderer.renderCrop(ctx, fx + 16, fy + 16, tile.crop, animTick);
          }
        });

        // Farm boundary fence
        ctx.fillStyle = "#8d6e63";
        ctx.fillRect(400, 770, 240, 4);
        ctx.fillRect(400, 930, 240, 4);
        ctx.fillRect(400, 770, 4, 164);
        ctx.fillRect(640, 770, 4, 164);

        // Farm Water Well
        ctx.fillStyle = "#546e7a";
        ctx.fillRect(360, 820, 28, 28);
        ctx.fillStyle = "#29b6f6";
        ctx.fillRect(364, 824, 20, 20);
        ctx.fillStyle = "#37474f";
        ctx.strokeRect(360, 820, 28, 28);

        // C. Lake Shoreline Foam & Wooden Dock
        ctx.fillStyle = "rgba(190, 227, 248, 0.4)";
        ctx.fillRect(1660, 1160, 380, 4);
        ctx.fillRect(1660, 1160, 4, 280);

        // Wooden Pier / Dock
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(1750, 1200, 100, 180);
        ctx.fillStyle = "#8d6e63";
        ctx.fillRect(1752, 1202, 96, 176);
        ctx.fillStyle = "#3e2723";
        for (let py = 1206; py < 1376; py += 16) {
          ctx.fillRect(1752, py, 96, 2);
        }

        // D. Village Landmarks: Central Fountain
        const fountainSprite = PixelRenderer.getFountainSprite(Math.floor(animTick * 4));
        ctx.drawImage(fountainSprite, 1200 - 32, 920 - 32);

        // E. Street Lanterns & Benches
        const isNight = gameTime < 360 || gameTime > 1200;
        const lanternPositions = [
          { x: 1060, y: 840 },
          { x: 1340, y: 840 },
          { x: 1060, y: 1020 },
          { x: 1340, y: 1020 },
          { x: 1200, y: 580 },
          { x: 1560, y: 840 },
          { x: 940, y: 920 }
        ];

        lanternPositions.forEach(lp => {
          const lantern = PixelRenderer.getLanternSprite(isNight);
          ctx.drawImage(lantern, lp.x - 16, lp.y - 40);
        });

        // Notice Board in Town Square
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(1290, 860, 36, 28);
        ctx.fillStyle = "#fefae0";
        ctx.fillRect(1292, 862, 32, 24);
        ctx.fillStyle = "#ffd180";
        ctx.fillRect(1296, 866, 10, 8);
        ctx.fillRect(1310, 868, 10, 8);
        ctx.fillRect(1300, 876, 12, 6);

        // F. Forest Border & Ancient Oak Trees
        const oakTree = PixelRenderer.getOakTreeSprite();
        const pineTree = PixelRenderer.getPineTreeSprite();

        for (let tx = 60; tx < WORLD_WIDTH - 60; tx += 90) {
          ctx.drawImage(oakTree, tx - 32, 20);
          ctx.drawImage(pineTree, tx + 20, 1680);
        }
        for (let ty = 60; ty < WORLD_HEIGHT - 60; ty += 110) {
          ctx.drawImage(pineTree, 20, ty);
          ctx.drawImage(oakTree, WORLD_WIDTH - 80, ty);
        }
        ctx.drawImage(oakTree, 340, 1140);
        ctx.drawImage(oakTree, 640, 1460);
        ctx.drawImage(pineTree, 1940, 580);
        ctx.drawImage(oakTree, 2120, 1340);
        ctx.drawImage(oakTree, 820, 1460);

        // G. Render Buildings
        BUILDINGS.forEach(b => {
          PixelRenderer.renderBuilding(ctx, b, isNight);

          // Door Enter indicator glow
          ctx.fillStyle = "rgba(255, 209, 128, 0.4)";
          ctx.fillRect(b.doorX - 12, b.doorY - 6, 24, 12);
        });

        // H. Foraging Nodes
        forageList.forEach((node, idx) => {
          if (!node.collected) {
            const bounce = Math.sin(animTick * 3 + idx) * 3;
            const nx = node.x;
            const ny = node.y + bounce;

            // Glow
            ctx.fillStyle = "rgba(255, 235, 59, 0.3)";
            ctx.beginPath();
            ctx.arc(nx, ny, 10, 0, Math.PI * 2);
            ctx.fill();

            // Item Icon
            ctx.fillStyle = node.item.color;
            ctx.beginPath();
            ctx.arc(nx, ny, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(nx - 2, ny - 2, 2, 2);

            // Name label
            ctx.fillStyle = "rgba(20, 24, 13, 0.85)";
            ctx.fillRect(nx - 28, ny - 20, 56, 12);
            ctx.fillStyle = "#fefae0";
            ctx.font = "bold 7px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(node.item.name, nx, ny - 12);
          }
        });

        // I. Render Entities (NPCs + Player Z-sorted)
        const visibleNpcs = npcsList.filter(n => !n.currentInteriorId);
        const allEntities = [
          ...visibleNpcs.map(n => ({ type: "npc" as const, data: n, y: n.y })),
          { type: "player" as const, data: p, y: p.y }
        ].sort((a, b) => a.y - b.y);

        allEntities.forEach(ent => {
          if (ent.type === "npc") {
            const n = ent.data as NPCState;
            PixelRenderer.renderCharacter(
              ctx,
              n.x,
              n.y,
              {
                name: n.name,
                direction: n.direction,
                isMoving: n.isMoving,
                color: n.color,
                secondaryColor: n.secondaryColor,
                hairColor: n.hairColor
              },
              animTick
            );

            // Name Tag & Hearts
            ctx.fillStyle = "rgba(20, 24, 13, 0.9)";
            ctx.fillRect(n.x - 36, n.y - 42, 72, 14);
            ctx.strokeStyle = "#ffd180";
            ctx.lineWidth = 1;
            ctx.strokeRect(n.x - 36, n.y - 42, 72, 14);

            ctx.fillStyle = "#fefae0";
            ctx.font = "bold 8px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${n.name} ♥${n.hearts}`, n.x, n.y - 32);

            // Speech Bubble if active
            if (n.speechBubble && n.speechBubble.expiresAt > Date.now()) {
              ctx.fillStyle = "#fefae0";
              ctx.strokeStyle = "#4a2e19";
              ctx.lineWidth = 2;
              const bubbleW = Math.min(200, n.speechBubble.text.length * 6 + 20);
              ctx.fillRect(n.x - bubbleW / 2, n.y - 74, bubbleW, 26);
              ctx.strokeRect(n.x - bubbleW / 2, n.y - 74, bubbleW, 26);

              ctx.fillStyle = "#2d351d";
              ctx.font = "8px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText(n.speechBubble.text.slice(0, 36), n.x, n.y - 58);
            }
          } else {
            // Render Player
            PixelRenderer.renderCharacter(
              ctx,
              p.x,
              p.y,
              {
                name: "You",
                direction: p.direction,
                isMoving: p.isMoving,
                color: p.color,
                secondaryColor: p.secondaryColor,
                hairColor: p.hairColor
              },
              animTick
            );

            // Active Fishing Line Graphic
            if (f.isFishing) {
              const rodEndX = p.x + (p.direction === "right" ? 24 : -24);
              const rodEndY = p.y - 12;
              const bobberX = 1800;
              const bobberY = 1260 + Math.sin(animTick * 4) * 3;

              // Silk line
              ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(rodEndX, rodEndY);
              ctx.quadraticCurveTo(
                (rodEndX + bobberX) / 2,
                Math.min(rodEndY, bobberY) - 20,
                bobberX,
                bobberY
              );
              ctx.stroke();

              // Bobber Float
              ctx.fillStyle = f.state === "bite" ? "#e53935" : "#ffd180";
              ctx.beginPath();
              ctx.arc(bobberX, bobberY, 4, 0, Math.PI * 2);
              ctx.fill();

              // Water ripple
              ctx.strokeStyle = "rgba(179, 229, 252, 0.6)";
              ctx.beginPath();
              ctx.arc(bobberX, bobberY, 8 + (animTick % 3) * 3, 0, Math.PI * 2);
              ctx.stroke();

              // Bite indicator
              if (f.state === "bite") {
                ctx.fillStyle = "#e53935";
                ctx.fillRect(p.x - 8, p.y - 50, 16, 16);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("!", p.x, p.y - 38);
              }
            }

            // Player Name Tag
            ctx.fillStyle = "rgba(45, 53, 29, 0.9)";
            ctx.fillRect(p.x - 22, p.y - 40, 44, 12);
            ctx.fillStyle = "#fefae0";
            ctx.font = "bold 7px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Farmer", p.x, p.y - 31);
          }
        });

        // J. Atmospheric Particles
        particlesRef.current.forEach(pt => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          if (pt.x > WORLD_WIDTH) pt.x = 0;
          if (pt.y > WORLD_HEIGHT) pt.y = 0;

          ctx.fillStyle = pt.color;
          ctx.globalAlpha = isNight && pt.type === "leaf" ? 0.2 : pt.alpha;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        });

        // K. Render Floating Popups in Exterior
        const pops = floatingPopsRef.current || [];
        const now = Date.now();
        pops.forEach(pop => {
          const elapsed = now - pop.createdAt;
          if (elapsed < pop.duration) {
            const progress = elapsed / pop.duration;
            const riseY = pop.y - progress * 24;
            const alpha = 1 - Math.pow(progress, 2);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(pop.text, pop.x + 1, riseY + 1);
            ctx.fillStyle = pop.color || "#ffd180";
            ctx.fillText(pop.text, pop.x, riseY);
            ctx.restore();
          }
        });

        // L. Soft Non-Destructive Day/Night & Golden-Hour Lighting
        let ambientOverlay = "rgba(0, 0, 0, 0)";
        if (gameTime >= 360 && gameTime < 480) {
          // Dawn
          ambientOverlay = "rgba(255, 183, 77, 0.08)";
        } else if (gameTime >= 480 && gameTime < 1020) {
          // Day
          ambientOverlay = "rgba(0, 0, 0, 0)";
        } else if (gameTime >= 1020 && gameTime < 1180) {
          // Sunset
          ambientOverlay = "rgba(230, 81, 0, 0.16)";
        } else if (gameTime >= 1180 && gameTime < 1280) {
          // Dusk
          ambientOverlay = "rgba(49, 27, 146, 0.26)";
        } else {
          // Night
          ambientOverlay = "rgba(10, 15, 30, 0.45)";
        }

        ctx.fillStyle = ambientOverlay;
        ctx.fillRect(camOffsetX, camOffsetY, cam.width, cam.height);

        // Warm radial lantern glow (additive, non-destructive to avoid black canvas holes)
        if (isNight) {
          lanternPositions.forEach(lp => {
            const radGrad = ctx.createRadialGradient(lp.x, lp.y - 12, 5, lp.x, lp.y - 12, 70);
            radGrad.addColorStop(0, "rgba(255, 209, 128, 0.28)");
            radGrad.addColorStop(1, "rgba(255, 209, 128, 0)");
            ctx.fillStyle = radGrad;
            ctx.fillRect(lp.x - 70, lp.y - 82, 140, 140);
          });
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [onPlayerPositionChange]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#1b1e12] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-pointer"
      />

      {/* Floating Interaction Prompt Banner */}
      {nearbyInteractable && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#2d351d]/95 border-2 border-[#14180d] rounded-2xl shadow-2xl text-[#fefae0] backdrop-blur-sm">
            <span className="px-2.5 py-1 bg-[#ffd180] text-[#4a2e19] font-bold text-xs rounded-xl shadow-inner border border-[#4a2e19]/30">
              [E] or Click
            </span>
            <span className="text-xs font-serif italic font-bold tracking-wide text-[#fefae0]">
              {nearbyInteractable.actionLabel}
            </span>
          </div>
        </div>
      )}

      {/* Fishing Mini-Game Alert Overlay */}
      {fishingUIState.isFishing && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
          <div className="px-5 py-3 bg-[#2d351d]/95 border-2 border-[#ffd180] rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-[#fefae0]">
            <div className={`w-4 h-4 rounded-full ${fishingUIState.state === "bite" ? "bg-red-500 animate-ping" : "bg-[#ffd180] animate-pulse"}`} />
            <div>
              <p className="font-serif font-bold text-sm text-[#ffd180]">
                {fishingUIState.state === "bite"
                  ? "BITE! Press [E] or Click to REEL IN!"
                  : fishingUIState.state === "caught"
                  ? `Caught a ${fishingUIState.targetItem?.name || "Fish"}!`
                  : "Fishing at Whispering Lake... Waiting for a bite..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
