/* PetitionsPage — GovLens Citizen Petitions
 * Browse, create, and sign petitions. Signature progress bars.
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Filter, TrendingUp, Users, CheckCircle, Plus, MapPin, Tag } from "lucide-react";
import { petitions } from "@/lib/mockData";
import { toast } from "sonner";

const STATUS_CONFIG = {
  active: { label: "Active", color: "#0EA5E9" },
  closed: { label: "Closed", color: "rgba(255,255,255,0.3)" },
  won: { label: "Won", color: "#22C55E" },
};

export default function PetitionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "won" | "closed">("all");
  const [signed, setSigned] = useState<Set<string>>(new Set());

  const filtered = petitions.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.state.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSign = (id: string) => {
    if (signed.has(id)) {
      toast.info("You have already signed this petition.");
      return;
    }
    setSigned((prev) => { const next = new Set(prev); next.add(id); return next; });
    toast.success("Petition signed successfully! Thank you for your support.");
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
            Citizen Petitions
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Sign and create petitions to drive community change
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.info("Petition creation form coming soon!")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
            boxShadow: "0 0 20px rgba(14,165,233,0.25)",
          }}
        >
          <Plus size={16} /> New Petition
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
          { label: "Active Petitions", value: petitions.filter((p) => p.status === "active").length, icon: FileText, color: "#0EA5E9" },
          { label: "Total Signatures", value: petitions.reduce((a, p) => a + p.signatures, 0).toLocaleString(), icon: Users, color: "#6366F1" },
          { label: "Petitions Won", value: petitions.filter((p) => p.status === "won").length, icon: CheckCircle, color: "#22C55E" },
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

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[200px]"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
          <input
            type="text"
            placeholder="Search petitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "won", "closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
              style={{
                background: filter === f ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${filter === f ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: filter === f ? "#0EA5E9" : "rgba(255,255,255,0.5)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Petition cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((petition, i) => {
          const statusConf = STATUS_CONFIG[petition.status];
          const pct = Math.round((petition.signatures / petition.target) * 100);
          const isSigned = signed.has(petition.id);

          return (
            <motion.div
              key={petition.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-white leading-snug flex-1">{petition.title}</h3>
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

              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                {petition.description.slice(0, 120)}...
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <MapPin size={11} /> {petition.state}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Tag size={11} /> {petition.category}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Users size={11} /> by {petition.author}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span className="font-bold text-white">{petition.signatures.toLocaleString()}</span> / {petition.target.toLocaleString()} signatures
                  </span>
                  <span className="font-semibold" style={{ color: statusConf.color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    style={{ background: `linear-gradient(90deg, ${statusConf.color}, ${statusConf.color}88)` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {petition.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Sign button */}
              {petition.status === "active" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSign(petition.id)}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: isSigned ? "rgba(34,197,94,0.15)" : "rgba(14,165,233,0.15)",
                    border: `1px solid ${isSigned ? "rgba(34,197,94,0.3)" : "rgba(14,165,233,0.3)"}`,
                    color: isSigned ? "#22C55E" : "#0EA5E9",
                  }}
                >
                  {isSigned ? "✓ Signed" : "Sign Petition"}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.3)" }}>
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No petitions found matching your search.</p>
        </div>
      )}
    </div>
  );
}
