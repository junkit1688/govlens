/* StateDashboard — GovLens State Spending Analytics
 * Pie charts, bar charts, project cards, stat cards, timeline
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from "recharts";
import {
  ArrowLeft, MapPin, Users, Building, TrendingUp, CheckCircle, AlertCircle, Clock, BarChart3, Activity,
} from "lucide-react";
import { statesData } from "@/lib/mockData";

interface Props {
  stateId: string;
}

const STATUS_CONFIG = {
  ongoing: { label: "Ongoing", color: "#0EA5E9", icon: Activity },
  completed: { label: "Completed", color: "#22C55E", icon: CheckCircle },
  planned: { label: "Planned", color: "#F59E0B", icon: Clock },
};

function formatMYR(m: number) {
  if (m >= 1000) return `RM${(m / 1000).toFixed(2)}B`;
  return `RM${m}M`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2"
        style={{
          background: "rgba(10,16,35,0.95)",
          border: "1px solid rgba(14,165,233,0.2)",
          backdropFilter: "blur(16px)",
          fontSize: 12,
        }}
      >
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" && p.value > 100 ? `RM${p.value}M` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StateDashboard({ stateId }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "trends">("overview");
  const state = statesData[stateId];

  if (!state) {
    return (
      <div className="p-6 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        <p>State not found.</p>
        <Link href="/map">
          <button className="mt-4 text-sm" style={{ color: "#0EA5E9" }}>← Back to Map</button>
        </Link>
      </div>
    );
  }

  const spentPct = Math.round((state.totalSpent / state.totalAllocation) * 100);

  return (
    <div className="p-6 space-y-6" style={{ minHeight: "100%" }}>
      {/* Back + header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <Link href="/map">
            <motion.button
              whileHover={{ x: -3 }}
              className="flex items-center gap-1.5 text-sm mb-3 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#0EA5E9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)")}
            >
              <ArrowLeft size={14} /> Back to Malaysia Map
            </motion.button>
          </Link>
          <h1
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {state.name}
          </h1>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <MapPin size={13} /> {state.capital}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <Users size={13} /> {(state.population / 1000000).toFixed(2)}M population
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <Building size={13} /> {state.area.toLocaleString()} km²
            </div>
          </div>
        </div>

        {/* Budget summary pill */}
        <div
          className="rounded-2xl px-6 py-4 text-right"
          style={{
            background: "rgba(14,165,233,0.08)",
            border: "1px solid rgba(14,165,233,0.2)",
          }}
        >
          <div className="text-xs font-semibold mb-1" style={{ color: "#0EA5E9" }}>Total Allocation</div>
          <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            {formatMYR(state.totalAllocation)}
          </div>
          <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {formatMYR(state.totalSpent)} spent ({spentPct}%)
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {[
          { label: "Active Projects", value: state.stats.activeProjects, icon: Activity, color: "#0EA5E9" },
          { label: "Completed", value: state.stats.completedProjects, icon: CheckCircle, color: "#22C55E" },
          { label: "Citizen Reports", value: state.stats.citizenReports, icon: AlertCircle, color: "#F59E0B" },
          { label: "Petitions", value: state.stats.activePetitions, icon: BarChart3, color: "#6366F1" },
          { label: "Satisfaction", value: `${state.stats.satisfactionRate}%`, icon: TrendingUp, color: "#14B8A6" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="stat-card"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}18` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["overview", "projects", "trends"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
            style={{
              background: activeTab === tab ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeTab === tab ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.07)"}`,
              color: activeTab === tab ? "#0EA5E9" : "rgba(255,255,255,0.5)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Pie chart */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Budget Breakdown by Category
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={state.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {state.categories.map((cat, i) => (
                      <Cell key={i} fill={cat.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div
                            className="rounded-xl px-3 py-2"
                            style={{
                              background: "rgba(10,16,35,0.95)",
                              border: "1px solid rgba(14,165,233,0.2)",
                              backdropFilter: "blur(16px)",
                              fontSize: 12,
                            }}
                          >
                            <p className="font-semibold text-white">{d.name}</p>
                            <p style={{ color: d.color }}>RM{d.amount}M ({d.percentage}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {state.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">RM{cat.amount}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart — categories */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Spending by Sector (RM Million)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={state.categories} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {state.categories.map((cat, i) => (
                    <Cell key={i} fill={cat.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly spending */}
          <div
            className="rounded-2xl p-6 lg:col-span-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Monthly Spending 2025 (RM Million)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={state.monthlySpending} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#0EA5E9" strokeWidth={2} fill="url(#spendGrad)" name="Spending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly budget vs spent */}
          <div
            className="rounded-2xl p-6 lg:col-span-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Budget vs Actual Spending (2021–2025)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={state.yearlyBudget} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget" name="Budget" fill="rgba(99,102,241,0.6)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" fill="rgba(14,165,233,0.8)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Projects tab */}
      {activeTab === "projects" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {state.projects.map((project, i) => {
            const statusConf = STATUS_CONFIG[project.status];
            const pct = Math.round((project.spent / project.budget) * 100);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-sm font-semibold text-white leading-snug flex-1">{project.name}</h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold"
                    style={{
                      background: `${statusConf.color}18`,
                      color: statusConf.color,
                      border: `1px solid ${statusConf.color}33`,
                    }}
                  >
                    {statusConf.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <div className="flex justify-between">
                    <span>Budget</span>
                    <span className="font-semibold text-white">RM{project.budget}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent</span>
                    <span className="font-semibold" style={{ color: "#0EA5E9" }}>RM{project.spent}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Period</span>
                    <span className="text-white">{project.startDate.slice(0, 7)} → {project.endDate.slice(0, 7)}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.04 }}
                      style={{ background: `linear-gradient(90deg, ${statusConf.color}, ${statusConf.color}88)` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Trends tab */}
      {activeTab === "trends" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Line chart */}
          <div
            className="rounded-2xl p-6 lg:col-span-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              5-Year Spending Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={state.yearlyBudget} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="budget" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: "#6366F1", r: 4 }} name="Budget" />
                <Line type="monotone" dataKey="spent" stroke="#0EA5E9" strokeWidth={2.5} dot={{ fill: "#0EA5E9", r: 4 }} name="Spent" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category progress bars */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Sector Allocation Progress
            </h3>
            <div className="space-y-4">
              {state.categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{cat.name}</span>
                    <span className="font-semibold" style={{ color: cat.color }}>{cat.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community stats */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Community Engagement
            </h3>
            <div className="space-y-4">
              {[
                { label: "Citizen Satisfaction", value: state.stats.satisfactionRate, max: 100, color: "#22C55E" },
                { label: "Budget Utilization", value: spentPct, max: 100, color: "#0EA5E9" },
                { label: "Project Completion", value: Math.round((state.stats.completedProjects / (state.stats.completedProjects + state.stats.activeProjects)) * 100), max: 100, color: "#6366F1" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{item.label}</span>
                    <span className="font-semibold" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
