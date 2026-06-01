/* ReportsPage — GovLens Citizen Reporting System
 * Report potholes, streetlights, road conditions, sanitation issues
 * Track report status, upvote reports
 * Glassmorphic Civic Premium design
 */
import { useState, type ChangeEvent } from "react";
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

const REPORT_IMAGE_FALLBACKS: Record<CitizenReport["category"], { url: string; alt: string }> = {
  pothole: {
    url: "https://picsum.photos/seed/govlens-pothole/900/600",
    alt: "Pothole on an asphalt road",
  },
  streetlight: {
    url: "https://picsum.photos/seed/govlens-streetlight/900/600",
    alt: "Streetlight along a road at night",
  },
  road: {
    url: "https://picsum.photos/seed/govlens-damaged-road/900/600",
    alt: "Damaged road surface",
  },
  sanitation: {
    url: "https://picsum.photos/seed/govlens-sanitation/900/600",
    alt: "Uncollected garbage on a street",
  },
  flooding: {
    url: "https://picsum.photos/seed/govlens-flooding/900/600",
    alt: "Flooded urban street",
  },
  other: {
    url: "https://picsum.photos/seed/govlens-public-safety/900/600",
    alt: "Public maintenance issue in a city",
  },
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
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formImageName, setFormImageName] = useState("");

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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormImageUrl(String(reader.result));
      setFormImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReport = () => {
    if (!formTitle.trim()) { toast.error("Please enter a report title."); return; }
    if (!formDescription.trim()) { toast.error("Please describe the issue."); return; }
    if (!formCategory) { toast.error("Please select a category."); return; }
    if (!formState) { toast.error("Please select a state."); return; }
    if (!formLocation.trim()) { toast.error("Please enter the location."); return; }

    const fallbackImage = REPORT_IMAGE_FALLBACKS[formCategory as CitizenReport["category"]];
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
      imageUrl: formImageUrl || fallbackImage.url,
      imageAlt: formImageName ? `Uploaded report image: ${formImageName}` : fallbackImage.alt,
    };

    setReports((prev) => [newReport, ...prev]);
    toast.success("Report submitted! Authorities will be notified.");

    // Reset form
    setFormTitle("");
    setFormDescription("");
    setFormCategory("");
    setFormState("");
    setFormLocation("");
    setFormImageUrl("");
    setFormImageName("");
    setShowForm(false);
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
          onClick={() => setShowForm(true)}
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
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              onClick={() => setSelectedReport(report)}
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

              <img
                src={report.imageUrl}
                alt={report.imageAlt}
                className="w-full h-32 rounded-xl mb-3 object-cover"
                style={{ background: `${catConf.color}08`, border: `1px solid ${catConf.color}22` }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = REPORT_IMAGE_FALLBACKS[report.category].url;
                }}
              />

              <h4 className="text-sm font-bold text-white mb-1">{report.title}</h4>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                {report.description}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpvote(report.id);
                  }}
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
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #EF4444, #F97316)",
            boxShadow: "0 0 16px rgba(239,68,68,0.25)",
          }}
        >
          Submit Report
        </motion.button>
      </motion.div>

      {/* Submit Report Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
              style={{
                background: "rgba(10,16,35,0.98)",
                border: "1px solid rgba(239,68,68,0.2)",
                boxShadow: "0 0 60px rgba(239,68,68,0.1)",
              }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                  Submit a Report
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Large pothole on Jalan Ampang"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Description *
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the issue in detail — size, severity, how it affects the community..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Category *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(CATEGORY_CONFIG) as CitizenReport["category"][]).map((cat) => {
                      const conf = CATEGORY_CONFIG[cat];
                      const isSelected = formCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormCategory(cat)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-center"
                          style={{
                            background: isSelected ? `${conf.color}18` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${isSelected ? `${conf.color}44` : "rgba(255,255,255,0.08)"}`,
                            color: isSelected ? conf.color : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {conf.emoji} {conf.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* State + Location row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                      State *
                    </label>
                    <select
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: formState ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      <option value="" style={{ background: "#0A1023" }}>Select state</option>
                      {STATES.map((s) => (
                        <option key={s} value={s} style={{ background: "#0A1023" }}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g., Jalan Ampang, KL"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    />
                  </div>
                </div>

                {/* Photo upload */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Photo
                  </label>
                  <label
                    className="block rounded-xl cursor-pointer overflow-hidden transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px dashed rgba(255,255,255,0.16)",
                    }}
                  >
                    {formImageUrl ? (
                      <div className="relative">
                        <img
                          src={formImageUrl}
                          alt="Selected report preview"
                          className="w-full h-40 object-cover"
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 px-3 py-2 text-xs font-semibold"
                          style={{
                            background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.75))",
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {formImageName || "Selected image"}
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center gap-2 text-center px-4">
                        <Camera size={22} style={{ color: "rgba(255,255,255,0.45)" }} />
                        <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.72)" }}>
                          Add a photo
                        </span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.42)" }}>
                          Optional, but helps authorities understand the issue faster.
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  {formImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormImageUrl("");
                        setFormImageName("");
                      }}
                      className="mt-2 text-xs font-semibold"
                      style={{ color: "#EF4444" }}
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitReport}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
                  style={{
                    background: "linear-gradient(135deg, #EF4444, #F97316)",
                    boxShadow: "0 0 20px rgba(239,68,68,0.25)",
                  }}
                >
                  Submit Report
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedReport(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl p-6"
              style={{
                background: "rgba(10,16,35,0.98)",
                border: "1px solid rgba(239,68,68,0.2)",
                boxShadow: "0 0 60px rgba(239,68,68,0.1)",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                    {selectedReport.title}
                  </h2>
                  <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {selectedReport.location} · Reported {selectedReport.reportedAt} by {selectedReport.reporter}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                >
                  <X size={16} />
                </button>
              </div>
              <img
                src={selectedReport.imageUrl}
                alt={selectedReport.imageAlt}
                className="w-full h-64 rounded-xl object-cover mb-4"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                onError={(e) => {
                  e.currentTarget.src = REPORT_IMAGE_FALLBACKS[selectedReport.category].url;
                }}
              />
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {selectedReport.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
