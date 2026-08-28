import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_NPCS, getNPC } from "./server/data/npcs.js";
import { memoryStore } from "./server/memory/memoryStore.js";
import { processNPCChat, simulateNPCMeeting } from "./server/ai/npcChat.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", game: "Evergreen", aiProvider: "Gemini" });
  });

  // Get all NPCs
  app.get("/api/npcs", (_req, res) => {
    const relationships = memoryStore.getAllRelationships();
    const npcsWithStatus = INITIAL_NPCS.map(npc => {
      const rel = relationships[npc.id] || memoryStore.getRelationship(npc.id);
      const recentMemories = memoryStore.getMemories(npc.id, 2);
      return {
        ...npc,
        relationship: rel,
        recentMemories
      };
    });
    res.json({ npcs: npcsWithStatus });
  });

  // Get single NPC details
  app.get("/api/npc/:id", (req, res) => {
    const npc = getNPC(req.params.id);
    if (!npc) {
      res.status(404).json({ error: "NPC not found" });
      return;
    }
    const rel = memoryStore.getRelationship(npc.id);
    const memories = memoryStore.getMemories(npc.id, 15);
    res.json({
      npc,
      relationship: rel,
      memories
    });
  });

  // Chat with NPC
  app.post("/api/npc/:id/chat", async (req, res) => {
    try {
      const npcId = req.params.id;
      const { playerMessage, gameTime, weather, season, giftItem } = req.body;
      const result = await processNPCChat({
        npcId,
        playerMessage: playerMessage || "Hello!",
        gameTime,
        weather,
        season,
        giftItem
      });
      res.json(result);
    } catch (err: any) {
      console.error("Error in /api/npc/:id/chat:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Give gift to NPC
  app.post("/api/npc/:id/gift", async (req, res) => {
    try {
      const npcId = req.params.id;
      const { giftItem, playerMessage, gameTime } = req.body;
      const result = await processNPCChat({
        npcId,
        playerMessage: playerMessage || `I brought this ${giftItem} for you!`,
        gameTime,
        giftItem
      });
      res.json(result);
    } catch (err: any) {
      console.error("Error in /api/npc/:id/gift:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Get memories
  app.get("/api/memories/:npcId", (req, res) => {
    const memories = memoryStore.getMemories(req.params.npcId, 25);
    res.json({ memories });
  });

  // Get rumors and village relationships
  app.get("/api/rumors", (_req, res) => {
    const rumors = memoryStore.getRumors(10);
    res.json({ rumors });
  });

  app.get("/api/relationships", (_req, res) => {
    const relationships = memoryStore.getAllRelationships();
    res.json({ relationships });
  });

  // Simulate NPC to NPC social encounter
  app.post("/api/npc/simulate-meeting", async (req, res) => {
    try {
      const { npcAId, npcBId, locationName, gameTime } = req.body;
      const result = await simulateNPCMeeting(npcAId, npcBId, locationName || "Town Square", gameTime || "Day 1, 14:00");
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset simulation state
  app.post("/api/reset", (_req, res) => {
    memoryStore.resetAll();
    res.json({ success: true, message: "Simulation memories and relationship matrix reset." });
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌲 Evergreen Game Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
