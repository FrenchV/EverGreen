import { getGemini } from "./gemini.js";
import { getNPC, NPCProfile } from "../data/npcs.js";
import { memoryStore } from "../memory/memoryStore.js";
import { Type } from "@google/genai";

export interface ChatRequestPayload {
  npcId: string;
  playerMessage: string;
  gameTime?: string; // e.g. "Day 1, 15:45"
  weather?: string; // e.g. "Sunny", "Gentle Rain", "Golden Hour"
  season?: string; // e.g. "Spring"
  giftItem?: string; // e.g. "Starflower"
}

export interface ChatResponsePayload {
  reply: string;
  emotion: "neutral" | "happy" | "touched" | "thoughtful" | "surprised" | "warm" | "annoyed" | "excited";
  sentimentDelta: number;
  memorySummary: string;
  rumorOrHint?: string;
  currentFriendshipPoints: number;
  currentHearts: number;
  trustLevel: string;
}

export async function processNPCChat(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
  const npc = getNPC(payload.npcId);
  if (!npc) {
    throw new Error(`NPC with ID "${payload.npcId}" not found`);
  }

  const relationship = memoryStore.getRelationship(npc.id);
  const timeNum = parseGameTimeToMinutes(payload.gameTime || "12:00");
  const activeSlot = npc.schedule.find(s => timeNum >= s.timeStart && timeNum < s.timeEnd) || npc.schedule[0];

  // 1. Instant Natural Gifts (Zero AI latency, pure handcrafted charm)
  if (payload.giftItem) {
    const giftResult = getNaturalGiftResponse(npc, payload.giftItem);
    const memorySummary = `Received a gift of ${payload.giftItem} from the traveler at ${activeSlot.locationName}.`;

    memoryStore.recordConversation(npc.id);
    memoryStore.recordGift(npc.id, payload.giftItem, giftResult.sentimentDelta);

    const updatedRel = memoryStore.getRelationship(npc.id);

    return {
      reply: giftResult.reply,
      emotion: giftResult.emotion,
      sentimentDelta: giftResult.sentimentDelta,
      memorySummary,
      rumorOrHint: giftResult.hint,
      currentFriendshipPoints: updatedRel.friendshipPoints,
      currentHearts: updatedRel.hearts,
      trustLevel: updatedRel.trustLevel
    };
  }

  const cleanedMsg = (payload.playerMessage || "").trim().toLowerCase();

  // 2. Instant Natural Rumors & Village News
  if (
    cleanedMsg.includes("rumor") ||
    cleanedMsg.includes("gossip") ||
    cleanedMsg.includes("news") ||
    cleanedMsg.includes("heard anything")
  ) {
    const rumorResult = getNaturalVillageRumor(npc, payload.gameTime, payload.weather);
    memoryStore.recordConversation(npc.id);
    memoryStore.addMemory({
      npcId: npc.id,
      timestamp: payload.gameTime || "Day 1, 12:00",
      type: "dialogue",
      content: `Shared village lore and gossip near ${activeSlot.locationName}.`,
      importance: 4,
      emotion: "thoughtful",
      sentimentDelta: 2,
      tags: ["rumor", "village_news"]
    });

    const updatedRel = memoryStore.getRelationship(npc.id);

    return {
      reply: rumorResult.reply,
      emotion: "warm",
      sentimentDelta: 2,
      memorySummary: "Discussed valley rumors and upcoming events.",
      rumorOrHint: rumorResult.hint,
      currentFriendshipPoints: updatedRel.friendshipPoints,
      currentHearts: updatedRel.hearts,
      trustLevel: updatedRel.trustLevel
    };
  }

  // 3. Instant Natural Schedule & Work Questions
  if (
    cleanedMsg.includes("working on") ||
    cleanedMsg.includes("doing today") ||
    cleanedMsg.includes("schedule") ||
    cleanedMsg.includes("your day") ||
    cleanedMsg.includes("busy")
  ) {
    const scheduleReply = getNaturalScheduleResponse(npc, activeSlot, getTimePeriod(timeNum));
    memoryStore.recordConversation(npc.id);
    memoryStore.addMemory({
      npcId: npc.id,
      timestamp: payload.gameTime || "Day 1, 12:00",
      type: "dialogue",
      content: `Talked about daily duties at ${activeSlot.locationName}.`,
      importance: 3,
      emotion: "happy",
      sentimentDelta: 2,
      tags: ["schedule", "routine"]
    });

    const updatedRel = memoryStore.getRelationship(npc.id);

    return {
      reply: scheduleReply,
      emotion: "happy",
      sentimentDelta: 2,
      memorySummary: `Explained current task: ${activeSlot.activity}.`,
      rumorOrHint: `Schedule Note: ${npc.name} can usually be found at ${activeSlot.locationName} around this hour.`,
      currentFriendshipPoints: updatedRel.friendshipPoints,
      currentHearts: updatedRel.hearts,
      trustLevel: updatedRel.trustLevel
    };
  }

  // 4. Instant Natural Greetings (Saying "hi", "hello", "hey", "good morning")
  const isBasicGreeting = isSimpleGreeting(cleanedMsg);
  if (isBasicGreeting) {
    const greetingReply = getNaturalGreeting(npc, activeSlot, timeNum, relationship);
    memoryStore.recordConversation(npc.id);
    memoryStore.addMemory({
      npcId: npc.id,
      timestamp: payload.gameTime || "Day 1, 12:00",
      type: "dialogue",
      content: `Warm greeting shared at ${activeSlot.locationName}.`,
      importance: 2,
      emotion: "warm",
      sentimentDelta: 1,
      tags: ["greeting"]
    });

    const updatedRel = memoryStore.getRelationship(npc.id);

    return {
      reply: greetingReply,
      emotion: "warm",
      sentimentDelta: 1,
      memorySummary: "Exchanged friendly pleasantries.",
      rumorOrHint: `Tip: Giving ${npc.name} their favorite gift (${npc.favoriteGift}) grants massive friendship!`,
      currentFriendshipPoints: updatedRel.friendshipPoints,
      currentHearts: updatedRel.hearts,
      trustLevel: updatedRel.trustLevel
    };
  }

  // 5. Custom Deep Dialogue with Gemini (with 8000ms safe timeout)
  try {
    const aiPromise = (async () => {
      const ai = getGemini();
      const recentMemories = memoryStore.getMemories(npc.id, 5);
      const rumors = memoryStore.getRumors(3);

      const systemInstruction = `You are roleplaying as ${npc.name}, the ${npc.title} of Evergreen in a cozy life-sim RPG (inspired by Stardew Valley, Rune Factory, and Animal Crossing).
Identity & Personality: ${npc.personality}
Appearance & Style: ${npc.appearance}
Speaking Style: ${npc.speakingStyle}
Current Location & Activity: ${activeSlot.locationName} (${activeSlot.activity})
Current Time & Weather: ${payload.gameTime || "Afternoon"}, ${payload.weather || "Sunny"}
Player Relationship: Trust Level: "${relationship.trustLevel}" (${relationship.hearts}/5 hearts, ${relationship.friendshipPoints} points)
NPC Secrets & Knowledge: ${npc.knowledge.join("; ")}
Recent Memories: ${recentMemories.map(m => m.content).join("; ")}
Village Rumors: ${rumors.map(r => r.content).join("; ")}

Roleplay Guidelines:
- Directly answer the player's message with genuine emotion, humor, charm, or character quirkiness.
- If the player asks about the beach, swimming, outfits, hair, romance, flirting, compliments, farming, fishing, or gossip, react appropriately and vividly!
- Never output generic AI disclaimers or break character. Speak naturally as a living resident of Evergreen.
- Length: 2 to 3 sentences max, warm and memorable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: payload.playerMessage,
        config: {
          systemInstruction,
          temperature: 0.85,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING, description: "In-character spoken line (2-3 sentences)" },
              emotion: {
                type: Type.STRING,
                enum: ["neutral", "happy", "touched", "thoughtful", "surprised", "warm", "annoyed", "excited"]
              },
              sentimentDelta: { type: Type.INTEGER, description: "Friendship point change from 1 to 5" },
              memorySummary: { type: Type.STRING, description: "Short memory log entry" },
              rumorOrHint: { type: Type.STRING, description: "Optional village hint or lore clue" }
            },
            required: ["reply", "emotion", "sentimentDelta", "memorySummary"]
          }
        }
      });

      let text = response.text || "";
      // Strip potential markdown fences if present
      text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      return JSON.parse(text || "{}");
    })();

    // 8s Timeout guard
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI timeout")), 8000)
    );

    const parsed: any = await Promise.race([aiPromise, timeoutPromise]);

    const reply = parsed.reply || getNaturalDialogueByTopic(npc, activeSlot, payload.playerMessage, relationship);
    const emotion = parsed.emotion || "warm";
    const sentimentDelta = typeof parsed.sentimentDelta === "number" ? parsed.sentimentDelta : 2;
    const memorySummary = parsed.memorySummary || `Chatted with the traveler at ${activeSlot.locationName}.`;

    memoryStore.recordConversation(npc.id);
    memoryStore.addMemory({
      npcId: npc.id,
      timestamp: payload.gameTime || "Day 1, 12:00",
      type: "dialogue",
      content: memorySummary,
      importance: Math.min(10, Math.max(2, 3 + Math.abs(sentimentDelta))),
      emotion: emotion as any,
      sentimentDelta,
      tags: ["dialogue", activeSlot.locationName.toLowerCase().replace(/\s+/g, "_")]
    });

    const updatedRel = memoryStore.getRelationship(npc.id);

    return {
      reply,
      emotion: emotion as any,
      sentimentDelta,
      memorySummary,
      rumorOrHint: parsed.rumorOrHint,
      currentFriendshipPoints: updatedRel.friendshipPoints,
      currentHearts: updatedRel.hearts,
      trustLevel: updatedRel.trustLevel
    };
  } catch (err) {
    // Contextual fallback engine if offline or API key missing
    const fallbackReply = getNaturalDialogueByTopic(npc, activeSlot, payload.playerMessage, relationship);
    const emotion = getEmotionForMessage(payload.playerMessage);
    const sentimentDelta = 2;
    const memorySummary = `Shared a pleasant conversation with ${npc.name} at ${activeSlot.locationName}.`;

    memoryStore.recordConversation(npc.id);
    memoryStore.addMemory({
      npcId: npc.id,
      timestamp: payload.gameTime || "Day 1, 12:00",
      type: "dialogue",
      content: memorySummary,
      importance: 3,
      emotion: emotion as any,
      sentimentDelta,
      tags: ["dialogue", "casual"]
    });

    const updatedRel = memoryStore.getRelationship(npc.id);

    return {
      reply: fallbackReply,
      emotion: emotion as any,
      sentimentDelta,
      memorySummary,
      rumorOrHint: `Clue: ${npc.knowledge[Math.floor(Math.random() * npc.knowledge.length)]}`,
      currentFriendshipPoints: updatedRel.friendshipPoints,
      currentHearts: updatedRel.hearts,
      trustLevel: updatedRel.trustLevel
    };
  }
}

function getEmotionForMessage(msg: string): "happy" | "touched" | "warm" | "surprised" | "neutral" | "annoyed" {
  const m = (msg || "").toLowerCase();
  if (m.includes("love") || m.includes("cute") || m.includes("beautiful") || m.includes("pretty") || m.includes("handsome") || m.includes("marry") || m.includes("kiss")) return "touched";
  if (m.includes("great") || m.includes("awesome") || m.includes("yay") || m.includes("beach") || m.includes("surf") || m.includes("fun")) return "happy";
  if (m.includes("what") || m.includes("really") || m.includes("secret") || m.includes("whoa")) return "surprised";
  if (m.includes("hate") || m.includes("ugly") || m.includes("leave") || m.includes("go away")) return "annoyed";
  return "warm";
}

// Check for simple common greetings
function isSimpleGreeting(msg: string): boolean {
  if (!msg || msg.length === 0) return true;
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "greetings", "yo", "sup", "how are you", "what's up"];
  return greetings.some(g => msg === g || msg === `${g}!` || msg === `${g}.` || msg.startsWith(`${g} `));
}

// Handcrafted natural gift reactions
function getNaturalGiftResponse(npc: NPCProfile, giftItem: string): {
  reply: string;
  emotion: "happy" | "touched" | "warm" | "surprised" | "neutral" | "annoyed";
  sentimentDelta: number;
  hint?: string;
} {
  const itemLower = giftItem.toLowerCase();
  const favLower = npc.favoriteGift.toLowerCase();

  // 1. Favorite Gift
  if (itemLower.includes(favLower) || favLower.includes(itemLower)) {
    const favoriteReplies: Record<string, string> = {
      maya: "Oh wow! A pristine spiral Seashell?! Look at that pearlescent sheen against the sunlight! I'm tying this right into my collection at the Tiki Bar. You're wonderful!",
      isla: "A fresh Tropical Coconut?! The sweet milk and cool breeze vibe is unbeatable after morning surf! You totally get me, thank you so much!",
      marina: "A luminous purple Starfish?! Oh my stars, its arms are shimmering with tidepool magic! This is the most fascinating marine treasure ever!",
      kai: "A freshly reeled Fresh Trout with glistening scales?! Man, this is prime quality! I'm grilling this over the beach bonfire tonight—you're a true mate!",
      mira: "Oh goodness... a Starflower?! The petals still glow with twilight essence! This is truly my most cherished blossom. Thank you from the bottom of my heart, friend!",
      elara: "By the anvil! High-grade Iron Ore?! Look at the dense metallic grain on this lump—I can temper an exquisite tool from this. You really know what a blacksmith loves!",
      rowan: "Pure Honeycomb from the highland blossoms?! The aroma alone could sweeten an entire cask of cider! This is going straight into my private banquet batch. You're a legend!",
      silas: "Luminescent Glowmoss?! The enzymatic integrity of these spores is pristine. I've needed this for my restorative balms for weeks. Your generosity is deeply appreciated.",
      finn: "Prime aged Oak Timber?! Feel that tight grain and rich cedar-oak scent! This heartwood is going to make an unbelievable carved mantelpiece. You're the best!",
      cora: "An Antique Quill with brass filigree?! Oh, how exquisite! The balance is impeccable for town charter signatures. A dignified and magnificent gift, traveler!"
    };

    return {
      reply: favoriteReplies[npc.id] || `This is magnificent! ${giftItem} is my absolute favorite thing. Thank you so much!`,
      emotion: "touched",
      sentimentDelta: 6,
      hint: `⭐ Favorite Gift Loved! +6 Friendship points awarded!`
    };
  }

  // 2. Liked Items
  const isLiked = npc.likes.some(like => itemLower.includes(like.toLowerCase()) || like.toLowerCase().includes(itemLower));
  if (isLiked) {
    const likedReplies: Record<string, string> = {
      maya: `Ooh, nice find! ${giftItem} is going to be so great to have around the Tiki Bar. Thanks a ton!`,
      isla: `Awesome! I love ${giftItem}. It totally fits the beach vibe!`,
      marina: `Fascinating! ${giftItem} is such a neat specimen. Thank you so much!`,
      kai: `Hey, much obliged! Good ${giftItem} comes in handy out here on the coast.`,
      mira: `How delightful! Fresh ${giftItem} will blend wonderfully into my herbal teas. Thank you kindly!`,
      elara: `Hey, now this is useful! Quality ${giftItem} is always welcome at my workbench. Appreciate it!`,
      rowan: `Ah, marvelous! Fresh ${giftItem} will add some extra cheer to the tavern pantry. Good on you!`,
      silas: `Fascinating specimen. This ${giftItem} contains notable therapeutic properties. Thank you for thinking of my research.`,
      finn: `Solid stuff! You can never have enough ${giftItem} around the shop. Thanks a million!`,
      cora: `What a tasteful offering. This ${giftItem} will be put to excellent use. Thank you, citizen!`
    };

    return {
      reply: likedReplies[npc.id] || `Thank you! I'm quite fond of ${giftItem}. Very thoughtful of you!`,
      emotion: "happy",
      sentimentDelta: 4,
      hint: `✨ Liked Gift! +4 Friendship points awarded.`
    };
  }

  // 3. Disliked Items
  const isDisliked = npc.dislikes.some(dis => itemLower.includes(dis.toLowerCase()) || dis.toLowerCase().includes(itemLower));
  if (isDisliked) {
    const dislikedReplies: Record<string, string> = {
      maya: `Uh... thanks, but ${giftItem} isn't really my style. Maybe someone in town could use it?`,
      isla: `Oof, ${giftItem}? That's a total wipeout for me, but thanks for stopping by!`,
      marina: `Oh dear, ${giftItem}? That doesn't really belong near the tidepools, but thanks anyway.`,
      kai: `Not sure what I'd do with ${giftItem} on the pier, mate! But cheers for the thought.`,
      mira: `Oh... er, thank you, but I'm not quite sure what to do with ${giftItem}. It feels a bit out of place in my garden.`,
      elara: `Bah! ${giftItem}? That's useless around a forge. But I suppose you meant well...`,
      rowan: `Hmm, ${giftItem}? Can't brew with it or serve it, friend! But thanks for the gesture nonetheless.`,
      silas: `I have little clinical utility for ${giftItem}, I'm afraid. Please be mindful of what you collect.`,
      finn: `Oof, ${giftItem}? Not exactly craft material, but thanks for stopping by!`,
      cora: `Oh my. ${giftItem}? That hardly belongs on the council desk, but I appreciate your polite intentions.`
    };

    return {
      reply: dislikedReplies[npc.id] || `Thank you, though ${giftItem} isn't really something I need right now.`,
      emotion: "neutral",
      sentimentDelta: 0,
      hint: `⚠️ Neutral/Disliked Item. Try offering items they like!`
    };
  }

  // 4. General / Food / Forage default
  return {
    reply: `Thank you kindly for the ${giftItem}! It's very sweet of you to bring this by.`,
    emotion: "warm",
    sentimentDelta: 2,
    hint: `+2 Friendship points awarded.`
  };
}

// Procedural village rumors
function getNaturalVillageRumor(npc: NPCProfile, gameTime?: string, weather?: string): { reply: string; hint: string } {
  const rumors: Record<string, Array<{ text: string; hint: string }>> = {
    maya: [
      {
        text: "During low tide near the Tiki Bar, you can find rare purple starfish and spiral conch shells washed up along the sandbars!",
        hint: "Beach Foraging: Low tide reveals rare coastal shells and starfish."
      },
      {
        text: "Isla and I are planning a beach luau with tiki torches once we gather enough coconuts and firewood. You're definitely invited!",
        hint: "Beach Community: Help gather coconuts and timber for beach events."
      },
      {
        text: "Kai caught a shimmering rainbow trout yesterday right by the pier! He swore it was winking at him before he reeled it in.",
        hint: "Fishing Lore: Rare fish bite along the deep beach pier."
      }
    ],
    isla: [
      {
        text: "The afternoon waves have the cleanest breaks right around 3:00 PM when the sea breeze picks up. Perfect for a quick swim!",
        hint: "Coastal Activity: Visit the beach in the afternoon for vibrant waves."
      },
      {
        text: "Finn carved a set of lightweight cedar paddles for our beach surfboards. His woodworking is honestly wizardry!",
        hint: "Crafting Lore: Finn can craft custom beach and furniture items."
      }
    ],
    marina: [
      {
        text: "The bioluminescent anemones in the outer reef glow bright azure under twilight. It's like an underwater galaxy!",
        hint: "Marine Wonder: Coral reefs glow during dusk and evening hours."
      },
      {
        text: "Starfish can actually regrow lost limbs if the ocean water stays pure and unpolluted. Nature is so magical!",
        hint: "Eco Lore: Keeping the shores clean protects marine life."
      }
    ],
    kai: [
      {
        text: "If you're angling off the pier, cast your line towards the rocky shelf on the eastern edge—the king trout nest there.",
        hint: "Fishing Secret: Cast near rocky outcroppings for bigger catches."
      },
      {
        text: "Maya makes the meanest spiced coconut punch in the valley. One sip and all your tired muscles instantly relax.",
        hint: "Tiki Bar: Coconut drinks restore player energy and stamina."
      }
    ],
    mira: [
      {
        text: "I noticed the chamomile blossoms opening earlier than usual near the southern creek. It means the soil is especially fertile this week—great for strawberries!",
        hint: "Farming Tip: Crops grow faster when planted in fertile soil plots."
      },
      {
        text: "Rowan was telling me that under a clear twilight, silver trout leap near the lake's wooden pier. The reflection of the stars attracts them!",
        hint: "Fishing Tip: Fish at Whispering Lake during dusk or evening for rare catches."
      },
      {
        text: "Silas has been looking for rare glowmoss in the shaded forest hollows. If you find any, he'd probably treasure it deeply.",
        hint: "Gift Tip: Silas adores Glowmoss for his alchemical tinctures."
      }
    ],
    elara: [
      {
        text: "Heard Finn talking about reinforcing the old watermill east of the lake. If we get the cedar gears turning again, we can mill golden flour for everyone!",
        hint: "Village Quest: Assist Finn and Rowan with building materials."
      },
      {
        text: "Word from the capital traders: they're paying double for finished blacksmith tools and copper ingots this season. Good thing my bellows are hot!",
        hint: "Economy Tip: Smelted ingots and crafted tools sell for high gold coins."
      },
      {
        text: "Mayor Cora spent two hours organizing festival ledgers last night. Rowan had to bring her a fresh cider just to get her to take a break!",
        hint: "Social Tip: Mayor Cora appreciates calm, well-mannered gifts like Antique Quills."
      }
    ],
    rowan: [
      {
        text: "A merchant passing through told me the deep forest mushrooms sprout twice as fast after a gentle morning mist. Keep your eyes peeled!",
        hint: "Foraging Tip: Check forest paths for rare mushrooms after rain."
      },
      {
        text: "Elara broke another anvil hammer yesterday laughing at her own strength! She claims it was a hairline fracture in the steel, but I know she just swung too hard.",
        hint: "Character Lore: Elara takes immense pride in her forged tools."
      },
      {
        text: "The annual Harvest Banquet is approaching! I'll be baking honey spiced loaves—if anyone brings fresh honeycomb, there's always a warm seat by the hearth.",
        hint: "Gift Tip: Honeycomb is Rowan's favorite ingredient."
      }
    ],
    silas: [
      {
        text: "My atmospheric barometer indicates that evening dew in the pine grove carries a high concentration of therapeutic terpenes. Evening walks are remarkably restorative.",
        hint: "Health Tip: Resting by the homestead hearth or near forest springs recovers stamina."
      },
      {
        text: "Mira's botanical methods are surprisingly rigorous. Her dried mint infusions reduce inflammation twice as fast as standard academy remedies.",
        hint: "Herb Lore: River Mint and Chamomile Tea provide instant energy boosts."
      }
    ],
    finn: [
      {
        text: "I spotted a family of river otters playing near the lake reeds! That means the water purity is top-notch. Great news for the timber seasoning pool.",
        hint: "Lake Lore: Whispering Lake is home to pristine wildlife and fish."
      },
      {
        text: "If you're tending crops, make sure you water the tilled soil every single morning before noon! Sun-dried soil slows seedling growth.",
        hint: "Farming Tip: Water your crops daily to advance growth stages."
      }
    ],
    cora: [
      {
        text: "The village council is preparing the Notice Board for seasonal requests. Lending a hand to your fellow neighbors is the quickest way to earn village trust!",
        hint: "Notice Board: Fulfill villager requests to gain gold and friendship points."
      },
      {
        text: "We are blessed with peaceful borders this season. Let us ensure the granary and storehouses are full before the winter frost arrives.",
        hint: "Community Goal: Stockpile crops, wood, and fish in your storehouse."
      }
    ]
  };

  const pool = rumors[npc.id] || rumors.mira;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return { reply: picked.text, hint: picked.hint };
}

// Procedural schedule inquiries
function getNaturalScheduleResponse(npc: NPCProfile, activeSlot: any, timePeriod: string): string {
  const customResponses: Record<string, string> = {
    maya: `Right now I'm at the ${activeSlot.locationName}, ${activeSlot.activity.toLowerCase()}. Nothing beats the ocean breeze!`,
    isla: `Catching the vibe at ${activeSlot.locationName}—${activeSlot.activity.toLowerCase()}! The water is sparkling today!`,
    marina: `I'm exploring around ${activeSlot.locationName}, ${activeSlot.activity.toLowerCase()}. Marine life is so endlessly fascinating!`,
    kai: `Stationed at ${activeSlot.locationName}, ${activeSlot.activity.toLowerCase()}. Reeling in good times!`,
    mira: `Right now I'm at the ${activeSlot.locationName}, ${activeSlot.activity.toLowerCase()}. The air is delightful here!`,
    elara: `I'm stationed around ${activeSlot.locationName} doing some honest work: ${activeSlot.activity.toLowerCase()}. No rest for the dedicated!`,
    rowan: `Taking care of business at ${activeSlot.locationName}! Currently ${activeSlot.activity.toLowerCase()}. The tavern never truly sleeps!`,
    silas: `I am presently attending to duties at ${activeSlot.locationName}—${activeSlot.activity.toLowerCase()}. Precision requires steady focus.`,
    finn: `Busy at ${activeSlot.locationName}! Just ${activeSlot.activity.toLowerCase()}. Nothing beats the smell of fresh timber!`,
    cora: `I am currently at ${activeSlot.locationName} overseeing civic duties: ${activeSlot.activity.toLowerCase()}. Evergreen runs like clockwork.`
  };

  return customResponses[npc.id] || `I'm at ${activeSlot.locationName}, currently ${activeSlot.activity.toLowerCase()}.`;
}

// Natural greetings based on time of day and friendship tier
function getNaturalGreeting(npc: NPCProfile, activeSlot: any, timeNum: number, relationship: any): string {
  const period = getTimePeriod(timeNum);
  const hearts = relationship.hearts || 0;

  if (hearts >= 3) {
    return `Ah, my dear friend! Wonderful to see you this ${period}. How has your day in Evergreen been treating you?`;
  }
  if (hearts >= 1) {
    return `Good ${period}, traveler! It's always nice running into you around ${activeSlot.locationName}.`;
  }

  const defaultGreetings: Record<string, Record<string, string>> = {
    maya: {
      morning: "Morning sun! Nothing beats a fresh sea breeze and clear blue sky.",
      afternoon: "Hey there! Ready to kick back with a tropical coconut smoothie?",
      evening: "Evening! The sunset over the beach waves is pure gold tonight.",
      night: "Tiki torches are glowing! Perfect time for warm beach stories."
    },
    isla: {
      morning: "Mornin'! The surf break is looking crisp and glassy today!",
      afternoon: "Hey surfer! Ready to dive in or play some beach volleyball?",
      evening: "Golden hour on the coast! Best time to watch the tide roll in.",
      night: "Starlit waves are so peaceful. Rest up for tomorrow's swell!"
    },
    marina: {
      morning: "Good morning! The low tide exposed so many fascinating tidepools!",
      afternoon: "Hello! Did you see the school of rainbow fish near the reef?",
      evening: "The evening tide brings in glowing bioluminescent plankton!",
      night: "Night diving is magical, but I'm cataloging shells for now."
    },
    kai: {
      morning: "Morning mate! The fish are biting off the end of the pier!",
      afternoon: "You look... different, but great. Ever thought of joining us at the beach?",
      evening: "Evening! Got the beach bonfire crackling if you want to pull up a log.",
      night: "Clear starry skies over the ocean. Doesn't get much better than this."
    },
    mira: {
      morning: "Good morning! The morning dew smells wonderful today.",
      afternoon: "Hello there. May the forest grant you peace this afternoon.",
      evening: "Good evening. The twilight colors over the trees are so soothing.",
      night: "Quiet night, isn't it? Make sure you stay warm by the hearth."
    },
    elara: {
      morning: "Morning! Crisp air and a glowing furnace—ready to conquer the day!",
      afternoon: "Hey there! Mind your step around the forge, hot sparks flying!",
      evening: "Evening, traveler! Time to wind down and head to Rowan's for a pint.",
      night: "Late hour! The anvil is cooling down, and so should we."
    },
    rowan: {
      morning: "Top of the morning to you! Fresh brew's on the stove!",
      afternoon: "Welcome, welcome! Looking for a hot meal or good company?",
      evening: "Good evening, friend! Come in, take a seat by the crackling fire!",
      night: "Closing hours soon, but there's always time for one last story."
    },
    silas: {
      morning: "Good morning. May your health and vitality remain robust today.",
      afternoon: "Good day. Do you require any herbal salves or advice?",
      evening: "A pleasant evening to you. The evening air is quite invigorating.",
      night: "Late hours are best for quiet contemplation and reading."
    },
    finn: {
      morning: "Mornin'! Sun's up, sawdust is flying! Let's build something grand.",
      afternoon: "Hey friend! Just measuring some fresh cedar planks.",
      evening: "Good evening! Another solid day's work in the books.",
      night: "Heading home to put my feet up. Rest well tonight!"
    },
    cora: {
      morning: "Good morning, citizen. May our valley flourish today.",
      afternoon: "Good afternoon. I hope your endeavors in Evergreen are prosperous.",
      evening: "Good evening. Another peaceful day in our beloved valley.",
      night: "A restful night to you. Evergreen sleeps peacefully under the stars."
    }
  };

  const npcGreetings = defaultGreetings[npc.id] || defaultGreetings.mira;
  return npcGreetings[period] || `Hello! Hope you're enjoying your time in Evergreen.`;
}

function getNaturalDialogueByTopic(npc: NPCProfile, activeSlot: any, msg: string, relationship: any): string {
  const m = (msg || "").toLowerCase();

  // Beach, Waves & Coastal Life
  if (m.includes("beach") || m.includes("surf") || m.includes("tiki") || m.includes("sand") || m.includes("ocean") || m.includes("swim")) {
    if (npc.id === "maya") return "Maybe... if you're there to help me with my hair. The salt breeze has a mind of its own! But seriously, the beach is where life happens.";
    if (npc.id === "isla") return "The waves at Evergreen Bay are so clean and gentle! I can teach you how to catch a 5-foot swell whenever you're ready.";
    if (npc.id === "marina") return "The tidepools and coral shoals are full of living wonders! We found a shell that glows violet in the moonlight.";
    if (npc.id === "kai") return "You look... different, but great. Ever thought of joining us at the beach? The water's warm and the bonfire's stoked.";
    return "Evergreen's shoreline is breathtaking. The fresh ocean mist rejuvenates the entire valley!";
  }

  // Hair, bandana, style, appearance, compliments
  if (m.includes("hair") || m.includes("bandana") || m.includes("pretty") || m.includes("cute") || m.includes("handsome") || m.includes("look") || m.includes("outfit") || m.includes("style")) {
    if (npc.id === "maya") return "Haha, you noticed my bandana? I tied it myself with sea-silk thread! It keeps the unruly curls out of my eyes when the coast winds pick up.";
    if (npc.id === "isla") return "Aw, thank you! Saltwater actually gives my hair that natural wavy bounce, though brushing it after a surf is quite the adventure!";
    if (npc.id === "marina") return "My cyan locks? People always ask if it's dyed with algae extract, but it's pure ocean spirit! You're looking sharp yourself!";
    if (npc.id === "kai") return "Appreciate it, mate! Salt, sun, and an open shirt is my entire wardrobe philosophy. Looks like you've got great taste!";
    if (npc.id === "mira") return "That is very kind of you to say... I weave wild clover and mint leaves into my braid for good fortune.";
    if (npc.id === "elara") return "Hah! You're flattering a blacksmith with soot on her cheek? You've got guts, traveler—and I like it.";
    return "Why, thank you! That's very thoughtful of you to notice.";
  }

  // Love, Romance & Flirting
  if (m.includes("love") || m.includes("crush") || m.includes("date") || m.includes("heart") || m.includes("like you") || m.includes("marry")) {
    if (relationship.hearts >= 3) {
      return `You know... having you here in Evergreen makes every single day brighter. I cherish our moments together more than you might realize.`;
    }
    return `Oh! You're quite the charmer, aren't you? Let's spend more time together around the valley and see where the wind takes us.`;
  }

  // Farming & Crops
  if (m.includes("farm") || m.includes("crop") || m.includes("plant") || m.includes("seed") || m.includes("strawberry") || m.includes("pumpkin")) {
    return `Farming is the lifeblood of our valley. Tilling rich soil, watering morning seedlings, and harvesting plump crops brings true peace.`;
  }

  // Fishing & Water
  if (m.includes("fish") || m.includes("lake") || m.includes("trout") || m.includes("rod") || m.includes("catch")) {
    return `Whispering Lake and the beach pier have the cleanest mountain waters. Casting a line at dusk when the fish bite is pure therapy.`;
  }

  // Weather & Seasons
  if (m.includes("weather") || m.includes("rain") || m.includes("sun") || m.includes("storm") || m.includes("season")) {
    return `The valley weather is always full of character. It nourishes our gardens, feeds the forest springs, and paints the sky in gold.`;
  }

  // Secrets, Rumors & Gossip
  if (m.includes("secret") || m.includes("rumor") || m.includes("lore") || m.includes("gossip") || m.includes("mystery")) {
    return `The elders say there's an ancient starflower grove deep in the southern woods that only blooms when friendship in the valley is at its peak.`;
  }

  return `${activeSlot.dialogueHint || `It's always a pleasure chatting with you in ${activeSlot.locationName}. Let's make the most of this fine day!`}`;
}

function getTimePeriod(minutes: number): "morning" | "afternoon" | "evening" | "night" {
  if (minutes >= 360 && minutes < 720) return "morning"; // 6am - 12pm
  if (minutes >= 720 && minutes < 1020) return "afternoon"; // 12pm - 5pm
  if (minutes >= 1020 && minutes < 1260) return "evening"; // 5pm - 9pm
  return "night"; // 9pm - 6am
}

function parseGameTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 720;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

export async function simulateNPCMeeting(npcAId: string, npcBId: string, locationName: string, gameTime: string) {
  const npcA = getNPC(npcAId);
  const npcB = getNPC(npcBId);
  if (!npcA || !npcB) return null;

  // Natural procedural meeting gossip (Fast & reliable)
  const topicList = [
    `discussing the upcoming harvest festival banquet`,
    `sharing notes on repairing the old timber bridge`,
    `commenting on the clear waters of Whispering Lake`,
    `planning new herbal remedies and tool orders`
  ];
  const topic = topicList[Math.floor(Math.random() * topicList.length)];
  const rumorSummary = `${npcA.name} and ${npcB.name} met at ${locationName}, ${topic}.`;

  memoryStore.addRumor({
    fromNpcId: npcA.id,
    toNpcId: npcB.id,
    topic: "Village Gossip",
    content: rumorSummary,
    gameTime
  });

  return {
    lineA: `Hello ${npcB.name}! Good to run into you here at ${locationName}.`,
    lineB: `Ah, ${npcA.name}! May the forest breeze bring prosperity to your work today.`,
    rumorSummary
  };
}
