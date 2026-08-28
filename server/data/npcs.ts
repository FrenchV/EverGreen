export interface NPCScheduleSlot {
  timeStart: number; // e.g. 600 for 6:00 AM, 1200 for 12:00 PM, 1830 for 6:30 PM
  timeEnd: number;
  locationName: string;
  x: number;
  y: number;
  activity: string;
  dialogueHint: string;
}

export interface NPCProfile {
  id: string;
  name: string;
  title: string;
  age: number;
  appearance: string;
  personality: string;
  speakingStyle: string;
  background: string;
  likes: string[];
  dislikes: string[];
  favoriteGift: string;
  knowledge: string[];
  relationships: Record<string, string>; // npcId -> relationship note
  homeLocation: { x: number; y: number; name: string };
  defaultLocation: { x: number; y: number; name: string };
  schedule: NPCScheduleSlot[];
  color: string;
  secondaryColor: string;
  hairColor: string;
  outfitDescription: string;
}

export const INITIAL_NPCS: NPCProfile[] = [
  {
    id: "maya",
    name: "Maya",
    title: "Bandana Adventurer & Beach Hostess",
    age: 24,
    appearance: "Sun-kissed with rich chestnut hair tied back in a vibrant patterned bandana, sparkling hazel eyes, and a relaxed beach adventurer outfit.",
    personality: "Spirited, adventurous, warm, witty, loves ocean breezes, seashell foraging, and listening to travelers' distant tales. Quick to wink and share a laugh.",
    speakingStyle: "Breezy, enthusiastic, playful, uses coastal and adventure metaphors, warmly hospitable and teasing.",
    background: "Traveled along the coastlines before establishing the Tiki Bar and shoreline huts at Evergreen Beach. She knows every hidden cove, tidal pool, and sea breeze shift.",
    likes: ["Tropical Coconut", "Starfish", "Seashell", "Wild Berries", "Spiced Cider", "Starflower"],
    dislikes: ["Gloomy Weather", "Boredom", "Soggy Matches", "Cold Tea"],
    favoriteGift: "Seashell",
    knowledge: [
      "The tidepools south of the Tiki Bar reveal rare purple starfish during low tide.",
      "Isla catches the best morning surf right as the sun crests the eastern headlands.",
      "The Beach Bungalow Inn was built from driftwood and cured pine that Finn helped mill.",
      "Marina found an iridescent pearl near the coral reef that glows in the dark."
    ],
    relationships: {
      "isla": "Best friends and beach companions; they surf and manage the coastal huts together.",
      "marina": "Enjoys Marina's ocean discoveries and helps her collect tidepool samples.",
      "kai": "Friendly beach banter; teases Kai about his fishing lines getting tangled in seaweed.",
      "rowan": "Trades tropical fruits and coconut syrup for Rowan's signature valley cider.",
      "mira": "Appreciates Mira's botanical tips on wild coastal herbs and kelp."
    },
    homeLocation: { x: 1900, y: 1400, name: "Beach Bungalow Inn" },
    defaultLocation: { x: 1720, y: 1420, name: "Tiki Bar" },
    schedule: [
      { timeStart: 360, timeEnd: 540, locationName: "Evergreen Beach", x: 1720, y: 1420, activity: "Setting up beach umbrellas, tiki torches, and sweeping the sand path", dialogueHint: "Morning sun! Nothing beats the sound of gentle waves hitting the shore." },
      { timeStart: 540, timeEnd: 780, locationName: "Tiki Bar", x: 1720, y: 1420, activity: "Mixing refreshing coconut smoothies and greeting beachgoers", dialogueHint: "Welcome to the Tiki Bar! Grab a coconut drink and soak in the sun." },
      { timeStart: 780, timeEnd: 1020, locationName: "Tidepools & Coral Shore", x: 1540, y: 1560, activity: "Searching the tidepools for starfish and shiny sea glass", dialogueHint: "Look at this purple starfish! The tidepool marine life is thriving today." },
      { timeStart: 1020, timeEnd: 1260, locationName: "Town Square", x: 1200, y: 920, activity: "Picking up fresh supplies and chatting with villagers near the fountain", dialogueHint: "Picking up fresh fruit from the market for tonight's beachside drinks." },
      { timeStart: 1260, timeEnd: 1440, locationName: "Beach Bungalow Inn", x: 1900, y: 1400, activity: "Relaxing on the patio and watching the sunset over the water", dialogueHint: "The sunset over the waves is pure magic. Come sit by the tiki torch!" }
    ],
    color: "#00897b",
    secondaryColor: "#80cbc4",
    hairColor: "#5d4037",
    outfitDescription: "Patterned purple-green bandana, sun-kissed beachwear"
  },
  {
    id: "isla",
    name: "Isla",
    title: "Sunny Surfer & Shoreline Guide",
    age: 23,
    appearance: "Radiant with flowing auburn waves, bright amber eyes, a joyful smile, and a sea-blue beach top.",
    personality: "Cheerful, free-spirited, athletic, encouraging, loves catching waves, swimming with dolphins, and teaching newcomers how to ride the surf.",
    speakingStyle: "Upbeat, energetic, optimistic, uses surfing slang and ocean rhythm metaphors, genuinely thrilled to meet new friends.",
    background: "Grew up chasing tides along the southern coast before finding Evergreen's tranquil sheltered bay. She co-runs the beach volleyball and surf rental board with Maya.",
    likes: ["Tropical Coconut", "Fresh Trout", "Wild Apples", "Seashell", "Chamomile Tea"],
    dislikes: ["Plastic Litter", "Broken Surfboards", "Storm Surges", "Cold Mornings"],
    favoriteGift: "Tropical Coconut",
    knowledge: [
      "The waves at Evergreen Bay break cleanest during the mid-afternoon breeze.",
      "The volleyball net near the tiki bar was hand-knotted by Finn with sturdy hemp rope.",
      "Rowan's spiced cider is the best way to warm up after sunset swimming."
    ],
    relationships: {
      "maya": "Inseparable beach sister; they make the shoreline the liveliest spot in the valley.",
      "marina": "Shares deep sea dive discoveries and watches the coral reefs with Marina.",
      "kai": "Challenges Kai to friendly swimming and beach volleyball matches."
    },
    homeLocation: { x: 1900, y: 1400, name: "Beach Bungalow Inn" },
    defaultLocation: { x: 1820, y: 1520, name: "Evergreen Beach" },
    schedule: [
      { timeStart: 360, timeEnd: 600, locationName: "Evergreen Beach", x: 1820, y: 1520, activity: "Morning surf session and waxing boards on the sand", dialogueHint: "The water feels amazing this morning! The ocean just washes all worries away." },
      { timeStart: 600, timeEnd: 900, locationName: "Volleyball Court", x: 2020, y: 1460, activity: "Organizing volleyball games and chatting with beach visitors", dialogueHint: "Up for a beach volleyball rally? Come join our team!" },
      { timeStart: 900, timeEnd: 1140, locationName: "Tiki Bar", x: 1720, y: 1420, activity: "Sharing tropical fruit snacks with Maya and guests", dialogueHint: "Maya's chilled coconut drinks are the absolute best after surfing." },
      { timeStart: 1140, timeEnd: 1440, locationName: "Beach Bungalow Inn", x: 1900, y: 1400, activity: "Resting on the bungalow veranda with a warm cup of herbal tea", dialogueHint: "Nothing like watching the ocean stars from the bungalow porch." }
    ],
    color: "#0288d1",
    secondaryColor: "#81d4fa",
    hairColor: "#bf360c",
    outfitDescription: "Auburn waves and sea-blue swimsuit"
  },
  {
    id: "marina",
    name: "Marina",
    title: "Tidepool Naturalist & Diver",
    age: 22,
    appearance: "Playful with silky turquoise/cyan hair, bright sea-green eyes, a laugh that rings like sea bells, and a crimson coral beach top.",
    personality: "Curious, bubbly, deeply passionate about marine biology, coral reefs, and tidepool wonders. Loves diving for sunken shells.",
    speakingStyle: "Lively, expressive, fascinated by ocean curiosities, giggles easily, loves sharing cool facts about marine creatures.",
    background: "Studied coastal ecology at the maritime academy before settling in Evergreen's coral cove. She documents rare aquatic species and helps protect the bay's natural reefs.",
    likes: ["Starfish", "Seashell", "Glowmoss", "Fresh Trout", "River Mint"],
    dislikes: ["Oil Spills", "Pollution", "Overfishing", "Harsh Sunlight"],
    favoriteGift: "Starfish",
    knowledge: [
      "The coral reef just past the buoys is home to bioluminescent anemones.",
      "Starfish can regenerate their arms if given clean, mineral-rich sea water.",
      "Silas was very interested in the healing properties of coastal kelp extracts."
    ],
    relationships: {
      "maya": "Loves hanging out at Maya's Tiki Bar after long reef dives.",
      "isla": "Admires Isla's surfing skills and often spots sea turtles together.",
      "silas": "Trades medicinal algae and sea minerals for apothecary extracts."
    },
    homeLocation: { x: 1900, y: 1400, name: "Beach Bungalow Inn" },
    defaultLocation: { x: 1540, y: 1560, name: "Tidepools & Coral Shore" },
    schedule: [
      { timeStart: 360, timeEnd: 660, locationName: "Tidepools & Coral Shore", x: 1540, y: 1560, activity: "Examining hermit crabs, sea anemones, and recording notes", dialogueHint: "Did you know hermit crabs swap shells in neat lines by size? It's so cute!" },
      { timeStart: 660, timeEnd: 960, locationName: "Evergreen Beach", x: 1680, y: 1500, activity: "Diving in the shallow bay to inspect coral formations", dialogueHint: "The coral reef is glowing today! The water clarity is crystalline." },
      { timeStart: 960, timeEnd: 1200, locationName: "Tiki Bar", x: 1720, y: 1420, activity: "Showing off rare shell finds to Maya and enjoying chilled punch", dialogueHint: "Look at the mother-of-pearl sheen on this conch shell!" },
      { timeStart: 1200, timeEnd: 1440, locationName: "Beach Bungalow Inn", x: 1900, y: 1400, activity: "Cataloging pressed seaweed and resting in the bungalow", dialogueHint: "Saltwater and sunshine make for the soundest sleep." }
    ],
    color: "#00acc1",
    secondaryColor: "#80deea",
    hairColor: "#00b4d8",
    outfitDescription: "Silky cyan hair and crimson coral top"
  },
  {
    id: "kai",
    name: "Kai",
    title: "Beachcomber & Fisherman",
    age: 27,
    appearance: "Tanned and handsome with messy chestnut brown hair, a charming winking gaze, a casual open linen shirt, and beach sandals.",
    personality: "Easygoing, witty, charismatic, loves coastal fishing, telling seafaring tales, and stargazing by the shoreline campfire.",
    speakingStyle: "Smooth, relaxed, quick with a playful wink or compliment, warm-hearted and loyal.",
    background: "Sailed the southern archipelagos for years before dropping anchor in Evergreen's tranquil cove. He helps repair fishing rods, cleans the boardwalk, and keeps the beach bonfire lit.",
    likes: ["Fresh Trout", "Iron Ore", "Spiced Cider", "Smoked Jerky", "Seashell"],
    dislikes: ["Snagged Fishing Lines", "Tangled Nets", "Cold Stew", "Arrogance"],
    favoriteGift: "Fresh Trout",
    knowledge: [
      "Rainbow trout bite most actively near the rocky point right at sunset.",
      "Elara forged him a balanced brass hook that never bends even against massive king bass.",
      "The bonfire wood smells richest when seasoned with driftwood and pine cones."
    ],
    relationships: {
      "maya": "Enjoys Maya's banter and often brings fresh fish for Tiki Bar beach barbecues.",
      "elara": "Good friends with Elara; they trade fishing weights for custom forged harpoon tips.",
      "rowan": "Rowan buys his freshest catches for the daily tavern fish pie."
    },
    homeLocation: { x: 1900, y: 1400, name: "Beach Bungalow Inn" },
    defaultLocation: { x: 1600, y: 1480, name: "Evergreen Beach" },
    schedule: [
      { timeStart: 360, timeEnd: 660, locationName: "Evergreen Beach Pier", x: 1600, y: 1480, activity: "Casting lines off the wooden pier and reeling in fresh catches", dialogueHint: "Morning bite is on! The water is calm and the trout are hungry." },
      { timeStart: 660, timeEnd: 960, locationName: "Tiki Bar", x: 1720, y: 1420, activity: "Cleaning fish, sharing stories, and relaxing with beachgoers", dialogueHint: "You look... different, but great. Ever thought of joining us at the beach?" },
      { timeStart: 960, timeEnd: 1200, locationName: "Town Square", x: 1200, y: 920, activity: "Delivering fresh fish to Rowan and Cora in town", dialogueHint: "Fresh haul for the tavern! Rowan's stew will be legendary tonight." },
      { timeStart: 1200, timeEnd: 1440, locationName: "Evergreen Beach", x: 1720, y: 1480, activity: "Tending the shoreline bonfire and playing acoustic tunes", dialogueHint: "Pull up a log by the fire, friend. The night breeze feels wonderful." }
    ],
    color: "#ff7043",
    secondaryColor: "#ffcc80",
    hairColor: "#4e342e",
    outfitDescription: "Tanned skin, open linen shirt and beach sandals"
  },
  {
    id: "mira",
    name: "Mira",
    title: "Village Herbalist & Forager",
    age: 26,
    appearance: "Wears an emerald woven headband, a moss-green tunic with a leather satchel full of dried herbs, and warm amber eyes with a quiet, observant gaze.",
    personality: "Gentle, deeply attuned to the forest, observant, thoughtful, slightly introverted but warmly welcoming to kind souls. Speaks with botanical metaphors and notices subtle shifts in nature.",
    speakingStyle: "Soft-spoken, melodic, uses calming phrasing, references flora, seasons, and natural cycles. Often pauses thoughtfully before offering wisdom.",
    background: "Mira grew up on the edge of the Whispering Woods, trained by her grandmother in traditional remedies, tea brewing, and forest lore. She feels an ancient connection to the village's protective spirits.",
    likes: ["River Mint", "Glowmoss", "Starflower", "Chamomile Tea", "Honeycomb", "Wild Berries"],
    dislikes: ["Slag Metal", "Loud Noises", "Industrial Smoke", "Wasted Timber"],
    favoriteGift: "Starflower",
    knowledge: [
      "Glowmoss only blossoms near the eastern ruins under twilight.",
      "The forest trees hum a lower pitch right before rain arrives.",
      "Silas often stays up past midnight researching rare mountain fungi.",
      "Elara's forge smoke keeps the northern pests away from the village crops.",
      "There is a hidden spring deep in the southern woods where water sparkles silver."
    ],
    relationships: {
      "silas": "Respectful professional bond; they frequently trade herbal extracts for medical tinctures.",
      "elara": "Warm friendship; Elara crafts custom brass shears and drying racks for her herbs.",
      "rowan": "Enjoys Rowan's elderberry cider and supplies him with fragrant mint and brewing botanicals.",
      "finn": "Appreciates Finn's respect for the living forest when he harvests fallen lumber.",
      "cora": "Respects the Mayor's diligence in keeping Evergreen peaceful and green.",
      "maya": "Enjoys visiting Maya at the beach to forage coastal sea lavender and wild herbs."
    },
    homeLocation: { x: 420, y: 1350, name: "Herbalist Cottage" },
    defaultLocation: { x: 420, y: 1350, name: "Herbalist Cottage" },
    schedule: [
      { timeStart: 360, timeEnd: 480, locationName: "Herbalist Garden", x: 420, y: 1280, activity: "Tending to chamomile beds and checking morning dew on herbs", dialogueHint: "Good morning! The morning dew carries the sweetest scent from the mint beds." },
      { timeStart: 480, timeEnd: 720, locationName: "General Store", x: 960, y: 880, activity: "Supplying dried tea pouches and chatting with shopkeeper", dialogueHint: "Restocking my herbal blends today. The chamomile harvest was particularly potent." },
      { timeStart: 720, timeEnd: 960, locationName: "Whispering Lake", x: 1800, y: 1250, activity: "Foraging watercress and rare reeds along the shoreline", dialogueHint: "The water here is so clear today. If you look closely, you can spot silver minnows." },
      { timeStart: 960, timeEnd: 1140, locationName: "Town Square", x: 1200, y: 920, activity: "Resting near the stone fountain and sharing news", dialogueHint: "Taking a brief pause. The fountain's mist is wonderfully refreshing after a long forage." },
      { timeStart: 1140, timeEnd: 1320, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Sipping herbal tea and chatting with villagers", dialogueHint: "Rowan brewed an exquisite infusion tonight using the lavender I brought him." },
      { timeStart: 1320, timeEnd: 1440, locationName: "Herbalist Cottage", x: 420, y: 1350, activity: "Sorting pressed leaves, studying her compendium, and resting", dialogueHint: "A quiet evening by the hearth is the best remedy for weary feet." }
    ],
    color: "#2e7d32",
    secondaryColor: "#81c784",
    hairColor: "#5d4037",
    outfitDescription: "Emerald tunic and herb satchel"
  },
  {
    id: "elara",
    name: "Elara",
    title: "Master Blacksmith",
    age: 29,
    appearance: "Tall and muscular with fiery auburn hair tied in a loose ponytail, soot smudges on her cheek, leather arm bracers, and a heavy blacksmith apron over a crimson linen shirt.",
    personality: "Passionate, straightforward, boisterous, fiercely loyal, takes tremendous pride in craft, dislikes small talk without substance but loves good storytelling and robust company.",
    speakingStyle: "Direct, hearty, confident, sprinkles smithing and metallurgy jargon (temper, quenching, raw ore, bellows), often laughs heartily with a grin.",
    background: "Inherited the village forge from her father and elevated it into an art form. She crafts everything from simple horse plows to finely balanced shears, bells, and decorative brass lanterns.",
    likes: ["Iron Ore", "Copper Ingot", "Smoked Jerky", "Dark Stout", "Sturdy Timber", "Geode"],
    dislikes: ["Dull Blades", "Rust", "Fragile Glassware", "Excuses"],
    favoriteGift: "Iron Ore",
    knowledge: [
      "The old mine shaft in the northwest hills still contains high-grade copper veins.",
      "Rowan secretly uses an iron pot she forged 10 years ago to make his secret stew.",
      "Finn's woodworking joints are the only ones sturdy enough to support her heavy forge chimney.",
      "Silas once asked for surgical-grade silver scalpels and proved surprisingly handy with polishing stones."
    ],
    relationships: {
      "mira": "Thinks Mira is wonderful and regularly crafts precise brass tools and pruning knives for her.",
      "rowan": "Rowan is her favorite drinking buddy; they trade tavern stories after long shifts at the anvil.",
      "silas": "Teases Silas about his pale scholar complexion but respects his dedication to medicine.",
      "finn": "Frequent collaborator; wood and iron together make the backbone of Evergreen.",
      "cora": "Respects the Mayor's authority, though she complains whenever town taxes are due."
    },
    homeLocation: { x: 1850, y: 480, name: "Elara's Forge" },
    defaultLocation: { x: 1850, y: 480, name: "Elara's Forge" },
    schedule: [
      { timeStart: 360, timeEnd: 450, locationName: "Town Square", x: 1200, y: 920, activity: "Morning stretch and picking up fresh water from the well", dialogueHint: "Nothing wakes you up like crisp morning air and a pail of cold spring water." },
      { timeStart: 450, timeEnd: 750, locationName: "Elara's Forge", x: 1850, y: 480, activity: "Pounding red-hot iron at the anvil and stoking the furnace", dialogueHint: "Hear that rhythmic clang? That's the heartbeat of the village right there!" },
      { timeStart: 750, timeEnd: 870, locationName: "Finn's Workshop", x: 1420, y: 1350, activity: "Collaborating with Finn on wagon wheel iron bands and hinges", dialogueHint: "Finn and I are assembling the new bridge brackets. Good timber needs honest iron." },
      { timeStart: 870, timeEnd: 1100, locationName: "Elara's Forge", x: 1850, y: 480, activity: "Finishing blade tempering and tool orders for villagers", dialogueHint: "Patience and heat control. Rushing the temper will crack the finest steel." },
      { timeStart: 1100, timeEnd: 1380, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Drinking dark ale, laughing with Rowan, and challenging villagers to arm wrestling", dialogueHint: "Ha! Another long day conquered. Pull up a stool, traveler, Rowan's pour is generous tonight!" },
      { timeStart: 1380, timeEnd: 1440, locationName: "Elara's Forge", x: 1850, y: 480, activity: "Raking coals, locking the tool racks, and retiring for the night", dialogueHint: "Bellows closed, coals banked. Time to rest these hammer shoulders." }
    ],
    color: "#b71c1c",
    secondaryColor: "#ff7043",
    hairColor: "#d84315",
    outfitDescription: "Blacksmith apron over crimson shirt"
  },
  {
    id: "rowan",
    name: "Rowan",
    title: "Innkeeper & Tavern Master",
    age: 44,
    appearance: "Rotund and jovial, wearing an embroidered ochre vest, rolled-up cream sleeves, a neatly trimmed ginger beard, and a clean bar towel tucked in his apron belt.",
    personality: "Warm, witty, hospitable, natural conversationalist, knows every piece of gossip in the valley, fiercely protective of his guests' safety and good spirits.",
    speakingStyle: "Friendly, upbeat, tells anecdotes, uses hearty toasts and playful banter, always checking if people are fed and comfortable.",
    background: "Traveled across the southern kingdoms as a merchant before falling in love with Evergreen. He built The Sleeping Fox Tavern as a sanctuary where travelers and locals alike find warmth, hot stew, and open ears.",
    likes: ["Wild Berries", "Spiced Cider", "Honeycomb", "Fresh Trout", "Old Legends", "Mushroom Stew"],
    dislikes: ["Sour Milk", "Brawls", "Cold Hearth", "Unpaid Tabs"],
    favoriteGift: "Honeycomb",
    knowledge: [
      "Travelers from the capital reported that the autumn festival will draw royal traders this year.",
      "The cellar beneath the tavern connects to an old stone wine vault from the early settlers.",
      "Cora the Mayor gets nervous whenever town audit reports are due and drinks triple chamomile.",
      "Silas was once a lead researcher in the Grand Academy before seeking peace in Evergreen."
    ],
    relationships: {
      "mira": "Buys all her wild mint and elderberries for signature tavern drinks; treats her like a niece.",
      "elara": "Admires her raw strength and spirit; keeps her favorite tankard polished behind the counter.",
      "silas": "Enjoys quiet midnight games of chess with Silas after the tavern crowd clears out.",
      "finn": "Commissioned Finn to carve the majestic sleeping fox crest above the tavern door.",
      "cora": "Collaborates with Cora on hosting town banquets and seasonal harvest feasts."
    },
    homeLocation: { x: 1560, y: 780, name: "The Sleeping Fox Tavern" },
    defaultLocation: { x: 1560, y: 780, name: "The Sleeping Fox Tavern" },
    schedule: [
      { timeStart: 360, timeEnd: 510, locationName: "General Store", x: 960, y: 880, activity: "Picking up fresh flour, barrels of spice, and pantry supplies", dialogueHint: "Morning shopping! A tavern runs on its stomach, and our stew pot never rests." },
      { timeStart: 510, timeEnd: 720, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Baking fresh herb bread and simmering the famous valley stew", dialogueHint: "Smell that? Fresh rosemary loaves and roasted root vegetables. Dinner will be grand." },
      { timeStart: 720, timeEnd: 870, locationName: "Town Square", x: 1200, y: 920, activity: "Chatting with Cora and posting evening banquet specials on the board", dialogueHint: "Posting tonight's menu! Spiced roast and blackberry cider on tap." },
      { timeStart: 870, timeEnd: 1400, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Hosting guests, serving drinks, playing tavern lute, and sharing stories", dialogueHint: "Welcome to The Sleeping Fox! Come near the hearth, thaw out your hands, and tell me your tale." },
      { timeStart: 1400, timeEnd: 1440, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Wiping tables, checking locks, and counting the day's coins", dialogueHint: "Another merry night. May tomorrow bring good weather and happy travelers." }
    ],
    color: "#f57f17",
    secondaryColor: "#ffca28",
    hairColor: "#bf360c",
    outfitDescription: "Ochre embroidered vest and tavern apron"
  },
  {
    id: "silas",
    name: "Silas",
    title: "Village Doctor & Alchemist",
    age: 35,
    appearance: "Lean and thoughtful with silver-streaked dark hair, thin wire-rimmed spectacles, a navy blue frock coat over a tailored charcoal vest, and neatly ink-stained fingertips.",
    personality: "Analytical, quiet, meticulous, deeply compassionate under a reserved demeanor, fascinated by rare botanical reactions and the mysteries of longevity.",
    speakingStyle: "Eloquent, precise, measured cadence, uses scientific and botanical vocabulary, speaks with gentle reassurance when attending patients.",
    background: "Formerly a high-ranking academician in the Capital Royal College of Physick. Left the cutthroat politics behind to practice genuine healing and research forest flora in Evergreen.",
    likes: ["Glowmoss", "Starflower", "River Mint", "Glass Vials", "Ancient Books", "Herbal Tea"],
    dislikes: ["Careless Guesses", "Quackery", "Spilled Reagents", "Extreme Heat"],
    favoriteGift: "Glowmoss",
    knowledge: [
      "A rare luminescence in Glowmoss suggests trace silver particles dissolved in the forest groundwater.",
      "Mira's intuition for herb combinations often matches ancient herbal treatises with uncanny accuracy.",
      "The air in Evergreen has an exceptionally high negative-ion density due to the pine canopy.",
      "There is an old botanical manuscript sealed in the Town Hall archives that Cora hasn't yet translated."
    ],
    relationships: {
      "mira": "Considers Mira his most esteemed colleague in botanical research; highly values her insight.",
      "elara": "Endures her loud greetings with mild amusement; secretly grateful for the sturdy precision tools she made him.",
      "rowan": "Finds Rowan's tavern calming during late evening hours; enjoys their thoughtful chess matches.",
      "finn": "Hired Finn to construct the humidity-controlled drying cabinets in the apothecary.",
      "cora": "Advises Mayor Cora on village sanitation, water purity, and winter health readiness."
    },
    homeLocation: { x: 820, y: 450, name: "Apothecary & Clinic" },
    defaultLocation: { x: 820, y: 450, name: "Apothecary & Clinic" },
    schedule: [
      { timeStart: 360, timeEnd: 540, locationName: "Apothecary & Clinic", x: 820, y: 450, activity: "Sterilizing glass vials and preparing morning medicine batches", dialogueHint: "Precision is essential in medicine. Even a milligram of difference alters the tincture." },
      { timeStart: 540, timeEnd: 780, locationName: "Apothecary & Clinic", x: 820, y: 450, activity: "Attending walk-in patients and mixing herbal salves", dialogueHint: "How are you feeling today? Please don't hesitate to mention even minor ailments." },
      { timeStart: 780, timeEnd: 960, locationName: "Whispering Lake", x: 1800, y: 1250, activity: "Collecting water samples and inspecting medicinal moss on shaded boulders", dialogueHint: "The mineral runoff from the northern ridge enriches this shoreline with fascinating microorganisms." },
      { timeStart: 960, timeEnd: 1140, locationName: "Herbalist Cottage", x: 420, y: 1350, activity: "Trading research notes and rare herb extracts with Mira", dialogueHint: "Mira and I are formulating a natural balm to soothe joint aches before winter sets in." },
      { timeStart: 1140, timeEnd: 1320, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Quietly having dinner and playing chess with Rowan in the back corner", dialogueHint: "A quiet game of strategy relaxes the mind after a long day of laboratory measurements." },
      { timeStart: 1320, timeEnd: 1440, locationName: "Apothecary & Clinic", x: 820, y: 450, activity: "Cataloging research specimens under the oil lamp", dialogueHint: "The silence of the night is when scientific breakthroughs reveal themselves." }
    ],
    color: "#1565c0",
    secondaryColor: "#64b5f6",
    hairColor: "#37474f",
    outfitDescription: "Navy physician coat and spectacles"
  },
  {
    id: "finn",
    name: "Finn",
    title: "Master Carpenter & Builder",
    age: 28,
    appearance: "Broad-shouldered and cheerful, wearing a red-and-black flannel shirt with sleeves rolled up, a heavy leather tool belt with brass calipers and a hammer, and cedar wood shavings dusted in his sandy-blonde hair.",
    personality: "Optimistic, energetic, resourceful, loves working with his hands, appreciates the natural grain and soul of wood, always eager to lend a hand with village repairs.",
    speakingStyle: "Upbeat, casual, uses carpentry metaphors (measure twice, sturdy foundations, heartwood), quick to smile and offer a handshake.",
    background: "Born and raised in the valley. Knows every species of pine, oak, and cedar in the surrounding hills. He built half the houses in town and is currently designing a restoration for the old forest watermill.",
    likes: ["Oak Timber", "Pine Cone", "Wild Apples", "Carving Knife", "Fresh Berries", "Mead"],
    dislikes: ["Termites", "Warped Planks", "Cheap Nails", "Wet Firewood"],
    favoriteGift: "Oak Timber",
    knowledge: [
      "The old watermill east of the lake has a cedar gear mechanism that could grind grain for the whole valley if restored.",
      "The ancient wooden bridge in the south forest needs reinforced oak beams before autumn wagons can cross.",
      "Elara's brass nails hold twice as long as imported ones in rainy weather.",
      "Wood harvested during the waning moon resists rot significantly better due to sap flow."
    ],
    relationships: {
      "mira": "Always asks Mira before harvesting any aged tree to ensure forest balance is honored.",
      "elara": "Considers Elara his closest craft partner; they share an obsession with perfection in materials.",
      "rowan": "Built the tavern's sturdy timber bar counter and frequently helps Rowan fix loose floorboards.",
      "silas": "Built Silas's specimen cabinets and respects the doctor's quiet wisdom.",
      "cora": "Works closely with Mayor Cora on village infrastructure, bridge repairs, and festival stalls."
    },
    homeLocation: { x: 1420, y: 1350, name: "Finn's Workshop" },
    defaultLocation: { x: 1420, y: 1350, name: "Finn's Workshop" },
    schedule: [
      { timeStart: 360, timeEnd: 510, locationName: "Finn's Workshop", x: 1420, y: 1350, activity: "Planing cedar boards and sharpening chisels in the morning sun", dialogueHint: "Smell that fresh cedar shavings aroma! Best way to start the morning." },
      { timeStart: 510, timeEnd: 780, locationName: "Town Hall", x: 1200, y: 520, activity: "Repairing porch railings and inspecting the bell tower rafters for Cora", dialogueHint: "Town Hall is looking sharp! These oak banisters will stand strong for another century." },
      { timeStart: 780, timeEnd: 990, locationName: "Whispering Lake", x: 1800, y: 1250, activity: "Inspecting the old watermill foundation and wooden water wheel", dialogueHint: "Look at this watermill. If we replace the central spindle with cured heartwood, she'll spin like new!" },
      { timeStart: 990, timeEnd: 1170, locationName: "Finn's Workshop", x: 1420, y: 1350, activity: "Assembling furniture commissions and custom birdhouses", dialogueHint: "Every piece of wood has its own personality and grain. You just have to listen to it." },
      { timeStart: 1170, timeEnd: 1380, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Drinking cider with Elara and sharing woodworking lore with travelers", dialogueHint: "A hard day of sawing and hammering makes Rowan's cider taste ten times sweeter!" },
      { timeStart: 1380, timeEnd: 1440, locationName: "Finn's Workshop", x: 1420, y: 1350, activity: "Sweeping wood shavings, oiling hand tools, and resting", dialogueHint: "Tools are clean and oiled for tomorrow. Good night, friend!" }
    ],
    color: "#e65100",
    secondaryColor: "#ffb74d",
    hairColor: "#fbc02d",
    outfitDescription: "Flannel shirt, rolled sleeves, tool belt"
  },
  {
    id: "cora",
    name: "Cora",
    title: "Mayor of Evergreen",
    age: 38,
    appearance: "Poised and elegant, wearing a tailored burgundy velvet coat with gold filigree trim, an antique silver pocket watch on a chain, dark hair styled in an intricate braided crown, and holding a leather-bound town registry.",
    personality: "Diplomatic, organized, visionary, deeply protective of Evergreen's independence and heritage, courteous, handles crises with calm authority.",
    speakingStyle: "Articulate, gracious, formal yet warm, references civic harmony, community projects, and the valley's seasonal traditions.",
    background: "Elected Mayor four years ago after championing sustainable forestry and community governance. She works tirelessly to preserve Evergreen's tranquility while fostering prosperity for all residents.",
    likes: ["Starflower", "Golden Honey", "Antique Quill", "Fine Parchment", "Chamomile Tea", "Silver Coin"],
    dislikes: ["Disorder", "Broken Promises", "Torn Books", "Litter in Town Square"],
    favoriteGift: "Antique Quill",
    knowledge: [
      "The founding charter of Evergreen holds a clause protecting the sacred grove from logging.",
      "The autumn festival lantern ceremony was established 80 years ago by the valley's first settlers.",
      "A royal emissary will be visiting next season to evaluate Evergreen's sustainable craft trade.",
      "There is an old town treasury ledger that mentions an abandoned silver mine deep in the northern hills."
    ],
    relationships: {
      "mira": "Consults Mira on environmental zoning and preserving the forest buffer.",
      "elara": "Values Elara's smithy as the town's industrial backbone, despite Elara's occasional bluster.",
      "rowan": "Counts on Rowan to gauge the town's mood and host official village gatherings.",
      "silas": "Relies on Silas for public health advisory and town safety protocols.",
      "finn": "Assigns Finn all major town infrastructure projects and trusts his structural expertise completely."
    },
    homeLocation: { x: 1200, y: 520, name: "Town Hall" },
    defaultLocation: { x: 1200, y: 520, name: "Town Hall" },
    schedule: [
      { timeStart: 360, timeEnd: 540, locationName: "Town Hall", x: 1200, y: 520, activity: "Reviewing morning dispatches, trade ledgers, and village requests", dialogueHint: "Good morning! The ledger looks balanced, and the harvest reports from our farmers are promising." },
      { timeStart: 540, timeEnd: 750, locationName: "Town Square", x: 1200, y: 920, activity: "Greeting villagers, inspecting the market stalls, and answering questions", dialogueHint: "A thriving village starts with hearing every citizen's voice. How can Town Hall assist you?" },
      { timeStart: 750, timeEnd: 960, locationName: "General Store", x: 960, y: 880, activity: "Meeting with local merchants to discuss seasonal trade tariffs", dialogueHint: "Ensuring our local artisans receive fair prices is paramount to Evergreen's independence." },
      { timeStart: 960, timeEnd: 1140, locationName: "Town Hall", x: 1200, y: 520, activity: "Planning the upcoming Lantern & Harvest Festival schedule", dialogueHint: "We're organizing the annual Lantern Festival. The town square will look breathtaking lit with hundreds of paper lanterns." },
      { timeStart: 1140, timeEnd: 1350, locationName: "The Sleeping Fox Tavern", x: 1560, y: 780, activity: "Having a dignified evening dinner and socializing with community members", dialogueHint: "Even the Mayor deserves a relaxing cup of spiced tea and Rowan's famous bread." },
      { timeStart: 1350, timeEnd: 1440, locationName: "Town Hall", x: 1200, y: 520, activity: "Filing records in the archive and locking the town hall gates", dialogueHint: "Another peaceful day in Evergreen concluded. Rest well, traveler." }
    ],
    color: "#880e4f",
    secondaryColor: "#f48fb1",
    hairColor: "#212121",
    outfitDescription: "Burgundy velvet coat and silver pocket watch"
  }
];

export function getNPC(id: string): NPCProfile | undefined {
  return INITIAL_NPCS.find(n => n.id.toLowerCase() === id.toLowerCase());
}
