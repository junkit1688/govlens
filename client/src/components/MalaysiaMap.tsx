/* MalaysiaMap — GovLens Custom SVG Interactive Map
 * Lightweight SVG-based map of all 16 Malaysian states/territories
 * Hover: scale + glow effect; Click: navigate to state dashboard
 * Design: Glassmorphic Civic Premium — teal/indigo glow on dark navy
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { statesData } from "@/lib/mockData";

interface StateShape {
  id: string;
  name: string;
  d: string; // SVG path
  labelX: number;
  labelY: number;
  group: "peninsular" | "east";
}

// Simplified but recognizable SVG paths for Malaysian states
// ViewBox: 0 0 800 600 — Peninsular on left, East Malaysia on right
const stateShapes: StateShape[] = [
  // ── PENINSULAR MALAYSIA ──
  {
    id: "perlis",
    name: "Perlis",
    group: "peninsular",
    labelX: 148,
    labelY: 62,
    d: "M 130 50 L 170 48 L 175 72 L 155 78 L 128 68 Z",
  },
  {
    id: "kedah",
    name: "Kedah",
    group: "peninsular",
    labelX: 148,
    labelY: 108,
    d: "M 128 68 L 155 78 L 175 72 L 185 90 L 195 115 L 185 135 L 165 140 L 145 135 L 125 120 L 118 95 Z",
  },
  {
    id: "penang",
    name: "Pulau Pinang",
    group: "peninsular",
    labelX: 112,
    labelY: 115,
    d: "M 95 105 L 118 95 L 125 120 L 108 128 Z",
  },
  {
    id: "perak",
    name: "Perak",
    group: "peninsular",
    labelX: 155,
    labelY: 190,
    d: "M 125 120 L 145 135 L 165 140 L 185 135 L 195 115 L 205 140 L 210 175 L 200 210 L 185 225 L 165 230 L 148 220 L 138 200 L 130 175 L 118 155 Z",
  },
  {
    id: "selangor",
    name: "Selangor",
    group: "peninsular",
    labelX: 178,
    labelY: 278,
    d: "M 148 220 L 165 230 L 185 225 L 200 235 L 205 260 L 200 285 L 185 295 L 168 290 L 155 275 L 148 255 Z",
  },
  {
    id: "kuala-lumpur",
    name: "Kuala Lumpur",
    group: "peninsular",
    labelX: 178,
    labelY: 255,
    d: "M 168 248 L 182 245 L 188 258 L 180 268 L 165 265 Z",
  },
  {
    id: "putrajaya",
    name: "Putrajaya",
    group: "peninsular",
    labelX: 185,
    labelY: 278,
    d: "M 178 272 L 192 270 L 196 280 L 188 286 L 176 282 Z",
  },
  {
    id: "negeri-sembilan",
    name: "Negeri Sembilan",
    group: "peninsular",
    labelX: 185,
    labelY: 318,
    d: "M 168 290 L 185 295 L 200 285 L 210 300 L 208 325 L 195 340 L 178 342 L 165 330 L 162 310 Z",
  },
  {
    id: "melaka",
    name: "Melaka",
    group: "peninsular",
    labelX: 185,
    labelY: 360,
    d: "M 178 342 L 195 340 L 205 355 L 200 368 L 182 370 L 172 358 Z",
  },
  {
    id: "johor",
    name: "Johor",
    group: "peninsular",
    labelX: 205,
    labelY: 405,
    d: "M 172 358 L 182 370 L 200 368 L 205 355 L 225 360 L 248 370 L 260 390 L 255 415 L 238 430 L 215 435 L 192 428 L 175 415 L 165 395 L 168 375 Z",
  },
  {
    id: "pahang",
    name: "Pahang",
    group: "peninsular",
    labelX: 258,
    labelY: 270,
    d: "M 200 210 L 210 175 L 230 165 L 265 160 L 295 170 L 315 185 L 320 210 L 310 240 L 295 265 L 275 280 L 255 285 L 235 278 L 215 265 L 205 245 Z",
  },
  {
    id: "terengganu",
    name: "Terengganu",
    group: "peninsular",
    labelX: 310,
    labelY: 205,
    d: "M 295 170 L 315 155 L 335 148 L 355 155 L 360 175 L 355 200 L 340 215 L 320 220 L 310 210 L 315 185 Z",
  },
  {
    id: "kelantan",
    name: "Kelantan",
    group: "peninsular",
    labelX: 285,
    labelY: 148,
    d: "M 230 130 L 255 120 L 280 118 L 305 125 L 315 145 L 315 155 L 295 170 L 265 160 L 230 165 L 220 150 Z",
  },
  // ── EAST MALAYSIA ──
  {
    id: "sabah",
    name: "Sabah",
    group: "east",
    labelX: 640,
    labelY: 200,
    d: "M 560 130 L 600 115 L 640 110 L 680 120 L 710 140 L 720 165 L 715 195 L 700 220 L 675 240 L 645 250 L 615 245 L 590 230 L 570 210 L 555 185 L 552 160 Z",
  },
  {
    id: "labuan",
    name: "Labuan",
    group: "east",
    labelX: 545,
    labelY: 195,
    d: "M 535 185 L 548 180 L 555 190 L 548 200 L 535 198 Z",
  },
  {
    id: "sarawak",
    name: "Sarawak",
    group: "east",
    labelX: 580,
    labelY: 340,
    d: "M 460 250 L 500 235 L 540 230 L 555 245 L 570 210 L 590 230 L 615 245 L 645 250 L 660 270 L 650 295 L 630 315 L 605 330 L 575 345 L 545 355 L 515 360 L 485 355 L 460 340 L 445 315 L 448 285 Z",
  },
];

const stateColors: Record<string, string> = {
  perlis: "#0EA5E9",
  kedah: "#6366F1",
  penang: "#22C55E",
  perak: "#0EA5E9",
  selangor: "#6366F1",
  "kuala-lumpur": "#F59E0B",
  putrajaya: "#EC4899",
  "negeri-sembilan": "#14B8A6",
  melaka: "#8B5CF6",
  johor: "#0EA5E9",
  pahang: "#22C55E",
  terengganu: "#6366F1",
  kelantan: "#F59E0B",
  sabah: "#0EA5E9",
  labuan: "#EC4899",
  sarawak: "#6366F1",
};

function formatMYR(millions: number): string {
  if (millions >= 1000) return `RM${(millions / 1000).toFixed(1)}B`;
  return `RM${millions}M`;
}

export default function MalaysiaMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [, navigate] = useLocation();

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleStateClick = (stateId: string) => {
    navigate(`/state/${stateId}`);
  };

  const getStateData = (id: string) => statesData[id];

  return (
    <div className="relative w-full" style={{ userSelect: "none" }}>
      {/* Map container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(6, 11, 24, 0.8)",
          border: "1px solid rgba(14, 165, 233, 0.15)",
          boxShadow: "0 0 60px rgba(14, 165, 233, 0.08), inset 0 0 60px rgba(6, 11, 24, 0.5)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 35% 50%, rgba(14,165,233,0.06) 0%, transparent 60%), radial-gradient(ellipse at 75% 50%, rgba(99,102,241,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Labels above map */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div>
            <h3
              className="text-white font-bold text-lg"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Malaysia — Interactive Spending Map
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Hover to preview · Click to explore state dashboard
            </p>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(14,165,233,0.5)" }} />
              Peninsular
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(99,102,241,0.5)" }} />
              East Malaysia
            </div>
          </div>
        </div>

        {/* SVG Map */}
        <svg
          viewBox="0 0 800 480"
          className="w-full"
          style={{ maxHeight: 480 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredState(null)}
        >
          {/* Grid dots background */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.8" fill="rgba(255,255,255,0.06)" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-strong">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="800" height="480" fill="url(#grid)" />

          {/* Peninsular label */}
          <text x="200" y="460" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans, sans-serif">
            PENINSULAR MALAYSIA
          </text>
          {/* East Malaysia label */}
          <text x="590" y="460" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans, sans-serif">
            EAST MALAYSIA
          </text>
          {/* Divider line */}
          <line x1="420" y1="30" x2="420" y2="450" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6,6" />

          {/* State shapes */}
          {stateShapes.map((state) => {
            const isHovered = hoveredState === state.id;
            const color = stateColors[state.id] || "#0EA5E9";
            const stateInfo = getStateData(state.id);

            return (
              <g
                key={state.id}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(state.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow layer (shown on hover) */}
                {isHovered && (
                  <path
                    d={state.d}
                    fill={color}
                    opacity={0.25}
                    filter="url(#glow-strong)"
                  />
                )}

                {/* Main shape */}
                <motion.path
                  d={state.d}
                  fill={isHovered ? color : `${color}55`}
                  stroke={isHovered ? color : `${color}88`}
                  strokeWidth={isHovered ? 2 : 1}
                  filter={isHovered ? "url(#glow)" : undefined}
                  animate={{
                    scale: isHovered ? 1.04 : 1,
                    opacity: isHovered ? 1 : 0.75,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" as const }}
                  style={{ transformOrigin: `${state.labelX}px ${state.labelY}px` }}
                />

                {/* State label */}
                <text
                  x={state.labelX}
                  y={state.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.65)"}
                  fontSize={state.id === "labuan" || state.id === "putrajaya" || state.id === "kuala-lumpur" ? 7 : 9}
                  fontFamily="DM Sans, sans-serif"
                  fontWeight={isHovered ? "700" : "500"}
                  style={{ pointerEvents: "none", transition: "all 0.2s" }}
                >
                  {state.id === "penang" ? "P. Pinang" : state.id === "negeri-sembilan" ? "N. Sembilan" : state.id === "kuala-lumpur" ? "KL" : state.id === "putrajaya" ? "Putrajaya" : state.name}
                </text>

                {/* Budget indicator dot */}
                {stateInfo && isHovered && (
                  <circle
                    cx={state.labelX}
                    cy={state.labelY - 14}
                    r={3}
                    fill={color}
                    filter="url(#glow)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute pointer-events-none z-50"
            style={{
              left: Math.min(tooltipPos.x + 16, 680),
              top: Math.max(tooltipPos.y - 80, 8),
            }}
          >
            {(() => {
              const sd = getStateData(hoveredState);
              const color = stateColors[hoveredState] || "#0EA5E9";
              if (!sd) return null;
              return (
                <div
                  className="rounded-xl px-4 py-3 min-w-[180px]"
                  style={{
                    background: "rgba(10, 16, 35, 0.95)",
                    border: `1px solid ${color}44`,
                    backdropFilter: "blur(20px)",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 16px ${color}22`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="font-bold text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                      {sd.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4 text-xs">
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>Allocation</span>
                      <span className="font-semibold" style={{ color }}>{formatMYR(sd.totalAllocation)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>Spent</span>
                      <span className="font-semibold text-white">{formatMYR(sd.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>Projects</span>
                      <span className="font-semibold text-white">{sd.stats.activeProjects} active</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Click to explore →</div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </div>

      {/* State cards row */}
      <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2">
        {stateShapes.slice(0, 8).map((state) => {
          const sd = getStateData(state.id);
          const color = stateColors[state.id] || "#0EA5E9";
          return (
            <motion.button
              key={state.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStateClick(state.id)}
              className="rounded-lg p-2 text-center transition-all duration-200"
              style={{
                background: `${color}11`,
                border: `1px solid ${color}33`,
                cursor: "pointer",
              }}
            >
              <div className="text-xs font-semibold truncate" style={{ color, fontFamily: "DM Sans, sans-serif" }}>
                {state.id === "negeri-sembilan" ? "N.S." : state.id === "penang" ? "P.P." : state.id === "kuala-lumpur" ? "KL" : sd?.name.split(" ")[0] || state.name}
              </div>
              {sd && (
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {formatMYR(sd.totalAllocation)}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
