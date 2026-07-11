/**
 * Accurate SVG-based interactive map of all 16 Malaysian states/territories
 * Uses real geographic boundaries from geoBoundaries ADM1 data
 * Hover: glow effect + tooltip; Click: navigate to state dashboard
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { statesData } from "@/lib/mockData";
import { MALAYSIA_STATES } from "@/lib/malaysiaPaths";
import WebGLCivicLayer from "@/components/WebGLCivicLayer";

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

const shortLabels: Record<string, string> = {
  "kuala-lumpur": "KL",
  putrajaya: "Putrajaya",
  "negeri-sembilan": "N. Sembilan",
  penang: "P. Pinang",
  labuan: "Labuan",
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
              "radial-gradient(ellipse at 15% 55%, rgba(14,165,233,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 45%, rgba(99,102,241,0.06) 0%, transparent 60%)",
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
              Hover to preview · Click to explore state dashboard · WebGL API layer active
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
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FACC15", boxShadow: "0 0 12px rgba(250,204,21,0.75)" }} />
              WebGL activity
            </div>
          </div>
        </div>

        <div
          className="relative w-full"
          style={{ aspectRatio: "900 / 500" }}
        >
          <WebGLCivicLayer hoveredState={hoveredState} />

          {/* SVG Map */}
          <svg
            viewBox="0 0 900 500"
            className="absolute inset-0 z-10 w-full h-full"
            preserveAspectRatio="none"
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
            <rect width="900" height="500" fill="url(#grid)" />

            {/* Peninsular label */}
            <text x="100" y="485" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans, sans-serif">
              PENINSULAR MALAYSIA
            </text>
            {/* East Malaysia label */}
            <text x="700" y="485" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans, sans-serif">
              EAST MALAYSIA
            </text>

            {/* State shapes */}
            {MALAYSIA_STATES.map((state) => {
              const isHovered = hoveredState === state.id;
              const color = stateColors[state.id] || "#0EA5E9";
              const label = shortLabels[state.id] || state.name;
              const isSmall = ["kuala-lumpur", "putrajaya", "labuan", "melaka"].includes(state.id);

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
                      d={state.path}
                      fill={color}
                      opacity={0.25}
                      filter="url(#glow-strong)"
                    />
                  )}

                  {/* Main shape */}
                  <motion.path
                    d={state.path}
                    fill={isHovered ? color : `${color}55`}
                    stroke={isHovered ? color : `${color}88`}
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    filter={isHovered ? "url(#glow)" : undefined}
                    animate={{
                      opacity: isHovered ? 1 : 0.75,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" as const }}
                  />

                  {/* State label */}
                  {!isSmall && (
                    <text
                      x={state.cx}
                      y={state.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.65)"}
                      fontSize={9}
                      fontFamily="DM Sans, sans-serif"
                      fontWeight={isHovered ? "700" : "500"}
                      style={{ pointerEvents: "none", transition: "all 0.2s" }}
                    >
                      {label}
                    </text>
                  )}
                  {isSmall && (
                    <text
                      x={state.cx}
                      y={state.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.55)"}
                      fontSize={6}
                      fontFamily="DM Sans, sans-serif"
                      fontWeight={isHovered ? "700" : "500"}
                      style={{ pointerEvents: "none", transition: "all 0.2s" }}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

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
        {MALAYSIA_STATES.map((state) => {
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
              <div className="text-xs font-semibold leading-tight" style={{ color, fontFamily: "DM Sans, sans-serif" }}>
                {state.id === "negeri-sembilan" ? "N.S." : state.id === "penang" ? "P.P." : state.id === "kuala-lumpur" ? "KL" : sd?.name.split(" ")[0] || state.name}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {sd ? formatMYR(sd.totalAllocation) : ""}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
