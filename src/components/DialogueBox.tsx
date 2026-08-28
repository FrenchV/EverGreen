import React, { useEffect, useRef, useState } from "react";
import { PixelRenderer } from "../engine/pixelRenderer";
import { audioEngine } from "../engine/audioEngine";
import { Item, NPCState } from "../types";
import { ItemIcon } from "./ItemIcon";
import { Send, Gift, MessageCircle, Sparkles, X, ChevronRight, BookOpen, Smile } from "lucide-react";

interface DialogueBoxProps {
  npc: NPCState;
  npcData?: any;
  inventory: Array<{ item: Item; quantity: number }>;
  onSendMessage: (text: string, giftItem?: string) => Promise<{
    reply: string;
    emotion: string;
    sentimentDelta: number;
    rumorOrHint?: string;
  }>;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  npc,
  npcData,
  inventory,
  onSendMessage,
  onClose
}) => {
  const portraitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [fullMessage, setFullMessage] = useState(
    npc.recentDialogue || `Good day! What brings you around ${npc.currentLocationName}?`
  );
  const [currentEmotion, setCurrentEmotion] = useState<any>(npc.currentEmotion || "warm");
  const [isTyping, setIsTyping] = useState(false);
  const [playerInput, setPlayerInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ sender: "player" | "npc"; text: string }>>([
    { sender: "npc", text: fullMessage }
  ]);

  // Animated Portrait Loop (Blinking + Talking mouth)
  useEffect(() => {
    let animId: number;
    let tick = 0;
    let blinkTimer = 0;
    let isBlinking = false;

    const render = () => {
      tick++;
      if (portraitCanvasRef.current) {
        // Blinking logic every ~180 frames (approx 3 seconds)
        blinkTimer++;
        if (blinkTimer > 160 && blinkTimer < 172) {
          isBlinking = true;
        } else if (blinkTimer >= 172) {
          isBlinking = false;
          blinkTimer = 0;
        }

        const talkFrame = isTyping ? Math.floor(tick / 6) : 0;
        PixelRenderer.renderPortrait(
          portraitCanvasRef.current,
          npc.id,
          currentEmotion,
          npc.hairColor,
          "#ffd59e",
          npc.color,
          isBlinking,
          talkFrame,
          tick
        );
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [npc, currentEmotion, isTyping]);

  // Typewriter Text Effect
  useEffect(() => {
    if (!fullMessage) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText("");

    const interval = setInterval(() => {
      if (charIndex < fullMessage.length) {
        setDisplayedText(fullMessage.slice(0, charIndex + 1));
        charIndex++;
        // Audio blip on every 2nd character
        if (charIndex % 2 === 0) {
          const charPitch =
            npc.id === "maya" ? 420 :
            npc.id === "isla" ? 400 :
            npc.id === "marina" ? 440 :
            npc.id === "kai" ? 230 :
            npc.id === "mira" ? 380 :
            npc.id === "cora" ? 340 :
            npc.id === "silas" ? 280 :
            npc.id === "rowan" ? 220 :
            npc.id === "elara" ? 300 : 250;
          audioEngine.playDialogueBlip(charPitch);
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullMessage, npc.id]);

  const handleSend = async (customMessage?: string, giftItem?: string) => {
    const textToSend = customMessage || playerInput.trim();
    if (!textToSend && !giftItem) return;

    audioEngine.playUIClick();
    setIsSending(true);
    setDisplayedText("");
    setIsTyping(false);

    if (giftItem) {
      audioEngine.playGiftFanfare();
    }

    // Add player line to local history
    if (textToSend) {
      setDialogueHistory(prev => [...prev, { sender: "player", text: textToSend }]);
    }

    try {
      const response = await onSendMessage(textToSend || `Here is a gift: ${giftItem}`, giftItem);
      if (response && response.reply) {
        setFullMessage(response.reply);
        setCurrentEmotion(response.emotion || "warm");
        if (response.rumorOrHint) {
          setActiveHint(response.rumorOrHint);
        }
        setDialogueHistory(prev => [...prev, { sender: "npc", text: response.reply }]);
      } else {
        setFullMessage("Hmm, let me think on that...");
      }
      setPlayerInput("");
    } catch (e) {
      console.error("Chat error:", e);
      setFullMessage("The mountain winds are quiet right now... (Connection hiccup)");
    } finally {
      setIsSending(false);
      setShowGiftModal(false);
    }
  };

  const handleSkipTyping = () => {
    if (isTyping && fullMessage) {
      setDisplayedText(fullMessage);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Dialog Frame */}
      <div className="relative w-full max-w-2xl bg-[#fcf8e3] border-[6px] border-[#4a2e19] rounded-[32px] shadow-[0_12px_0_rgba(74,46,25,0.25)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#2d351d] border-b-4 border-[#14180d] text-[#fefae0]">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#f27d26] shadow-[0_0_8px_rgba(242,125,38,0.6)]" />
            <div>
              <h2 className="text-xl font-bold tracking-wide font-serif italic text-[#fefae0] flex items-center gap-2">
                {npc.name}
                <span className="text-[11px] font-sans font-semibold text-[#a3b18a] px-2 py-0.5 bg-[#14180d] rounded-md border border-[#3e492c]">
                  {npc.title}
                </span>
              </h2>
            </div>
          </div>

          {/* Hearts & Trust Level */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#14180d] rounded-xl border border-[#3e492c]">
              <span className="text-[11px] font-bold text-[#a3b18a] uppercase tracking-wider">Affinity:</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm leading-none transition-transform ${
                      i < npc.hearts ? "text-[#f27d26] scale-110" : "text-[#556b2f]/40"
                    }`}
                  >
                    ♥
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-[#ffd180] ml-1">
                {npc.trustLevel}
              </span>
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

        {/* Main Conversation Body */}
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
          {/* Animated Pixel Portrait */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative p-1.5 bg-[#e9edc9] rounded-2xl shadow-inner border-4 border-[#4a2e19]">
              <canvas
                ref={portraitCanvasRef}
                width={128}
                height={128}
                className="w-32 h-32 rounded-xl block pixelated bg-[#2d351d]"
              />
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#4a2e19] text-[#fefae0] text-[10px] font-bold uppercase rounded-full shadow border border-[#2b1b0f]">
                {currentEmotion}
              </div>
            </div>

            <div className="mt-3.5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#a3b18a] font-bold block">Location</span>
              <p className="text-xs font-bold text-[#4a2e19]">{npc.currentLocationName}</p>
            </div>
          </div>

          {/* Dialogue Speech Box */}
          <div className="flex-1 flex flex-col justify-between min-h-[170px] w-full">
            <div
              onClick={handleSkipTyping}
              className={`relative p-5 bg-[#fefae0] rounded-2xl border-2 border-[#4a2e19]/30 shadow-inner text-[#5d4037] text-base leading-relaxed font-serif ${
                isTyping ? "cursor-pointer" : ""
              }`}
              title={isTyping ? "Click to reveal full text" : ""}
            >
              {isSending ? (
                <div className="min-h-[64px] flex items-center gap-2 text-[#8d6e63] italic text-sm">
                  <div className="w-4 h-4 border-2 border-[#f27d26] border-t-transparent rounded-full animate-spin" />
                  <span>{npc.name} is thinking...</span>
                </div>
              ) : (
                <p className="min-h-[64px]">{displayedText || "..."}</p>
              )}
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-[#4a2e19] ml-1 animate-pulse" />
              )}

              {/* Hint / Lore Ribbon */}
              {activeHint && !isTyping && !isSending && (
                <div className="mt-3 p-2.5 bg-[#e9edc9] border border-[#a3b18a] rounded-xl flex items-start gap-2 text-xs text-[#2d5a27] font-sans font-semibold animate-fade-in">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#f27d26] mt-0.5" />
                  <span>{activeHint}</span>
                </div>
              )}
            </div>

            {/* Quick Topic Prompts */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              <button
                onClick={() => handleSend("What are you working on today?")}
                disabled={isTyping || isSending}
                className="px-3 py-1.5 bg-[#e9edc9] hover:bg-[#ccd5ae] active:translate-y-0.5 text-[#4a2e19] text-xs font-bold rounded-xl border-b-2 border-r-2 border-[#4a2e19] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#4a2e19]" />
                Daily Schedule
              </button>

              <button
                onClick={() => handleSend("Tell me about the beach and ocean waves around here!")}
                disabled={isTyping || isSending}
                className="px-3 py-1.5 bg-[#e9edc9] hover:bg-[#ccd5ae] active:translate-y-0.5 text-[#4a2e19] text-xs font-bold rounded-xl border-b-2 border-r-2 border-[#4a2e19] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00838f]" />
                Beach & Waves
              </button>

              <button
                onClick={() => handleSend("I really love your style and hair today!")}
                disabled={isTyping || isSending}
                className="px-3 py-1.5 bg-[#e9edc9] hover:bg-[#ccd5ae] active:translate-y-0.5 text-[#4a2e19] text-xs font-bold rounded-xl border-b-2 border-r-2 border-[#4a2e19] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Smile className="w-3.5 h-3.5 text-[#e91e63]" />
                Compliment Look
              </button>

              <button
                onClick={() => handleSend("Have you heard any interesting village news or rumors lately?")}
                disabled={isTyping || isSending}
                className="px-3 py-1.5 bg-[#e9edc9] hover:bg-[#ccd5ae] active:translate-y-0.5 text-[#4a2e19] text-xs font-bold rounded-xl border-b-2 border-r-2 border-[#4a2e19] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#4a2e19]" />
                Village Rumors
              </button>

              <button
                onClick={() => setShowGiftModal(true)}
                disabled={isTyping || isSending}
                className="px-3 py-1.5 bg-[#ffd180] hover:bg-[#ffb74d] active:translate-y-0.5 text-[#4a2e19] text-xs font-bold rounded-xl border-b-2 border-r-2 border-[#4a2e19] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Gift className="w-3.5 h-3.5 text-[#f27d26]" />
                Give Gift
              </button>
            </div>
          </div>
        </div>

        {/* Freeform Text Chat Input */}
        <div className="p-4 bg-[#2d351d] border-t-4 border-[#14180d]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={playerInput}
              onChange={e => setPlayerInput(e.target.value)}
              placeholder={`Say something to ${npc.name} in natural language...`}
              disabled={isSending}
              className="flex-1 px-4 py-2.5 bg-[#fefae0] border-2 border-[#4a2e19] rounded-xl text-sm text-[#4a2e19] font-medium placeholder-[#5d4037]/60 focus:outline-none focus:border-[#f27d26] focus:ring-2 focus:ring-[#f27d26]/40 shadow-inner"
            />

            <button
              type="submit"
              disabled={!playerInput.trim() || isSending}
              className="px-5 py-2.5 bg-[#4a2e19] hover:bg-[#3e2723] active:translate-y-0.5 text-[#fefae0] font-bold text-sm rounded-xl border-b-3 border-r-3 border-[#21100b] shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-[#ffd180]" />
              )}
              <span>Speak</span>
              <span className="text-[10px] bg-[#6d4c41] text-[#fefae0] px-1.5 py-0.5 rounded font-mono font-normal">
                Gemini
              </span>
            </button>
          </form>
        </div>

        {/* Gift Giving Popup Modal */}
        {showGiftModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-30">
            <div className="w-full max-w-md bg-[#fcf8e3] border-4 border-[#4a2e19] rounded-[24px] p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-[#ccd5ae]">
                <h3 className="font-bold text-base font-serif italic text-[#4a2e19] flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#f27d26]" />
                  Offer a Gift to {npc.name}
                </h3>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="text-[#5d4037] hover:text-[#4a2e19] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inventory.length === 0 ? (
                <div className="py-8 text-center text-[#5d4037] text-sm">
                  Your bag is empty! Forage starflowers, mint, or timber around the village first.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {inventory.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(`Here, I brought you a ${slot.item.name}!`, slot.item.name)}
                      className="p-3 bg-[#e9edc9] hover:bg-[#ccd5ae] border-2 border-[#4a2e19] rounded-xl flex items-center gap-3 text-left transition-all cursor-pointer group shadow-xs active:translate-y-0.5"
                    >
                      <div className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-[#fefae0] border border-[#4a2e19]/30 shadow-inner">
                        <ItemIcon item={slot.item} size="md" />
                        <span className="absolute -bottom-1 -right-1 bg-[#4a2e19] text-[#fefae0] text-[9px] font-bold px-1 rounded-full">
                          x{slot.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#4a2e19] truncate group-hover:text-[#2d5a27]">
                          {slot.item.name}
                        </p>
                        <p className="text-[10px] text-[#5d4037] capitalize truncate font-semibold">
                          {slot.item.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
