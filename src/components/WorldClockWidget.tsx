import React from "react";
import { Sun, CloudRain, Moon, Wind, Clock, FastForward, Play, Pause } from "lucide-react";
import { SeasonType, WeatherType } from "../types";
import { audioEngine } from "../engine/audioEngine";

interface WorldClockWidgetProps {
  day: number;
  season: SeasonType;
  gameTimeMinutes: number; // 0 to 1440
  weather: WeatherType;
  isPaused: boolean;
  onTogglePause: () => void;
  onSkipTime: (minutesToAdd: number) => void;
  onSetTime: (targetMinutes: number) => void;
}

export const WorldClockWidget: React.FC<WorldClockWidgetProps> = ({
  day,
  season,
  gameTimeMinutes,
  weather,
  isPaused,
  onTogglePause,
  onSkipTime,
  onSetTime
}) => {
  const hours = Math.floor(gameTimeMinutes / 60);
  const minutes = Math.floor(gameTimeMinutes % 60);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeString = `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;

  const getWeatherIcon = () => {
    switch (weather) {
      case "Light Rain":
        return <CloudRain className="w-4 h-4 text-[#a3b18a]" />;
      case "Starry Twilight":
        return <Moon className="w-4 h-4 text-[#ffd180]" />;
      case "Gentle Breeze":
        return <Wind className="w-4 h-4 text-[#ccd5ae]" />;
      default:
        return <Sun className="w-4 h-4 text-[#f27d26]" />;
    }
  };

  const getTimePhase = () => {
    if (gameTimeMinutes >= 360 && gameTimeMinutes < 720) return "Morning";
    if (gameTimeMinutes >= 720 && gameTimeMinutes < 1020) return "Afternoon";
    if (gameTimeMinutes >= 1020 && gameTimeMinutes < 1200) return "Sunset";
    return "Night";
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 bg-[#252525]/95 border-2 border-[#111] rounded-sm text-[#e0e0e0] font-mono shadow-[inset_-2px_-2px_0px_#111,inset_2px_2px_0px_#444] backdrop-blur-md min-w-[200px]">
      {/* Top Header: Day, Season & Weather */}
      <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-[#3a3a3a]">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-[#a0a0a0] font-bold">
            {season} • Day {day}
          </span>
          <span className="text-sm text-[#ffd54f] font-bold tracking-tight">
            Year 1
          </span>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1a1a1a] rounded-sm text-[11px] font-bold border border-[#111] text-[#e0e0e0] shadow-[inset_1px_1px_0px_#0a0a0a]">
          {getWeatherIcon()}
          <span>{weather}</span>
        </div>
      </div>

      {/* Main Clock Face */}
      <div className="flex items-center justify-between py-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-black tracking-wider text-[#f5f5f5] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {timeString}
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#383838] rounded-sm text-[#ffd54f] border border-[#222] shadow-[inset_1px_1px_0px_#4f4f4f]">
          {getTimePhase()}
        </span>
      </div>

      {/* Time Controls Bar */}
      <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[#3a3a3a] text-[10px]">
        <button
          onClick={() => {
            audioEngine.playUIClick();
            onTogglePause();
          }}
          className="px-2 py-1 bg-[#333] hover:bg-[#444] active:translate-y-0.5 text-[#f5f5f5] rounded-sm border border-[#111] flex items-center gap-1 transition-transform cursor-pointer font-bold shadow-[inset_-1px_-1px_0px_#111,inset_1px_1px_0px_#555]"
          title={isPaused ? "Resume Time" : "Pause Time"}
        >
          {isPaused ? <Play className="w-3 h-3 text-[#81c784]" /> : <Pause className="w-3 h-3 text-[#ff8a65]" />}
          <span>{isPaused ? "Play" : "Pause"}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              audioEngine.playUIClick();
              onSkipTime(60);
            }}
            className="px-2 py-1 bg-[#333] hover:bg-[#444] active:translate-y-0.5 text-[#ffd54f] rounded-sm border border-[#111] flex items-center gap-0.5 transition-transform cursor-pointer font-bold shadow-[inset_-1px_-1px_0px_#111,inset_1px_1px_0px_#555]"
            title="Advance 1 Hour"
          >
            <FastForward className="w-3 h-3 text-[#ffd54f]" />
            +1h
          </button>

          <button
            onClick={() => {
              audioEngine.playUIClick();
              onSetTime(720); // Noon
            }}
            className="px-1.5 py-1 bg-[#333] hover:bg-[#444] text-[#e0e0e0] rounded-sm border border-[#111] font-bold cursor-pointer transition-colors shadow-[inset_-1px_-1px_0px_#111,inset_1px_1px_0px_#555]"
          >
            Noon
          </button>

          <button
            onClick={() => {
              audioEngine.playUIClick();
              onSetTime(1140); // 7 PM Evening
            }}
            className="px-1.5 py-1 bg-[#333] hover:bg-[#444] text-[#e0e0e0] rounded-sm border border-[#111] font-bold cursor-pointer transition-colors shadow-[inset_-1px_-1px_0px_#111,inset_1px_1px_0px_#555]"
          >
            Dusk
          </button>
        </div>
      </div>
    </div>
  );
};
