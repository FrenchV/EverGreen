export interface NPCMemory {
  id: string;
  npcId: string;
  timestamp: string; // game time e.g. "Day 1, 14:30"
  realTimestamp: number;
  type: "dialogue" | "gift" | "social_encounter" | "observation" | "quest";
  content: string;
  importance: number; // 1 to 10
  emotion: "neutral" | "happy" | "touched" | "thoughtful" | "surprised" | "warm" | "annoyed" | "excited";
  sentimentDelta: number; // e.g. +2, +5
  tags: string[];
}

export interface NPCRelationshipState {
  npcId: string;
  friendshipPoints: number; // 0 to 100
  hearts: number; // 0 to 5 (every 20 pts = 1 heart)
  trustLevel: "Stranger" | "Acquaintance" | "Friendly" | "Close Friend" | "Kindred Soul";
  giftsGivenCount: number;
  lastGiftGiven?: string;
  conversationsCount: number;
  knownSecrets: string[];
  customNotes: string[];
}

export interface VillageRumor {
  id: string;
  fromNpcId: string;
  toNpcId: string;
  topic: string;
  content: string;
  gameTime: string;
  createdAt: number;
}

class MemoryStore {
  private memories: Map<string, NPCMemory[]> = new Map();
  private relationships: Map<string, NPCRelationshipState> = new Map();
  private rumors: VillageRumor[] = [];

  constructor() {
    this.seedInitialState();
  }

  private seedInitialState() {
    const npcIds = ["mira", "elara", "rowan", "silas", "finn", "cora"];

    for (const id of npcIds) {
      this.relationships.set(id, {
        npcId: id,
        friendshipPoints: 10,
        hearts: 0,
        trustLevel: "Stranger",
        giftsGivenCount: 0,
        conversationsCount: 0,
        knownSecrets: [],
        customNotes: []
      });

      this.memories.set(id, [
        {
          id: `${id}-seed-1`,
          npcId: id,
          timestamp: "Day 1, 06:00",
          realTimestamp: Date.now() - 3600000,
          type: "observation",
          content: "A new traveler has arrived in the village of Evergreen. I wonder what brought them to our quiet forest.",
          importance: 4,
          emotion: "thoughtful",
          sentimentDelta: 0,
          tags: ["arrival", "first_impression", "village"]
        }
      ]);
    }

    // Add some organic inter-NPC starting rumors
    this.rumors.push(
      {
        id: "rumor-1",
        fromNpcId: "mira",
        toNpcId: "silas",
        topic: "Flora",
        content: "Mira noticed rare blue starflowers blooming two weeks earlier than usual near the Whispering Lake.",
        gameTime: "Day 1, 09:30",
        createdAt: Date.now() - 7200000
      },
      {
        id: "rumor-2",
        fromNpcId: "rowan",
        toNpcId: "elara",
        topic: "Trade",
        content: "Rowan heard merchants passing through saying iron prices are climbing in the capital.",
        gameTime: "Day 1, 11:00",
        createdAt: Date.now() - 5400000
      },
      {
        id: "rumor-3",
        fromNpcId: "finn",
        toNpcId: "cora",
        topic: "Town Project",
        content: "Finn submitted plans to Mayor Cora to rebuild the old watermill wheel with fresh cedar lumber.",
        gameTime: "Day 1, 13:15",
        createdAt: Date.now() - 3600000
      }
    );
  }

  public getMemories(npcId: string, limit: number = 8): NPCMemory[] {
    const list = this.memories.get(npcId.toLowerCase()) || [];
    return [...list].sort((a, b) => b.realTimestamp - a.realTimestamp).slice(0, limit);
  }

  public addMemory(memory: Omit<NPCMemory, "id" | "realTimestamp">): NPCMemory {
    const npcId = memory.npcId.toLowerCase();
    const current = this.memories.get(npcId) || [];
    const fullMemory: NPCMemory = {
      ...memory,
      id: `mem-${npcId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      realTimestamp: Date.now()
    };

    current.unshift(fullMemory);
    // Keep max 40 memories per NPC to maintain fast context
    if (current.length > 40) {
      current.pop();
    }
    this.memories.set(npcId, current);

    // Apply sentiment delta to relationship
    this.updateRelationshipPoints(npcId, memory.sentimentDelta);

    return fullMemory;
  }

  public getRelationship(npcId: string): NPCRelationshipState {
    const id = npcId.toLowerCase();
    if (!this.relationships.has(id)) {
      this.relationships.set(id, {
        npcId: id,
        friendshipPoints: 0,
        hearts: 0,
        trustLevel: "Stranger",
        giftsGivenCount: 0,
        conversationsCount: 0,
        knownSecrets: [],
        customNotes: []
      });
    }
    return this.relationships.get(id)!;
  }

  public updateRelationshipPoints(npcId: string, delta: number): NPCRelationshipState {
    const rel = this.getRelationship(npcId);
    rel.friendshipPoints = Math.max(0, Math.min(100, rel.friendshipPoints + delta));
    rel.hearts = Math.floor(rel.friendshipPoints / 20);

    if (rel.friendshipPoints >= 80) rel.trustLevel = "Kindred Soul";
    else if (rel.friendshipPoints >= 60) rel.trustLevel = "Close Friend";
    else if (rel.friendshipPoints >= 40) rel.trustLevel = "Friendly";
    else if (rel.friendshipPoints >= 20) rel.trustLevel = "Acquaintance";
    else rel.trustLevel = "Stranger";

    return rel;
  }

  public recordConversation(npcId: string) {
    const rel = this.getRelationship(npcId);
    rel.conversationsCount += 1;
  }

  public recordGift(npcId: string, giftName: string, pointsDelta: number) {
    const rel = this.getRelationship(npcId);
    rel.giftsGivenCount += 1;
    rel.lastGiftGiven = giftName;
    this.updateRelationshipPoints(npcId, pointsDelta);
  }

  public addRumor(rumor: Omit<VillageRumor, "id" | "createdAt">): VillageRumor {
    const fullRumor: VillageRumor = {
      ...rumor,
      id: `rumor-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    this.rumors.unshift(fullRumor);
    if (this.rumors.length > 25) this.rumors.pop();
    return fullRumor;
  }

  public getRumors(limit: number = 6): VillageRumor[] {
    return this.rumors.slice(0, limit);
  }

  public getAllRelationships(): Record<string, NPCRelationshipState> {
    const result: Record<string, NPCRelationshipState> = {};
    for (const [id, rel] of this.relationships.entries()) {
      result[id] = { ...rel };
    }
    return result;
  }

  public resetAll() {
    this.memories.clear();
    this.relationships.clear();
    this.rumors = [];
    this.seedInitialState();
  }
}

export const memoryStore = new MemoryStore();
