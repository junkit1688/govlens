/* ReportsPage — Citizen Infrastructure Reporting
 * Report potholes, streetlights, road conditions, sanitation issues
 * Track report status, upvote reports
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Search, Plus, MapPin, Clock, CheckCircle, Activity, ThumbsUp, Camera, X } from "lucide-react";
import { citizenReports as initialReports, type CitizenReport } from "@/lib/mockData";
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

const STATES = [
  "Selangor", "Johor", "Penang", "Perak", "Sabah", "Sarawak", "Kedah",
  "Kelantan", "Pahang", "Terengganu", "Negeri Sembilan", "Malacca",
  "Perlis", "Kuala Lumpur", "Putrajaya", "Labuan"
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CitizenReport["status"]>("all");
  const [catFilter, setCatFilter] = useState<"all" | CitizenReport["category"]>("all");
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<CitizenReport[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<CitizenReport["category"] | "">("");
  const [formState, setFormState] = useState("");
  const [formLocation, setFormLocation] = useState("");

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

  const handleSubmitReport = () => {
    if (!formTitle.trim()) { toast.error("Please enter a report title."); return; }
    if (!formDescription.trim()) { toast.error("Please describe the issue."); return; }
    if (!formCategory) { toast.error("Please select a category."); return; }
    if (!formState) { toast.error("Please select a state."); return; }
    if (!formLocation.trim()) { toast.error("Please enter the location."); return; }

    const newReport: CitizenReport = {
      id: `rpt-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory as CitizenReport["category"],
      state: formState,
      location: formLocation.trim(),
      status: "pending",
      reportedAt: "Just now",
      reporter: "You",
      upvotes: 0,
    };

    setReports((prev) => [newReport, ...prev]);
    toast.success("Report submitted! Authorities will be notified.");

    // Reset form
    setFormTitle("");
    setFormDescription("");
    setFormCategory("");
    setFormState("");
    setFormLocation("");
    setShowForm(false);
  };

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
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            Report infrastructure issues and help improve your community
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
            boxShadow: "0 0 20px rgba(14,165,233,0.3)",
          }}
        >
          <Plus size={18} /> Submit Report
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Reports", value: reports.length, color: "#0EA5E9" },
          { label: "Pending", value: reports.filter((r) => r.status === "pending").length, color: "#F59E0B" },
          { label: "Investigating", value: reports.filter((r) => r.status === "investigating").length, color: "#3B82F6" },
          { label: "Resolved", value: reports.filter((r) => r.status === "resolved").length, color: "#22C55E" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Search size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as any)}
          className="px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.4)" }}>
          <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
          <p>No reports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((report) => {
            const catConfig = CATEGORY_CONFIG[report.category];
            const statusConfig = STATUS_CONFIG[report.status];
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedReport(report)}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Category Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className="text-2xl"
                    style={{ fontSize: "20px" }}
                  >
                    {catConfig.emoji}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{
                      background: `${catConfig.color}20`,
                      color: catConfig.color,
                    }}
                  >
                    {catConfig.label}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-white mb-2">{report.title}</h3>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {report.description}
                </p>

                {/* Location & Status */}
                <div className="space-y-2 mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <MapPin size={12} /> {report.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Clock size={12} /> {report.reportedAt} by {report.reporter}
                  </div>
                </div>

                {/* Status & Upvotes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: statusConfig.color }}>
                    <StatusIcon size={14} /> {statusConfig.label}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(report.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: upvoted.has(report.id) ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.05)",
                      color: upvoted.has(report.id) ? "#0EA5E9" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <ThumbsUp size={12} /> {report.upvotes}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit Report Form Dialog */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6 space-y-4"
              style={{
                background: "rgba(10, 16, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Submit Report</h3>
                <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Report title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />

              <textarea
                placeholder="Describe the issue in detail"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg outline-none text-sm resize-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />

              <div>
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Category</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setFormCategory(key as CitizenReport["category"])}
                      className="p-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: formCategory === key ? `${config.color}30` : "rgba(255,255,255,0.05)",
                        border: formCategory === key ? `2px solid ${config.color}` : "1px solid rgba(255,255,255,0.1)",
                        color: formCategory === key ? config.color : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {config.emoji} {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <select
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                <option value="">Select state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location (street name, area, etc.)"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                  }}
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl p-6 max-h-96 overflow-y-auto"
              style={{
                background: "rgba(10, 16, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{CATEGORY_CONFIG[selectedReport.category].emoji}</span>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{selectedReport.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        background: `${CATEGORY_CONFIG[selectedReport.category].color}20`,
                        color: CATEGORY_CONFIG[selectedReport.category].color,
                      }}
                    >
                      {CATEGORY_CONFIG[selectedReport.category].label}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                      style={{
                        background: `${STATUS_CONFIG[selectedReport.status].color}20`,
                        color: STATUS_CONFIG[selectedReport.status].color,
                      }}
                    >
                      {(() => {
                        const StatusIcon = STATUS_CONFIG[selectedReport.status].icon;
                        return <StatusIcon size={12} />;
                      })()}
                      {STATUS_CONFIG[selectedReport.status].label}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-white/50 hover:text-white flex-shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Reported by {selectedReport.reporter}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{selectedReport.reportedAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Upvotes by {selectedReport.reporter}</p>
                  <p className="text-lg font-bold text-white">{selectedReport.upvotes}</p>
                </div>
              </div>

              <div className="mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-sm font-semibold text-white mb-2">Location</p>
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <MapPin size={16} /> {selectedReport.location}, {selectedReport.state}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-white mb-2">Description</p>
                <p className="text-white" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", lineHeight: "1.6" }}>
                  {selectedReport.description}
                </p>
              </div>

              <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <button
                  onClick={() => {
                    handleUpvote(selectedReport.id);
                    setSelectedReport(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    background: upvoted.has(selectedReport.id) ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.05)",
                    color: upvoted.has(selectedReport.id) ? "#0EA5E9" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <ThumbsUp size={16} /> {upvoted.has(selectedReport.id) ? "Upvoted" : "Upvote"}
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
