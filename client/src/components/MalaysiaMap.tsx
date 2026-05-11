/* MalaysiaMap — Accurate Geographic Malaysia SVG Map
 * Peninsular Malaysia + Sabah/Sarawak with proper borders
 * Interactive state selection with budget visualization
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { statesData } from "@/lib/mockData";
import { Link } from "wouter";
import { Search } from "lucide-react";

const STATE_COLORS: Record<string, string> = {
  perlis: "#3B82F6",
  kedah: "#06B6D4",
  penang: "#10B981",
  perak: "#8B5CF6",
  selangor: "#EC4899",
  kl: "#F59E0B",
  putrajaya: "#6366F1",
  negeri_sembilan: "#14B8A6",
  melaka: "#EF4444",
  johor: "#F97316",
  pahang: "#84CC16",
  terengganu: "#06B6D4",
  kelantan: "#A855F7",
  sabah: "#0EA5E9",
  labuan: "#6366F1",
  sarawak: "#22C55E",
};

export default function MalaysiaMap() {
  const [search, setSearch] = useState("");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const filtered = Object.entries(statesData).filter(([_, state]) =>
    state.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="mb-4">
        <h3 className="text-base font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
          Malaysia — Interactive Spending Map
        </h3>
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
          Hover to preview · Click to explore state dashboard
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
          <input
            type="text"
            placeholder="Search states, projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="mb-4 flex justify-center">
        <svg
          viewBox="0 0 1200 900"
          width="100%"
          height="auto"
          style={{ maxWidth: "700px", filter: "drop-shadow(0 0 20px rgba(14,165,233,0.1))" }}
        >
          {/* Background glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(14,165,233,0.1)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.1)" />
            </linearGradient>
          </defs>

          {/* Background shape */}
          <ellipse cx="600" cy="450" rx="550" ry="420" fill="url(#mapGradient)" opacity="0.3" />

          {/* PENINSULAR MALAYSIA */}
          {/* Perlis */}
          <motion.path
            d="M 180 140 L 210 135 L 215 165 L 190 170 Z"
            fill={hoveredState === "perlis" ? "#0EA5E9" : STATE_COLORS.perlis}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "perlis" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("perlis")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "perlis" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "195px 152px" }}
          />

          {/* Kedah */}
          <motion.path
            d="M 160 170 L 210 165 L 225 210 L 200 230 L 170 215 Z"
            fill={hoveredState === "kedah" ? "#0EA5E9" : STATE_COLORS.kedah}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "kedah" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("kedah")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "kedah" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "190px 190px" }}
          />

          {/* Penang */}
          <motion.path
            d="M 135 195 L 160 190 L 165 225 L 140 230 Z"
            fill={hoveredState === "penang" ? "#0EA5E9" : STATE_COLORS.penang}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "penang" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("penang")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "penang" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "150px 210px" }}
          />

          {/* Perak */}
          <motion.path
            d="M 170 215 L 225 210 L 245 280 L 235 330 L 195 340 L 175 290 Z"
            fill={hoveredState === "perak" ? "#0EA5E9" : STATE_COLORS.perak}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "perak" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("perak")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "perak" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "210px 280px" }}
          />

          {/* Selangor */}
          <motion.path
            d="M 220 310 L 260 300 L 275 340 L 255 360 L 225 350 Z"
            fill={hoveredState === "selangor" ? "#0EA5E9" : STATE_COLORS.selangor}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "selangor" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("selangor")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "selangor" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "245px 330px" }}
          />

          {/* KL (Kuala Lumpur) */}
          <motion.circle
            cx="240"
            cy="335"
            r="10"
            fill={hoveredState === "kl" ? "#0EA5E9" : STATE_COLORS.kl}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "kl" ? 1 : 0.4}
            whileHover={{ scale: 1.3 }}
            onMouseEnter={() => setHoveredState("kl")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "kl" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none" }}
          />

          {/* Putrajaya */}
          <motion.circle
            cx="250"
            cy="350"
            r="8"
            fill={hoveredState === "putrajaya" ? "#0EA5E9" : STATE_COLORS.putrajaya}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "putrajaya" ? 1 : 0.4}
            whileHover={{ scale: 1.3 }}
            onMouseEnter={() => setHoveredState("putrajaya")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "putrajaya" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none" }}
          />

          {/* Negeri Sembilan */}
          <motion.path
            d="M 235 360 L 265 355 L 275 390 L 255 405 Z"
            fill={hoveredState === "negeri_sembilan" ? "#0EA5E9" : STATE_COLORS.negeri_sembilan}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "negeri_sembilan" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("negeri_sembilan")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "negeri_sembilan" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "255px 380px" }}
          />

          {/* Melaka */}
          <motion.path
            d="M 245 405 L 275 400 L 285 435 L 260 445 Z"
            fill={hoveredState === "melaka" ? "#0EA5E9" : STATE_COLORS.melaka}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "melaka" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("melaka")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "melaka" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "270px 425px" }}
          />

          {/* Johor */}
          <motion.path
            d="M 255 410 L 290 405 L 310 480 L 280 520 L 250 490 Z"
            fill={hoveredState === "johor" ? "#0EA5E9" : STATE_COLORS.johor}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "johor" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("johor")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "johor" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "280px 460px" }}
          />

          {/* Pahang */}
          <motion.path
            d="M 260 280 L 310 270 L 340 330 L 310 370 L 280 360 Z"
            fill={hoveredState === "pahang" ? "#0EA5E9" : STATE_COLORS.pahang}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "pahang" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("pahang")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "pahang" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "305px 320px" }}
          />

          {/* Terengganu */}
          <motion.path
            d="M 310 240 L 350 235 L 365 300 L 340 320 Z"
            fill={hoveredState === "terengganu" ? "#0EA5E9" : STATE_COLORS.terengganu}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "terengganu" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("terengganu")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "terengganu" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "340px 280px" }}
          />

          {/* Kelantan */}
          <motion.path
            d="M 280 200 L 330 195 L 350 240 L 310 250 Z"
            fill={hoveredState === "kelantan" ? "#0EA5E9" : STATE_COLORS.kelantan}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "kelantan" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("kelantan")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "kelantan" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "320px 220px" }}
          />

          {/* EAST MALAYSIA - Sabah */}
          <motion.path
            d="M 700 200 L 800 190 L 840 260 L 820 340 L 750 360 L 700 300 Z"
            fill={hoveredState === "sabah" ? "#0EA5E9" : STATE_COLORS.sabah}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "sabah" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("sabah")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "sabah" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "770px 280px" }}
          />

          {/* EAST MALAYSIA - Labuan */}
          <motion.circle
            cx="680"
            cy="280"
            r="10"
            fill={hoveredState === "labuan" ? "#0EA5E9" : STATE_COLORS.labuan}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "labuan" ? 1 : 0.4}
            whileHover={{ scale: 1.3 }}
            onMouseEnter={() => setHoveredState("labuan")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "labuan" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none" }}
          />

          {/* EAST MALAYSIA - Sarawak */}
          <motion.path
            d="M 600 380 L 720 370 L 760 500 L 700 560 L 600 540 Z"
            fill={hoveredState === "sarawak" ? "#0EA5E9" : STATE_COLORS.sarawak}
            stroke="#1a3a52"
            strokeWidth="2"
            opacity={hoveredState === null || hoveredState === "sarawak" ? 1 : 0.4}
            whileHover={{ scale: 1.08 }}
            onMouseEnter={() => setHoveredState("sarawak")}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-opacity duration-200"
            style={{ filter: hoveredState === "sarawak" ? "drop-shadow(0 0 8px rgba(14,165,233,0.6))" : "none", transformOrigin: "680px 460px" }}
          />

          {/* Region Labels */}
          <text x="220" y="580" fontSize="12" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontWeight="bold" fontFamily="DM Sans, sans-serif">
            Peninsular
          </text>
          <text x="220" y="600" fontSize="12" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontWeight="bold" fontFamily="DM Sans, sans-serif">
            Malaysia
          </text>

          <text x="730" y="580" fontSize="12" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontWeight="bold" fontFamily="DM Sans, sans-serif">
            East
          </text>
          <text x="730" y="600" fontSize="12" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontWeight="bold" fontFamily="DM Sans, sans-serif">
            Malaysia
          </text>
        </svg>
      </div>

      {/* State list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.map(([stateId, state]) => {
          const pct = Math.round((state.totalSpent / state.totalAllocation) * 100);
          const isHovered = hoveredState === stateId;

          return (
            <Link key={stateId} href={`/state/${stateId}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-lg p-2 cursor-pointer text-center transition-all duration-200"
                style={{
                  background: isHovered ? `${STATE_COLORS[stateId]}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isHovered ? `${STATE_COLORS[stateId]}44` : "rgba(255,255,255,0.07)"}`,
                }}
                onMouseEnter={() => setHoveredState(stateId)}
                onMouseLeave={() => setHoveredState(null)}
              >
                <div className="text-xs font-bold text-white">{state.name}</div>
                <div className="text-xs mt-0.5" style={{ color: STATE_COLORS[stateId] }}>
                  RM{(state.totalAllocation / 1000).toFixed(1)}B
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
