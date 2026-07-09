/* MapPage — GovLens Interactive Spending Map
 * Malaysia map centerpiece + national stats + state overview cards
 */
import { motion } from "framer-motion";
import MalaysiaMap from "@/components/MalaysiaMap";
import { nationalStats, statesData } from "@/lib/mockData";
import { TrendingUp, CheckCircle, Users, FileText, BarChart3, Globe } from "lucide-react";
import { Link } from "wouter";

const statsItems = [
  { label: "National Budget", value: `RM${(nationalStats.totalBudget / 1000).toFixed(1)}B`, icon: TrendingUp, color: "#0EA5E9" },
  { label: "Total Spent", value: `RM${(nationalStats.totalSpent / 1000).toFixed(1)}B`, icon: BarChart3, color: "#22C55E" },
  { label: "Active Projects", value: nationalStats.activeProjects.toLocaleString(), icon: CheckCircle, color: "#6366F1" },
  { label: "Citizen Reports", value: nationalStats.citizenReports.toLocaleString(), icon: Users, color: "#F59E0B" },
  { label: "Active Petitions", value: nationalStats.activePetitions.toString(), icon: FileText, color: "#EC4899" },
  { label: "Satisfaction Rate", value: `${nationalStats.satisfactionRate}%`, icon: Globe, color: "#14B8A6" },
];

export default function MapPage() {
  const topStates = Object.values(statesData)
    .sort((a, b) => b.totalAllocation - a.totalAllocation)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6" style={{ minHeight: "100%" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1
          className="text-3xl font-extrabold text-white"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Interactive Spending Map
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Explore government budget allocations across all Malaysian states
        </p>
        <div
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(14,165,233,0.12)",
            border: "1px solid rgba(14,165,233,0.28)",
            color: "#7DD3FC",
          }}
        >
          <Globe size={13} />
          Interactive visual data map for HCI visual-tech requirement
        </div>
      </motion.div>

      {/* National stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {statsItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="stat-card"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: `${stat.color}18` }}
            >
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div
              className="text-xl font-bold text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {stat.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Map + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="xl:col-span-3"
        >
          <MalaysiaMap />
        </motion.div>

        {/* Top states sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3"
        >
          <h3
            className="text-sm font-bold text-white px-1"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Top Allocations
          </h3>
          {topStates.map((state, i) => {
            const pct = Math.round((state.totalSpent / state.totalAllocation) * 100);
            const colors = ["#0EA5E9", "#6366F1", "#22C55E", "#F59E0B", "#EC4899"];
            const color = colors[i];
            return (
              <Link key={state.id} href={`/state/${state.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="rounded-xl p-3 cursor-pointer transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${color}44`;
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                        style={{ background: `${color}22`, color }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{state.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                    RM{(state.totalAllocation / 1000).toFixed(1)}B allocated
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                    />
                  </div>
                </motion.div>
              </Link>
            );
          })}

          {/* All states link */}
          <div
            className="rounded-xl p-3 text-center text-xs font-semibold cursor-pointer transition-all duration-200"
            style={{
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.2)",
              color: "#0EA5E9",
            }}
          >
            View All 16 States →
          </div>
        </motion.div>
      </div>

      {/* Budget overview note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl p-4 flex items-center gap-3"
        style={{
          background: "rgba(14,165,233,0.06)",
          border: "1px solid rgba(14,165,233,0.15)",
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(14,165,233,0.15)" }}>
          <BarChart3 size={16} style={{ color: "#0EA5E9" }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">2025 Federal Budget Overview</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
            Total national allocation of RM{(nationalStats.totalBudget / 1000).toFixed(1)}B across 16 states and federal territories. Click any state on the map to explore detailed spending breakdowns.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
