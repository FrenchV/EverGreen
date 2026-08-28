import React, { useEffect, useRef, useState } from "react";
import { PixelRenderer } from "../engine/pixelRenderer";
import { audioEngine } from "../engine/audioEngine";
import { NPCState, SkillProgress } from "../types";
import { Book, Heart, Users, Sparkles, X, MapPin, Gift, Clock, RefreshCw, Award, Flame, Sprout, Compass, Fish } from "lucide-react";

interface VillagerJournalProps {
  npcs: NPCState[];
  npcProfiles: any[];
  skills?: Record<"farming" | "foraging" | "fishing" | "social", SkillProgress>;
  onClose: () => void;
  onSimulateMeeting: (npcAId: string, npcBId: string, location: string) => Promise<any>;
}

export const VillagerJournal: React.FC<VillagerJournalProps> = ({
  npcs,
  npcProfiles,
  skills,
  onClose,
  onSimulateMeeting
}) => {
  const [activeTab, setActiveTab] = useState<"roster" | "rumors" | "matrix" | "skills">("roster");
  const [selectedNpcId, setSelectedNpcId] = useState<string>("mira");
  const [memories, setMemories] = useState<any[]>([]);
  const [rumors, setRumors] = useState<any[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const portraitRef = useRef<HTMLCanvasElement | null>(null);

  const selectedNpc = npcs.find(n => n.id === selectedNpcId) || npcs[0];
  const selectedProfile = npcProfiles.find(p => p.id === selectedNpcId) || npcProfiles[0];

  // Fetch memories for selected NPC
  useEffect(() => {
    if (!selectedNpcId) return;
    setIsLoadingMemories(true);
    fetch(`/api/memories/${selectedNpcId}`)
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || []);
      })
      .catch(err => console.error("Failed to load memories:", err))
      .finally(() => setIsLoadingMemories(false));
  }, [selectedNpcId]);

  // Fetch rumors
  const fetchRumors = () => {
    fetch("/api/rumors")
      .then(res => res.json())
      .then(data => setRumors(data.rumors || []))
      .catch(err => console.error("Failed to load rumors:", err));
  };

  useEffect(() => {
    fetchRumors();
  }, [activeTab]);

  // Render static portrait
  useEffect(() => {
    if (portraitRef.current && selectedNpc) {
      PixelRenderer.renderPortrait(
        portraitRef.current,
        selectedNpc.id,
        "warm",
        selectedNpc.hairColor,
        "#ffd59e",
        selectedNpc.color,
        false,
        0
      );
    }
  }, [selectedNpc, activeTab]);

  const handleTriggerEncounter = async (idA: string, idB: string, loc: string) => {
    audioEngine.playUIClick();
    setIsSimulating(true);
    try {
      await onSimulateMeeting(idA, idB, loc);
      fetchRumors();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#fcf8e3] border-[6px] border-[#4a2e19] rounded-[32px] shadow-[0_12px_0_rgba(74,46,25,0.25)] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d351d] border-b-4 border-[#14180d] text-[#fefae0]">
          <div className="flex items-center gap-3">
            <Book className="w-5 h-5 text-[#ffd180]" />
            <h2 className="text-xl font-bold tracking-wide font-serif italic text-[#fefae0]">
              Evergreen Village Journal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center bg-[#14180d] p-1 rounded-xl border border-[#3e492c]">
              <button
                onClick={() => {
                  audioEngine.playUIClick();
                  setActiveTab("roster");
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "roster"
                    ? "bg-[#e9edc9] text-[#4a2e19] shadow-xs"
                    : "text-[#a3b18a] hover:text-[#fefae0]"
                }`}
              >
                Villager Profiles
              </button>
              <button
                onClick={() => {
                  audioEngine.playUIClick();
                  setActiveTab("rumors");
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "rumors"
                    ? "bg-[#e9edc9] text-[#4a2e19] shadow-xs"
                    : "text-[#a3b18a] hover:text-[#fefae0]"
                }`}
              >
                Village Rumors
              </button>
              <button
                onClick={() => {
                  audioEngine.playUIClick();
                  setActiveTab("matrix");
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "matrix"
                    ? "bg-[#e9edc9] text-[#4a2e19] shadow-xs"
                    : "text-[#a3b18a] hover:text-[#fefae0]"
                }`}
              >
                Social Network
              </button>
              <button
                onClick={() => {
                  audioEngine.playUIClick();
                  setActiveTab("skills");
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "skills"
                    ? "bg-[#e9edc9] text-[#4a2e19] shadow-xs"
                    : "text-[#a3b18a] hover:text-[#fefae0]"
                }`}
              >
                Valley Skills
              </button>
            </div>

            <button
              onClick={() => {
                audioEngine.playUIClick();
                onClose();
              }}
              className="p-1 text-[#a3b18a] hover:text-[#fefae0] hover:bg-[#14180d] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "roster" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* NPC Selector Column */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-[#a3b18a] uppercase tracking-widest px-1">
                  Villagers of Evergreen
                </span>
                {npcs.map(n => (
                  <button
                    key={n.id}
                    onClick={() => {
                      audioEngine.playUIClick();
                      setSelectedNpcId(n.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                      selectedNpcId === n.id
                        ? "bg-[#e9edc9] border-[#4a2e19] shadow-md -translate-y-0.5"
                        : "bg-[#fefae0] hover:bg-[#e9edc9]/50 border-[#4a2e19]/20"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm font-serif italic text-[#4a2e19]">{n.name}</p>
                      <p className="text-xs text-[#5d4037] font-medium">{n.title}</p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-[#f27d26]">
                      ♥ {n.hearts}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected NPC Detailed Profile */}
              <div className="md:col-span-2 flex flex-col gap-5">
                {/* Bio Top Box */}
                <div className="p-5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-sm flex flex-col sm:flex-row gap-4 items-start">
                  <div className="shrink-0 p-1.5 bg-[#e9edc9] rounded-2xl border-2 border-[#4a2e19]">
                    <canvas
                      ref={portraitRef}
                      width={128}
                      height={128}
                      className="w-24 h-24 rounded-xl block pixelated bg-[#2d351d]"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold font-serif italic text-[#4a2e19]">
                        {selectedProfile?.name || selectedNpc?.name}
                      </h3>
                      <span className="text-xs font-bold px-3 py-0.5 bg-[#4a2e19] text-[#fefae0] rounded-full">
                        {selectedNpc?.trustLevel || "Acquaintance"}
                      </span>
                    </div>
                    <p className="text-xs text-[#2d5a27] font-bold mb-2">
                      {selectedProfile?.title}
                    </p>
                    
                    {/* Gated Backstory & Knowledge */}
                    <div className="text-xs text-[#5d4037] leading-relaxed font-medium">
                      {(selectedNpc?.hearts || 0) >= 2 ? (
                        <p>{selectedProfile?.background || selectedProfile?.personality}</p>
                      ) : (selectedNpc?.hearts || 0) >= 1 ? (
                        <p>{selectedProfile?.personality || "A friendly valley resident with a warm disposition."}</p>
                      ) : (
                        <p className="italic text-[#8d6e63]">
                          "You haven't conversed enough with {selectedNpc?.name || 'this villager'} yet. Speak with them or give gifts to uncover their personality and history."
                        </p>
                      )}
                    </div>

                    {/* Affinity Progress Bar */}
                    <div className="mt-3.5">
                      <div className="flex justify-between text-[11px] font-bold text-[#4a2e19] mb-1">
                        <span>Friendship Affinity ({selectedNpc?.hearts || 0} ♥)</span>
                        <span>{selectedNpc?.friendshipPoints || 0} / 100 pts</span>
                      </div>
                      <div className="w-full h-3 bg-[#ccd5ae] rounded-full overflow-hidden border border-[#4a2e19]/40">
                        <div
                          className="h-full bg-[#f27d26] transition-all rounded-full"
                          style={{ width: `${Math.min(100, Math.max(8, selectedNpc?.friendshipPoints || 8))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progressive Gift Preferences */}
                <div className="p-4 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-[10px] font-bold text-[#a3b18a] uppercase tracking-widest flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#f27d26]" />
                      Gift & Taste Preferences
                    </h4>
                    <span className="text-[10px] font-bold text-[#f27d26] bg-[#e9edc9] px-2 py-0.5 rounded-md border border-[#a3b18a]">
                      {(selectedNpc?.hearts || 0) >= 3 ? "Fully Discovered (3/3)" : (selectedNpc?.hearts || 0) >= 2 ? "Partially Known (2/3)" : (selectedNpc?.hearts || 0) >= 1 ? "Basics Known (1/3)" : "Undiscovered (0/3)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* Favorite Gift (Unlocked at Heart 3) */}
                    <div className={`p-2.5 rounded-xl border transition-all ${(selectedNpc?.hearts || 0) >= 3 ? "bg-[#fff9c4] border-[#fbc02d] text-[#e65100]" : "bg-[#f5ebe0] border-[#d5bdaf] text-[#8d6e63]"}`}>
                      <span className="font-bold block text-[11px] mb-0.5">★ Favorite Gift:</span>
                      {(selectedNpc?.hearts || 0) >= 3 ? (
                        <span className="font-bold text-[#bf360c]">{selectedProfile?.favoriteGift}</span>
                      ) : (
                        <span className="italic text-[11px]">??? (Reach 3 ♥ to unlock)</span>
                      )}
                    </div>

                    {/* General Likes (Unlocked at Heart 2) */}
                    <div className={`p-2.5 rounded-xl border transition-all ${(selectedNpc?.hearts || 0) >= 2 ? "bg-[#e9edc9] border-[#a3b18a] text-[#1b5e20]" : "bg-[#f5ebe0] border-[#d5bdaf] text-[#8d6e63]"}`}>
                      <span className="font-bold block text-[11px] mb-0.5">♥ Likes:</span>
                      {(selectedNpc?.hearts || 0) >= 2 ? (
                        <span className="font-medium">{selectedProfile?.likes?.join(", ")}</span>
                      ) : (selectedNpc?.hearts || 0) >= 1 ? (
                        <span className="font-medium">{selectedProfile?.likes?.[0] || "Natural produce"}, ???</span>
                      ) : (
                        <span className="italic text-[11px]">??? (Reach 1-2 ♥ to unlock)</span>
                      )}
                    </div>

                    {/* Dislikes (Unlocked at Heart 1) */}
                    <div className={`p-2.5 rounded-xl border transition-all ${(selectedNpc?.hearts || 0) >= 1 ? "bg-[#ffebee] border-[#ffcdd2] text-[#c62828]" : "bg-[#f5ebe0] border-[#d5bdaf] text-[#8d6e63]"}`}>
                      <span className="font-bold block text-[11px] mb-0.5">✖ Dislikes:</span>
                      {(selectedNpc?.hearts || 0) >= 1 ? (
                        <span className="font-medium">{selectedProfile?.dislikes?.join(", ")}</span>
                      ) : (
                        <span className="italic text-[11px]">??? (Reach 1 ♥ to unlock)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progressive Storyline Secrets & Lore */}
                <div className="p-4 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-sm">
                  <h4 className="text-[10px] font-bold text-[#a3b18a] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#f27d26]" />
                    Storyline Insights & Secrets
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-[#e9edc9]/50 rounded-xl border border-[#4a2e19]/20 flex items-start gap-2">
                      <span className="font-bold text-[#2d5a27] shrink-0">1 ♥ Story:</span>
                      <span>
                        {(selectedNpc?.hearts || 0) >= 1
                          ? `Initial trust established. ${selectedNpc?.name} frequently visits ${selectedNpc?.currentLocationName || 'the valley center'}.`
                          : "Locked. Talk to this villager to record your first impressions."}
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#e9edc9]/50 rounded-xl border border-[#4a2e19]/20 flex items-start gap-2">
                      <span className="font-bold text-[#2d5a27] shrink-0">2 ♥ Secrets:</span>
                      <span>
                        {(selectedNpc?.hearts || 0) >= 2
                          ? selectedProfile?.knowledge?.[0] || `${selectedNpc?.name} shared insights about valley traditions and daily routines.`
                          : "Locked. Reach 2 friendship hearts to discover personal secrets."}
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#e9edc9]/50 rounded-xl border border-[#4a2e19]/20 flex items-start gap-2">
                      <span className="font-bold text-[#2d5a27] shrink-0">3+ ♥ Lore:</span>
                      <span>
                        {(selectedNpc?.hearts || 0) >= 3
                          ? selectedProfile?.knowledge?.[1] || `${selectedNpc?.name} considers you a cherished confidant and shares deep valley lore.`
                          : "Locked. Reach 3 friendship hearts to unlock deep confidant lore."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Episodic Memories */}
                <div className="p-4 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-sm">
                  <h4 className="text-[10px] font-bold text-[#a3b18a] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#f27d26]" />
                    Recorded Memories & Interactions
                  </h4>

                  {isLoadingMemories ? (
                    <p className="text-xs text-[#5d4037]">Loading memories...</p>
                  ) : memories.length === 0 ? (
                    <p className="text-xs text-[#5d4037]">No shared conversations recorded yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {memories.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#e9edc9]/50 rounded-xl border border-[#4a2e19]/20 text-xs text-[#4a2e19]"
                        >
                          <div className="flex justify-between font-bold text-[10px] text-[#2d5a27] mb-0.5">
                            <span>{m.timestamp}</span>
                            <span className="capitalize text-[#f27d26]">
                              {m.emotion} ({m.sentimentDelta >= 0 ? `+${m.sentimentDelta}` : m.sentimentDelta})
                            </span>
                          </div>
                          <p className="font-medium text-[#5d4037]">{m.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Village Rumors */}
          {activeTab === "rumors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg font-serif italic text-[#4a2e19]">Active Village Rumors</h3>
                  <p className="text-xs text-[#5d4037] font-medium">
                    Conversations and insights propagated organically between Evergreen residents.
                  </p>
                </div>
                <button
                  onClick={fetchRumors}
                  className="px-3.5 py-2 bg-[#e9edc9] hover:bg-[#ccd5ae] active:translate-y-0.5 text-[#4a2e19] text-xs font-bold rounded-xl border-b-3 border-r-3 border-[#4a2e19] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#f27d26]" />
                  Refresh
                </button>
              </div>

              {/* Rumors list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {rumors.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl shadow-sm text-xs text-[#4a2e19]"
                  >
                    <div className="flex justify-between items-center font-bold text-[11px] text-[#f27d26] mb-1">
                      <span className="capitalize">Topic: {r.topic}</span>
                      <span className="text-[#a3b18a]">{r.gameTime}</span>
                    </div>
                    <p className="leading-relaxed text-[#5d4037] font-medium">{r.content}</p>
                  </div>
                ))}
              </div>

              {/* Trigger Instant Villager Encounter */}
              <div className="p-5 bg-[#e9edc9] border-2 border-[#4a2e19] rounded-2xl shadow-sm">
                <h4 className="font-bold text-xs text-[#4a2e19] uppercase tracking-wider mb-1.5">
                  Simulate Social Encounter
                </h4>
                <p className="text-xs text-[#5d4037] mb-3.5 font-medium">
                  Prompt two villagers to meet at a location and exchange insights using Gemini server-side AI.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleTriggerEncounter("maya", "isla", "Tiki Beach Bar")}
                    disabled={isSimulating}
                    className="px-3.5 py-2 bg-[#00838f] hover:bg-[#006064] text-[#fefae0] text-xs font-bold rounded-xl border-b-3 border-r-3 border-[#004d40] cursor-pointer disabled:opacity-50 active:translate-y-0.5 shadow-xs"
                  >
                    Maya & Isla (Tiki Luau & Smoothies)
                  </button>
                  <button
                    onClick={() => handleTriggerEncounter("kai", "marina", "Sunset Beach Pier")}
                    disabled={isSimulating}
                    className="px-3.5 py-2 bg-[#0277bd] hover:bg-[#01579b] text-[#fefae0] text-xs font-bold rounded-xl border-b-3 border-r-3 border-[#002f6c] cursor-pointer disabled:opacity-50 active:translate-y-0.5 shadow-xs"
                  >
                    Kai & Marina (Surf & Pearl Diving)
                  </button>
                  <button
                    onClick={() => handleTriggerEncounter("mira", "silas", "Apothecary Clinic")}
                    disabled={isSimulating}
                    className="px-3.5 py-2 bg-[#2d5a27] hover:bg-[#1b3d17] text-[#fefae0] text-xs font-bold rounded-xl border-b-3 border-r-3 border-[#14180d] cursor-pointer disabled:opacity-50 active:translate-y-0.5 shadow-xs"
                  >
                    Mira & Silas (Herbal Research)
                  </button>
                  <button
                    onClick={() => handleTriggerEncounter("rowan", "elara", "Sleeping Fox Tavern")}
                    disabled={isSimulating}
                    className="px-3.5 py-2 bg-[#4a2e19] hover:bg-[#3e2723] text-[#fefae0] text-xs font-bold rounded-xl border-b-3 border-r-3 border-[#21100b] cursor-pointer disabled:opacity-50 active:translate-y-0.5 shadow-xs"
                  >
                    Rowan & Elara (Trade & Tales)
                  </button>
                  <button
                    onClick={() => handleTriggerEncounter("finn", "cora", "Town Hall")}
                    disabled={isSimulating}
                    className="px-3.5 py-2 bg-[#f27d26] hover:bg-[#d86616] text-white text-xs font-bold rounded-xl border-b-3 border-r-3 border-[#4a2e19] cursor-pointer disabled:opacity-50 active:translate-y-0.5 shadow-xs"
                  >
                    Finn & Mayor Cora (Village Projects)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Social Network Matrix */}
          {activeTab === "matrix" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-serif italic text-[#4a2e19]">Inter-Villager Relationship Matrix</h3>
              <p className="text-xs text-[#5d4037] font-medium">
                How Evergreen's inhabitants view and interact with one another.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {npcProfiles.map(p => (
                  <div
                    key={p.id}
                    className="p-4 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl shadow-sm"
                  >
                    <h4 className="font-bold text-sm font-serif italic text-[#4a2e19] mb-2">
                       {p.name} ({p.title})
                    </h4>
                    <div className="space-y-2 text-xs text-[#5d4037]">
                      {Object.entries(p.relationships || {}).map(([targetId, desc]: any) => {
                        const targetNpc = npcProfiles.find(n => n.id === targetId);
                        return (
                          <div key={targetId} className="flex gap-2">
                            <span className="font-bold text-[#f27d26] min-w-[70px]">
                              → {targetNpc?.name || targetId}:
                            </span>
                            <span className="flex-1 font-medium">{desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg font-serif italic text-[#4a2e19]">Valley Masteries & Skills</h3>
                  <p className="text-xs text-[#5d4037] font-medium">
                    Level up your proficiency by farming, foraging, fishing, and befriending townsfolk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Farming Skill Card */}
                <div className="p-5 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#a3b18a]/30 border border-[#a3b18a] flex items-center justify-center text-[#2d351d]">
                        <Sprout className="w-5 h-5 text-[#2d351d]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#4a2e19]">Farming Mastery</h4>
                        <p className="text-[11px] text-[#5d4037]">Tilling, watering, planting & harvesting</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#2d351d] text-[#ffd180] font-bold text-xs rounded-lg">
                      Level {skills?.farming?.level || 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#5d4037]">
                      <span>Progress to Next Level</span>
                      <span>{skills?.farming?.currentXp || 0} / {skills?.farming?.nextLevelXp || 100} XP</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#4a2e19]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#81c784] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, ((skills?.farming?.currentXp || 0) / (skills?.farming?.nextLevelXp || 100)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#2d351d] bg-[#e9edc9]/60 p-2.5 rounded-xl border border-[#a3b18a]/40 font-medium">
                    ⭐ <span className="font-bold">Active Bonus:</span> +10% crop harvest yield & reduced hoe energy cost.
                  </div>
                </div>

                {/* Foraging Skill Card */}
                <div className="p-5 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ffd180]/30 border border-[#f27d26] flex items-center justify-center text-[#f27d26]">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#4a2e19]">Foraging Mastery</h4>
                        <p className="text-[11px] text-[#5d4037]">Gathering wild berries, herbs & mushrooms</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#2d351d] text-[#ffd180] font-bold text-xs rounded-lg">
                      Level {skills?.foraging?.level || 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#5d4037]">
                      <span>Progress to Next Level</span>
                      <span>{skills?.foraging?.currentXp || 0} / {skills?.foraging?.nextLevelXp || 100} XP</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#4a2e19]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f27d26] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, ((skills?.foraging?.currentXp || 0) / (skills?.foraging?.nextLevelXp || 100)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#2d351d] bg-[#e9edc9]/60 p-2.5 rounded-xl border border-[#a3b18a]/40 font-medium">
                    ⭐ <span className="font-bold">Active Bonus:</span> +5 Max Daily Energy & enhanced wild node yields.
                  </div>
                </div>

                {/* Fishing Skill Card */}
                <div className="p-5 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-400 flex items-center justify-center text-blue-700">
                        <Fish className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#4a2e19]">Fishing Mastery</h4>
                        <p className="text-[11px] text-[#5d4037]">Reeling in trout, bass & ancient carps</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#2d351d] text-[#ffd180] font-bold text-xs rounded-lg">
                      Level {skills?.fishing?.level || 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#5d4037]">
                      <span>Progress to Next Level</span>
                      <span>{skills?.fishing?.currentXp || 0} / {skills?.fishing?.nextLevelXp || 100} XP</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#4a2e19]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, ((skills?.fishing?.currentXp || 0) / (skills?.fishing?.nextLevelXp || 100)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#2d351d] bg-[#e9edc9]/60 p-2.5 rounded-xl border border-[#a3b18a]/40 font-medium">
                    ⭐ <span className="font-bold">Active Bonus:</span> Fish bite 20% faster at Whispering Lake.
                  </div>
                </div>

                {/* Social Skill Card */}
                <div className="p-5 bg-[#fefae0] border-2 border-[#4a2e19]/30 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-100 border border-pink-400 flex items-center justify-center text-pink-700">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#4a2e19]">Social & Kinship</h4>
                        <p className="text-[11px] text-[#5d4037]">Befriending villagers, gifting & petting pets</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#2d351d] text-[#ffd180] font-bold text-xs rounded-lg">
                      Level {skills?.social?.level || 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#5d4037]">
                      <span>Progress to Next Level</span>
                      <span>{skills?.social?.currentXp || 0} / {skills?.social?.nextLevelXp || 100} XP</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#4a2e19]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, ((skills?.social?.currentXp || 0) / (skills?.social?.nextLevelXp || 100)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#2d351d] bg-[#e9edc9]/60 p-2.5 rounded-xl border border-[#a3b18a]/40 font-medium">
                    ⭐ <span className="font-bold">Active Bonus:</span> +25% Friendship points gained from daily conversations.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
