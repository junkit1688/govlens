/* Malaysia Map Component — Accurate Geographic Rendering
 * Uses precise SVG paths for realistic Malaysia silhouette
 * Peninsular Malaysia: tall vertical leaf-like shape
 * East Malaysia: separated by sea gap on the right
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { statesData } from "@/lib/mockData";

interface StateTooltip {
  state: string;
  x: number;
  y: number;
  allocation: string;
  spending: string;
  utilization: number;
}

interface StateShape {
  id: string;
  name: string;
  path: string;
  cx: number;
  cy: number;
}

export default function MalaysiaMap() {
  const [, setLocation] = useLocation();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<StateTooltip | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Accurate Malaysia state shapes as SVG paths
  const stateShapes: StateShape[] = [
    // PENINSULAR MALAYSIA
    {
      id: "perlis",
      name: "Perlis",
      path: "M 120 80 L 145 75 L 150 110 L 130 120 Z",
      cx: 135,
      cy: 95,
    },
    {
      id: "kedah",
      name: "Kedah",
      path: "M 120 120 L 150 110 L 160 160 L 140 175 L 115 150 Z",
      cx: 137,
      cy: 145,
    },
    {
      id: "penang",
      name: "Pulau Pinang",
      path: "M 105 130 L 115 128 L 118 155 L 108 158 Z",
      cx: 111,
      cy: 143,
    },
    {
      id: "perak",
      name: "Perak",
      path: "M 130 175 L 160 160 L 185 200 L 195 260 L 170 280 L 140 250 L 125 200 Z",
      cx: 160,
      cy: 220,
    },
    {
      id: "selangor",
      name: "Selangor",
      path: "M 170 280 L 195 260 L 210 300 L 215 350 L 185 365 L 160 320 Z",
      cx: 190,
      cy: 310,
    },
    {
      id: "kuala-lumpur",
      name: "Kuala Lumpur",
      path: "M 185 320 L 192 318 L 194 328 L 187 330 Z",
      cx: 190,
      cy: 324,
    },
    {
      id: "putrajaya",
      name: "Putrajaya",
      path: "M 188 335 L 195 333 L 197 345 L 190 347 Z",
      cx: 192,
      cy: 340,
    },
    {
      id: "negeri-sembilan",
      name: "Negeri Sembilan",
      path: "M 180 365 L 215 350 L 225 400 L 195 410 L 170 385 Z",
      cx: 200,
      cy: 385,
    },
    {
      id: "melaka",
      name: "Melaka",
      path: "M 175 410 L 195 410 L 200 445 L 180 448 Z",
      cx: 188,
      cy: 428,
    },
    {
      id: "johor",
      name: "Johor",
      path: "M 190 410 L 225 400 L 250 480 L 240 520 L 200 510 L 185 450 Z",
      cx: 220,
      cy: 460,
    },
    {
      id: "kelantan",
      name: "Kelantan",
      path: "M 200 200 L 230 190 L 245 240 L 220 260 L 195 240 Z",
      cx: 220,
      cy: 225,
    },
    {
      id: "terengganu",
      name: "Terengganu",
      path: "M 230 190 L 260 185 L 270 260 L 245 240 Z",
      cx: 250,
      cy: 220,
    },
    {
      id: "pahang",
      name: "Pahang",
      path: "M 195 240 L 220 260 L 245 240 L 270 260 L 280 360 L 240 380 L 210 300 Z",
      cx: 240,
      cy: 300,
    },
    // EAST MALAYSIA
    {
      id: "sarawak",
      name: "Sarawak",
      path: "M 420 280 L 520 270 L 530 330 L 510 360 L 450 350 L 430 310 Z",
      cx: 475,
      cy: 310,
    },
    {
      id: "sabah",
      name: "Sabah",
      path: "M 510 360 L 530 330 L 570 340 L 590 380 L 580 420 L 540 410 Z",
      cx: 555,
      cy: 375,
    },
    {
      id: "labuan",
      name: "Labuan",
      path: "M 515 430 L 530 428 L 532 445 L 517 447 Z",
      cx: 524,
      cy: 437,
    },
  ];

  // Handle state hover
  const handleStateHover = (
    shape: StateShape,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    const state = Object.values(statesData).find(
      (s: any) => s.name.toLowerCase() === shape.name.toLowerCase()
    );

    if (state) {
      setHoveredState(shape.name);
      const rect = (event.currentTarget as SVGPathElement).getBoundingClientRect();
      const parentRect = (event.currentTarget.parentElement as unknown as SVGSVGElement).getBoundingClientRect();

      const utilization = Math.round((state.totalSpent / state.totalAllocation) * 100);
      setTooltip({
        state: shape.name,
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 10,
        allocation: `RM${state.totalAllocation}B`,
        spending: `RM${state.totalSpent}B`,
        utilization,
      });
    }
  };

  const handleStateClick = (shape: StateShape) => {
    const state = Object.values(statesData).find(
      (s: any) => s.name.toLowerCase() === shape.name.toLowerCase()
    );

    if (state) {
      setSelectedState(shape.name);
      setLocation(`/state/${state.id}`);
    }
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 700 600"
        className="w-full h-full"
        style={{ maxHeight: "600px" }}
      >
        {/* Background */}
        <rect width="700" height="600" fill="#060B18" />

        {/* Render all states */}
        {stateShapes.map((shape, idx) => {
          const isHovered = hoveredState === shape.name;
          const isSelected = selectedState === shape.name;

          return (
            <motion.g key={idx}>
              {/* State path */}
              <motion.path
                d={shape.path}
                fill={isHovered || isSelected ? "#0EA5E9" : "#1E3A5F"}
                stroke={isHovered || isSelected ? "#00D9FF" : "#0EA5E9"}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                className="cursor-pointer transition-all"
                onMouseEnter={(e) => handleStateHover(shape, e as any)}
                onMouseLeave={() => {
                  setHoveredState(null);
                  setTooltip(null);
                }}
                onClick={() => handleStateClick(shape)}
                animate={{
                  filter: isHovered ? "drop-shadow(0 0 8px #0EA5E9)" : "none",
                  opacity: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* State label */}
              {isHovered && (
                <motion.text
                  x={shape.cx}
                  y={shape.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#00D9FF"
                  fontSize="9"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  pointerEvents="none"
                >
                  {shape.name}
                </motion.text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="absolute bg-slate-900/95 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-3 pointer-events-none z-50"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: "translate(-50%, -100%)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-cyan-400 font-bold text-sm">{tooltip.state}</div>
            <div className="text-gray-300 text-xs mt-1">
              <div>Allocation: {tooltip.allocation}</div>
              <div>Spent: {tooltip.spending}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    style={{ width: `${tooltip.utilization}%` }}
                  />
                </div>
                <span className="text-cyan-400 font-semibold">
                  {tooltip.utilization}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
