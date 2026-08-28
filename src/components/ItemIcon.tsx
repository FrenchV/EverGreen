import React from "react";
import { Item } from "../types";

interface ItemIconProps {
  item: Item;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ item, size = "md", className = "" }) => {
  const pixelSize = size === "sm" ? 20 : size === "md" ? 28 : size === "lg" ? 36 : 48;

  const renderGraphic = () => {
    switch (item.iconType) {
      case "hoe":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Wooden Handle */}
            <line x1="5" y1="19" x2="16" y2="8" stroke="#8d6e63" strokeWidth="2.5" strokeLinecap="round" />
            {/* Iron Hoe Blade */}
            <path d="M14 6 L19 5 L20 10 L16 11 Z" fill="#78909c" stroke="#37474f" strokeWidth="1" />
            <line x1="17" y1="6" x2="19" y2="9" stroke="#cfd8dc" strokeWidth="1" />
          </svg>
        );

      case "watering_can":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Can Body */}
            <rect x="7" y="10" width="10" height="9" rx="2" fill="#0288d1" stroke="#01579b" strokeWidth="1.2" />
            {/* Spout */}
            <path d="M17 12 L22 8 L21 7 L16 10 Z" fill="#29b6f6" stroke="#01579b" strokeWidth="1" />
            {/* Rose Sprinkler */}
            <circle cx="22" cy="7" r="1.8" fill="#e1f5fe" />
            {/* Handle */}
            <path d="M7 11 C4 11, 4 17, 7 17" fill="none" stroke="#01579b" strokeWidth="1.5" strokeLinecap="round" />
            {/* Water Drop Highlight */}
            <circle cx="10" cy="14" r="1.2" fill="#b3e5fc" />
          </svg>
        );

      case "fishing_rod":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Bamboo Rod */}
            <line x1="4" y1="20" x2="19" y2="5" stroke="#fbc02d" strokeWidth="2" strokeLinecap="round" />
            {/* Segment Rings */}
            <circle cx="9" cy="15" r="1.2" fill="#f57f17" />
            <circle cx="14" cy="10" r="1.2" fill="#f57f17" />
            {/* Reel */}
            <circle cx="6" cy="18" r="2.2" fill="#78909c" stroke="#37474f" strokeWidth="1" />
            {/* Line & Hook */}
            <path d="M19 5 L21 14 L20 16" fill="none" stroke="#e0e0e0" strokeWidth="1" />
            <path d="M20 16 C19 18, 22 18, 21 16" fill="none" stroke="#ffd54f" strokeWidth="1.2" />
          </svg>
        );

      case "seed":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Seed Bag Pouch */}
            <path d="M6 10 C6 7, 18 7, 18 10 L19 19 C19 21, 5 21, 5 19 Z" fill="#d7ccc8" stroke="#5d4037" strokeWidth="1.2" />
            {/* Tie Ribbon */}
            <rect x="8" y="8" width="8" height="2" rx="1" fill={item.color} />
            {/* Sprout Icon */}
            <path d="M12 16 L12 12 M12 13 C10 11, 10 13, 12 13 M12 12 C14 10, 14 12, 12 12" fill="none" stroke={item.color} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        );

      case "strawberry":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Berry Body */}
            <path d="M12 20 C6 15, 6 10, 10 8 C12 8, 12 8, 14 8 C18 10, 18 15, 12 20 Z" fill="#e53935" stroke="#b71c1c" strokeWidth="1" />
            {/* Seeds */}
            <circle cx="10" cy="12" r="0.8" fill="#fff9c4" />
            <circle cx="14" cy="12" r="0.8" fill="#fff9c4" />
            <circle cx="12" cy="15" r="0.8" fill="#fff9c4" />
            <circle cx="11" cy="17" r="0.7" fill="#fff9c4" />
            {/* Green Calyx Leaf */}
            <path d="M9 8 C11 5, 13 5, 15 8 L12 6 Z" fill="#43a047" />
          </svg>
        );

      case "wheat":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Wheat Stalk */}
            <line x1="12" y1="21" x2="12" y2="7" stroke="#fbc02d" strokeWidth="2" />
            {/* Grains */}
            <ellipse cx="10" cy="8" rx="2.5" ry="1.5" fill="#ffd54f" transform="rotate(-30 10 8)" />
            <ellipse cx="14" cy="8" rx="2.5" ry="1.5" fill="#ffd54f" transform="rotate(30 14 8)" />
            <ellipse cx="10" cy="12" rx="2.5" ry="1.5" fill="#ffd54f" transform="rotate(-30 10 12)" />
            <ellipse cx="14" cy="12" rx="2.5" ry="1.5" fill="#ffd54f" transform="rotate(30 14 12)" />
            <ellipse cx="10" cy="16" rx="2.5" ry="1.5" fill="#ffd54f" transform="rotate(-30 10 16)" />
            <ellipse cx="14" cy="16" rx="2.5" ry="1.5" fill="#ffd54f" transform="rotate(30 14 16)" />
          </svg>
        );

      case "pumpkin":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Pumpkin Lobes */}
            <ellipse cx="12" cy="14" rx="8" ry="6.5" fill="#f57c00" stroke="#e65100" strokeWidth="1" />
            <ellipse cx="12" cy="14" rx="4.5" ry="6.5" fill="#fb8c00" />
            {/* Green Stem */}
            <path d="M12 7 C12 5, 14 5, 14 4" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case "fish":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Fish Body */}
            <path d="M4 12 C8 7, 16 7, 20 12 C16 17, 8 17, 4 12 Z" fill={item.color} stroke="#006064" strokeWidth="1" />
            {/* Tail Fin */}
            <polygon points="4,12 1,8 1,16" fill={item.color} stroke="#006064" strokeWidth="0.8" />
            {/* Eye */}
            <circle cx="16" cy="11" r="1.2" fill="#ffffff" />
            <circle cx="16.5" cy="11" r="0.6" fill="#000000" />
            {/* Scale Shimmer */}
            <path d="M11 10 C12 12, 12 13, 11 14" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          </svg>
        );

      case "starflower":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <g transform="translate(12, 12)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <ellipse key={deg} cx="0" cy="-6" rx="2" ry="4" fill="#64b5f6" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="3.5" fill="#fff59d" stroke="#fbc02d" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
            </g>
          </svg>
        );

      case "glowmoss":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <path d="M5 18 C5 12, 10 9, 13 11 C15 7, 20 10, 19 18 Z" fill="#aed581" stroke="#558b2f" strokeWidth="1" />
            <circle cx="9" cy="14" r="1.5" fill="#e8f5e9" />
            <circle cx="15" cy="12" r="1.2" fill="#e8f5e9" />
            <circle cx="13" cy="16" r="1" fill="#e8f5e9" />
          </svg>
        );

      case "river_mint":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <path d="M6 18 C6 10, 14 7, 18 6 C17 14, 12 18, 6 18 Z" fill="#4db6ac" stroke="#00796b" strokeWidth="1" />
            <line x1="6" y1="18" x2="16" y2="8" stroke="#b2dfdb" strokeWidth="1" />
            <path d="M12 12 L14 14 M10 14 L11 16" stroke="#b2dfdb" strokeWidth="0.8" />
          </svg>
        );

      case "wild_berries":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <circle cx="9" cy="14" r="3.8" fill="#ad1457" />
            <circle cx="15" cy="14" r="3.8" fill="#d81b60" />
            <circle cx="12" cy="9" r="3.8" fill="#e91e63" />
            <circle cx="11" cy="8" r="1.2" fill="#f8bbd0" />
            <path d="M12 6 C12 4, 14 4, 14 3" fill="none" stroke="#2e7d32" strokeWidth="1.5" />
          </svg>
        );

      case "honeycomb":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <polygon points="12,4 17,7 17,13 12,16 7,13 7,7" fill="#ffb300" stroke="#ff8f00" strokeWidth="1" />
            <polygon points="17,11 22,14 22,20 17,23 12,20 12,14" fill="#ffa000" stroke="#ff6f00" strokeWidth="1" />
            <polygon points="7,11 12,14 12,20 7,23 2,20 2,14" fill="#ffc107" stroke="#ffa000" strokeWidth="1" />
            <circle cx="12" cy="10" r="1.2" fill="#fff8e1" />
          </svg>
        );

      case "timber":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <rect x="4" y="8" width="14" height="8" rx="1" fill="#8d6e63" stroke="#4e342e" strokeWidth="1" />
            <ellipse cx="18" cy="12" rx="2.5" ry="4" fill="#bcaaa4" stroke="#4e342e" strokeWidth="1" />
            <circle cx="18" cy="12" r="1.2" fill="#5d4037" />
            <line x1="5" y1="10" x2="16" y2="10" stroke="#5d4037" strokeWidth="0.8" />
          </svg>
        );

      case "iron_ore":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <polygon points="12,4 19,8 21,15 14,20 6,18 4,10" fill="#78909c" stroke="#37474f" strokeWidth="1" />
            <polygon points="12,4 15,11 8,11" fill="#90a4ae" />
            <polygon points="15,11 21,15 14,20" fill="#607d8b" />
            <circle cx="10" cy="8" r="1" fill="#cfd8dc" />
          </svg>
        );

      case "ancient_coin":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <circle cx="12" cy="12" r="8.5" fill="#ffd54f" stroke="#f57f17" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke="#f57f17" strokeWidth="0.8" strokeDasharray="2 1" />
            <polygon points="12,8 14,14 9,10 15,10 10,14" fill="#ff6f00" />
          </svg>
        );

      case "chamomile_tea":
      case "cup":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            {/* Cup */}
            <path d="M5 10 C5 17, 7 19, 12 19 C17 19, 19 17, 19 10 Z" fill="#fff9c4" stroke="#fbc02d" strokeWidth="1" />
            {/* Liquid */}
            <ellipse cx="12" cy="10" rx="6" ry="1.8" fill={item.color} />
            {/* Saucer */}
            <ellipse cx="12" cy="20" rx="9" ry="2" fill="#fffde7" stroke="#fbc02d" strokeWidth="1" />
            {/* Handle */}
            <path d="M18 11 C21 11, 21 15, 18 16" fill="none" stroke="#fbc02d" strokeWidth="1.5" />
            {/* Steam */}
            <path d="M10 6 C9 4, 11 3, 10 1 M14 7 C13 5, 15 4, 14 2" fill="none" stroke="#e0e0e0" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case "bread":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <path d="M4 14 C4 9, 7 7, 12 7 C17 7, 20 9, 20 14 C20 18, 17 19, 12 19 C7 19, 4 18, 4 14 Z" fill="#ffb74d" stroke="#e65100" strokeWidth="1.2" />
            {/* Crust Score Marks */}
            <line x1="8" y1="10" x2="10" y2="13" stroke="#e65100" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="12" y1="9" x2="14" y2="13" stroke="#e65100" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="16" y1="10" x2="18" y2="13" stroke="#e65100" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      case "quill":
        return (
          <svg viewBox="0 0 24 24" width={pixelSize} height={pixelSize} className="drop-shadow-sm">
            <path d="M6 19 L7 17 C10 15, 15 10, 18 4 C16 7, 13 8, 11 11 Z" fill="#b0bec5" stroke="#455a64" strokeWidth="1" />
            <path d="M18 4 C17 9, 14 13, 10 16" fill="none" stroke="#cfd8dc" strokeWidth="1" />
            <polygon points="5,20 6,18 7,19" fill="#263238" />
          </svg>
        );

      default:
        return (
          <div
            className="rounded-lg flex items-center justify-center font-bold text-white shadow-inner"
            style={{ backgroundColor: item.color, width: pixelSize, height: pixelSize }}
          >
            {item.name.charAt(0)}
          </div>
        );
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderGraphic()}
    </div>
  );
};
