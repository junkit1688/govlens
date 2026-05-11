/* MalaysiaMap — Accurate GeoJSON-based Interactive Map
 * Renders realistic Malaysia state boundaries with proper geography
 * Each state is individually clickable with hover tooltips
 * Glassmorphic Civic Premium design with Framer Motion animations
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { malaysiaGeoJSON, getMapBounds, coordsToSVGPath } from "@/lib/malaysiaGeoJSON";
import { statesData } from "@/lib/mockData";

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

interface StateTooltip {
  stateId: string;
  x: number;
  y: number;
}

export default function MalaysiaMap() {
  const [search, setSearch] = useState("");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<StateTooltip | null>(null);

  // Calculate map bounds and scaling
  const mapDimensions = useMemo(() => {
    const bounds = getMapBounds(malaysiaGeoJSON.features);
    const padding = 0.5;
    const width = bounds.maxLng - bounds.minLng + padding;
    const height = bounds.maxLat - bounds.minLat + padding;

    // SVG viewBox dimensions
    const svgWidth = 1200;
    const svgHeight = 800;

    const xScale = svgWidth / width;
    const yScale = svgHeight / height;

    // Use uniform scaling to maintain aspect ratio
    const scale = Math.min(xScale, yScale) * 0.9;

    return {
      bounds,
      scale,
      svgWidth,
      svgHeight,
      xOffset: bounds.minLng - padding / 2,
      yOffset: bounds.minLat - padding / 2,
    };
  }, []);

  const filtered = Object.entries(statesData).filter(([_, state]) =>
    state.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStateMouseEnter = (stateId: string, e: React.MouseEvent<SVGPathElement>) => {
    setHoveredState(stateId);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      stateId,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleStateMouseMove = (stateId: string, e: React.MouseEvent<SVGPathElement>) => {
    if (hoveredState === stateId) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        stateId,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleStateMouseLeave = () => {
    setHoveredState(null);
    setTooltip(null);
  };

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
      <div className="mb-4 flex justify-center relative">
        <svg
          viewBox={`0 0 ${mapDimensions.svgWidth} ${mapDimensions.svgHeight}`}
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
          <ellipse
            cx={mapDimensions.svgWidth / 2}
            cy={mapDimensions.svgHeight / 2}
            rx={mapDimensions.svgWidth * 0.45}
            ry={mapDimensions.svgHeight * 0.45}
            fill="url(#mapGradient)"
            opacity="0.3"
          />

          {/* State polygons */}
          {malaysiaGeoJSON.features.map((feature) => {
            const stateId = feature.properties.id;
            const color = STATE_COLORS[stateId] || "#0EA5E9";
            const isHovered = hoveredState === stateId;

            // Get coordinates based on geometry type
            let coords: number[][] = [];
            if (feature.geometry.type === "Polygon") {
              coords = feature.geometry.coordinates[0] as number[][];
            } else if (feature.geometry.type === "MultiPolygon") {
              coords = (feature.geometry.coordinates[0] as number[][][])[0];
            }

            // Convert to SVG path
            const pathD = coordsToSVGPath(
              coords,
              mapDimensions.scale,
              mapDimensions.scale,
              mapDimensions.xOffset,
              mapDimensions.yOffset
            );

            return (
              <Link key={stateId} href={`/state/${stateId}`}>
                <motion.path
                  d={pathD}
                  fill={isHovered ? color : `${color}55`}
                  stroke={isHovered ? color : `${color}88`}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 1 : 0.75}
                  filter={isHovered ? "url(#glow)" : undefined}
                  whileHover={{ scale: 1.03 }}
                  onMouseEnter={(e) => handleStateMouseEnter(stateId, e as any)}
                  onMouseMove={(e) => handleStateMouseMove(stateId, e as any)}
                  onMouseLeave={handleStateMouseLeave}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    transformOrigin: "center",
                  }}
                />
              </Link>
            );
          })}

          {/* Region labels */}
          <text
            x={mapDimensions.svgWidth * 0.25}
            y={mapDimensions.svgHeight - 20}
            fontSize="14"
            fill="rgba(255,255,255,0.4)"
            textAnchor="middle"
            fontWeight="bold"
            fontFamily="DM Sans, sans-serif"
          >
            Peninsular Malaysia
          </text>

          <text
            x={mapDimensions.svgWidth * 0.75}
            y={mapDimensions.svgHeight - 20}
            fontSize="14"
            fill="rgba(255,255,255,0.4)"
            textAnchor="middle"
            fontWeight="bold"
            fontFamily="DM Sans, sans-serif"
          >
            East Malaysia
          </text>
        </svg>

        {/* Tooltip */}
        {tooltip && hoveredState && statesData[hoveredState] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute rounded-lg p-3 pointer-events-none z-50"
            style={{
              background: "rgba(6, 11, 24, 0.95)",
              border: `1px solid ${STATE_COLORS[hoveredState]}44`,
              backdropFilter: "blur(10px)",
              left: `${tooltip.x + 20}px`,
              top: `${tooltip.y - 60}px`,
              minWidth: "200px",
            }}
          >
            <div className="text-sm font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              {statesData[hoveredState].name}
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              Allocation: <span style={{ color: STATE_COLORS[hoveredState] }}>RM{(statesData[hoveredState].totalAllocation / 1000).toFixed(1)}B</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              Spent: <span style={{ color: STATE_COLORS[hoveredState] }}>RM{(statesData[hoveredState].totalSpent / 1000).toFixed(1)}B</span>
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              {Math.round((statesData[hoveredState].totalSpent / statesData[hoveredState].totalAllocation) * 100)}% utilization
            </div>
          </motion.div>
        )}
      </div>

      {/* State list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.map(([stateId, state]) => {
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
