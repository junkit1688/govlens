/* ReportsPage — GovLens Citizen Reporting System
 * Report potholes, streetlights, road conditions, sanitation issues
 * Track report status, upvote reports
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Plus, MapPin, Clock, CheckCircle, Activity, ThumbsUp, Camera } from "lucide-react";
import { citizenReports, type CitizenReport } from "@/lib/mockData";
import { toast } from "sonner";

const CATEGORY_CONFIG: Record<CitizenReport["category"], { label: string; color: string; emoji: string }> = {
  pothole: { label: "Pothole", color: "#EF4444", emoji: "🕳️" },
  streetlight: { label: "Streetlight", color: "#F59E0B", emoji: "💡" },
  road: { label: "Road", color: "#F97316", emoji: "🛣️" },
  sanitation: { label: "Sanitation", color: "#22C55E", emoji: "🗑️" },
  flooding: { label: "Flooding", color: "#0EA5E9", emoji: "🌊" },
  other: { label: "Other", color: "#8B5CF6", emoji: "⚠️" },
};

const STATUS_CONFIG: Record<CitizenReport["status"], { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "#F59E0B", icon: Clock },
  investigating: { label: "Investigating", color: "#0EA5E9", icon: Activity },
  resolved: { label: "Resolved", color: "#22C55E", icon: CheckCircle },
};

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CitizenReport["status"]>("all");
  const [catFilter, setCatFilter] = useState<"all" | CitizenReport["category"]>("all");
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState(citizenReports);

  const filtered = reports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.state.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchCat = catFilter === "all" || r.category === catFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const handleUpvote = (id: string) => {
    if (upvoted.has(id)) {
      toast.info("You have already upvoted this report.");
      return;
    }
    setUpvoted((prev) => { const next = new Set(prev); next.add(id); return next; });
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    toast.success("Report upvoted! This helps prioritize the issue.");
  };

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const investigatingCount = reports.filter((r) => r.status === "investigating").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="p-6 space-y-6" style={{ background: "#060B18", minHeight: "100%" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            Citizen Reporting
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Report infrastructure issues and track their resolution
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.info("Report submission form coming soon!")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #EF4444, #F97316)",
            boxShadow: "0 0 20px rgba(239,68,68,0.25)",
          }}
        >
          <Plus size={16} /> Submit Report
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Pending", value: pendingCount, icon: Clock, color: "#F59E0B" },
          { label: "Investigating", value: investigatingCount, icon: Activity, color: "#0EA5E9" },
          { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "#22C55E" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
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

      {/* Category quick filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCatFilter("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: catFilter === "all" ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${catFilter === "all" ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.07)"}`,
            color: catFilter === "all" ? "#0EA5E9" : "rgba(255,255,255,0.5)",
          }}
        >
          All Types
        </button>
        {(Object.keys(CATEGORY_CONFIG) as CitizenReport["category"][]).map((cat) => {
          const conf = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: catFilter === cat ? `${conf.color}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${catFilter === cat ? `${conf.color}44` : "rgba(255,255,255,0.07)"}`,
                color: catFilter === cat ? conf.color : "rgba(255,255,255,0.5)",
              }}
            >
              {conf.emoji} {conf.label}
            </button>
          );
        })}
      </div>

      {/* Search + status filter */}
      <div className="flex gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[200px]"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "investigating", "resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
              style={{
                background: statusFilter === s ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${statusFilter === s ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: statusFilter === s ? "#0EA5E9" : "rgba(255,255,255,0.5)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((report, i) => {
          const catConf = CATEGORY_CONFIG[report.category];
          const statusConf = STATUS_CONFIG[report.status];
          const isUpvoted = upvoted.has(report.id);

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Category + status */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${catConf.color}18`,
                    color: catConf.color,
                    border: `1px solid ${catConf.color}33`,
                  }}
                >
                  {catConf.emoji} {catConf.label}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                  style={{
                    background: `${statusConf.color}18`,
                    color: statusConf.color,
                    border: `1px solid ${statusConf.color}33`,
                  }}
                >
                  <statusConf.icon size={10} />
                  {statusConf.label}
                </span>
              </div>

              {/* Image placeholder */}
              <div
                className="w-full h-24 rounded-xl mb-3 flex items-center justify-center"
                style={{ background: `${catConf.color}08`, border: `1px dashed ${catConf.color}33` }}
              >
                <Camera size={20} style={{ color: `${catConf.color}55` }} />
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{report.title}</h4>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                {report.description.slice(0, 100)}...
              </p>

              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <MapPin size={11} /> {report.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Clock size={11} /> Reported {report.reportedAt} by {report.reporter}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: isUpvoted ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isUpvoted ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.1)"}`,
                    color: isUpvoted ? "#0EA5E9" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <ThumbsUp size={12} />
                  {report.upvotes} Upvotes
                </motion.button>

                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  #{report.id.toUpperCase()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.3)" }}>
          <AlertTriangle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No reports found matching your filters.</p>
        </div>
      )}

      {/* Submit report CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-6 flex items-center gap-4 flex-wrap"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(249,115,22,0.06))",
          border: "1px solid rgba(239,68,68,0.15)",
        }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>
          <Camera size={22} style={{ color: "#EF4444" }} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            Spotted an Issue?
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Submit a report with photos and location details. Help improve your community.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.info("Report submission form coming soon!")}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #EF4444, #F97316)",
            boxShadow: "0 0 16px rgba(239,68,68,0.25)",
          }}
        >
          Submit Report
        </motion.button>
      </motion.div>
    </div>
  );
}
