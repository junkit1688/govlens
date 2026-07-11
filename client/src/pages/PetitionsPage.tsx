/* PetitionsPage — GovLens Citizen Petitions
 * Browse, create, and sign petitions. Signature progress bars.
 * Glassmorphic Civic Premium design
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { FileText, Search, Filter, TrendingUp, Users, CheckCircle, Plus, MapPin, Tag, X, Trash2 } from "lucide-react";
import { petitions as initialPetitions, type Petition } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import SpeechInputButton from "@/components/SpeechInputButton";
import { appendTranscript } from "@/lib/speechText";
import { createPetition, deletePetition, fetchPetitions, signPetition } from "@/lib/govlensData";

const STATUS_CONFIG = {
  active: { label: "Active", color: "#0EA5E9" },
  closed: { label: "Closed", color: "rgba(255,255,255,0.3)" },
  won: { label: "Won", color: "#22C55E" },
};

const STATES = [
  "Selangor", "Johor", "Penang", "Perak", "Sabah", "Sarawak", "Kedah",
  "Kelantan", "Pahang", "Terengganu", "Negeri Sembilan", "Malacca",
  "Perlis", "Kuala Lumpur", "Putrajaya", "Labuan"
];

const CATEGORIES = [
  "Infrastructure", "Transportation", "Healthcare", "Education",
  "Environment", "Housing", "Agriculture", "Utilities", "Community"
];

export default function PetitionsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "won" | "closed">("all");
  const [signed, setSigned] = useState<Set<string>>(new Set());
  const [allPetitions, setAllPetitions] = useState<Petition[]>(initialPetitions);
  const [showForm, setShowForm] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formState, setFormState] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTarget, setFormTarget] = useState("1000");
  const [formTags, setFormTags] = useState("");

  const filtered = allPetitions.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.state.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    fetchPetitions()
      .then((remotePetitions) => {
        if (remotePetitions.length) setAllPetitions([...remotePetitions, ...initialPetitions]);
      })
      .catch(() => toast.error("Could not load Supabase petitions. Showing prototype data."));
  }, []);

  const handleSign = async (petition: Petition) => {
    if (!user) { toast.info("Please sign in to sign petitions."); navigate("/login"); return; }
    if (signed.has(petition.id)) {
      toast.info("You have already signed this petition.");
      return;
    }

    if (petition.userId) {
      try {
        await signPetition(petition.id, user.id);
        toast.success("Petition signature saved to Supabase.");
      } catch (error) {
        if (String(error).includes("Supabase is not configured")) {
          toast.success("Petition signed in prototype mode. Add Supabase env vars for shared storage.");
        } else {
          toast.error(error instanceof Error ? error.message : "Could not save signature.");
          return;
        }
      }
    } else {
      toast.success("Prototype petition signed locally.");
    }

    setSigned((prev) => { const next = new Set(prev); next.add(petition.id); return next; });
    setAllPetitions((prev) => prev.map((p) => p.id === petition.id ? { ...p, signatures: p.signatures + 1 } : p));
  };

  const handleSubmitPetition = async () => {
    if (!user) { toast.info("Please sign in to create a petition."); navigate("/login"); return; }
    if (!formTitle.trim()) { toast.error("Please enter a petition title."); return; }
    if (!formDescription.trim()) { toast.error("Please enter a description."); return; }
    if (!formState) { toast.error("Please select a state."); return; }
    if (!formCategory) { toast.error("Please select a category."); return; }

    const localPetition: Petition = {
      id: `pet-${Date.now()}`,
      userId: user.id,
      title: formTitle.trim(),
      description: formDescription.trim(),
      state: formState,
      category: formCategory,
      signatures: 1,
      target: parseInt(formTarget) || 1000,
      status: "active",
      createdAt: new Date().toLocaleDateString("en-MY", { year: "numeric", month: "short", day: "numeric" }),
      author: user.name,
      tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      const savedPetition = await createPetition({
        userId: user.id,
        authorName: user.name,
        title: localPetition.title,
        description: localPetition.description,
        state: localPetition.state,
        category: localPetition.category,
        target: localPetition.target,
        tags: localPetition.tags,
      });
      setAllPetitions((prev) => [savedPetition, ...prev]);
      setSigned((prev) => { const next = new Set(prev); next.add(savedPetition.id); return next; });
      toast.success("Petition created in Supabase.");
    } catch (error) {
      if (String(error).includes("Supabase is not configured")) {
        setAllPetitions((prev) => [localPetition, ...prev]);
        setSigned((prev) => { const next = new Set(prev); next.add(localPetition.id); return next; });
        toast.success("Petition created in prototype mode. Add Supabase env vars for shared storage.");
      } else {
        toast.error(error instanceof Error ? error.message : "Could not save petition.");
        setSaving(false);
        return;
      }
    }

    // Reset form
    setFormTitle("");
    setFormDescription("");
    setFormState("");
    setFormCategory("");
    setFormTarget("1000");
    setFormTags("");
    setShowForm(false);
    setSaving(false);
  };

  const handleDeletePetition = async (petition: Petition) => {
    if (!user || !isOwnPetition(petition, user)) return;
    if (!window.confirm("Delete this petition? This removes it for everyone.")) return;

    setDeletingId(petition.id);
    try {
      await deletePetition(petition.id, user.id);
      setAllPetitions((prev) => prev.filter((item) => item.id !== petition.id));
      setSelectedPetition((current) => current?.id === petition.id ? null : current);
      toast.success("Petition deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete petition.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ minHeight: "100%" }}>
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
          onClick={() => {
            if (!user) { toast.info("Please sign in to create a petition."); navigate("/login"); return; }
            setShowForm(true);
          }}
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
          { label: "Active Petitions", value: allPetitions.filter((p) => p.status === "active").length, icon: FileText, color: "#0EA5E9" },
          { label: "Total Signatures", value: allPetitions.reduce((a, p) => a + p.signatures, 0).toLocaleString(), icon: Users, color: "#6366F1" },
          { label: "Petitions Won", value: allPetitions.filter((p) => p.status === "won").length, icon: CheckCircle, color: "#22C55E" },
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
          const canDelete = Boolean(user && isOwnPetition(petition, user));

          return (
            <motion.div
              key={petition.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              onClick={() => setSelectedPetition(petition)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-white leading-snug flex-1">{petition.title}</h3>
                <div className="flex items-center gap-2">
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
                  {canDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePetition(petition);
                      }}
                      disabled={deletingId === petition.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                      title="Delete your petition"
                      style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
                {petition.description}
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

              <div className="flex gap-2">
                {/* Sign button */}
                {petition.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSign(petition);
                    }}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: isSigned ? "rgba(34,197,94,0.15)" : "rgba(14,165,233,0.15)",
                      border: `1px solid ${isSigned ? "rgba(34,197,94,0.3)" : "rgba(14,165,233,0.3)"}`,
                      color: isSigned ? "#22C55E" : "#0EA5E9",
                    }}
                  >
                    {isSigned ? "✓ Signed" : "Sign Petition"}
                  </motion.button>
                )}
                {canDelete && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePetition(petition);
                    }}
                    disabled={deletingId === petition.id}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.34)", color: "#EF4444" }}
                  >
                    <Trash2 size={14} />
                    {deletingId === petition.id ? "Deleting..." : "Delete"}
                  </motion.button>
                )}
              </div>
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

      {/* Create Petition Modal */}
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
                border: "1px solid rgba(14,165,233,0.2)",
                boxShadow: "0 0 60px rgba(14,165,233,0.1)",
              }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                  Create New Petition
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
                    Petition Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Improve public transport in Selangor"
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
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <label className="text-xs font-semibold block" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Description *
                    </label>
                    <SpeechInputButton onTranscript={(text) => setFormDescription((current) => appendTranscript(current, text))} />
                  </div>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the issue and what you want the government to do..."
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

                {/* State + Category row */}
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
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: formCategory ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      <option value="" style={{ background: "#0A1023" }}>Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} style={{ background: "#0A1023" }}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target signatures */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Signature Target
                  </label>
                  <input
                    type="number"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    placeholder="1000"
                    min="100"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g., transport, public, safety"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitPetition}
                  disabled={saving}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                    boxShadow: "0 0 20px rgba(14,165,233,0.25)",
                  }}
                >
                  {saving ? "Creating..." : "Create Petition"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {selectedPetition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedPetition(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-2xl p-6"
              style={{
                background: "rgba(10,16,35,0.98)",
                border: "1px solid rgba(14,165,233,0.2)",
                boxShadow: "0 0 60px rgba(14,165,233,0.1)",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                    {selectedPetition.title}
                  </h2>
                  <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {selectedPetition.state} · {selectedPetition.category} · by {selectedPetition.author}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPetition(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
                {selectedPetition.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedPetition.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
              {user && isOwnPetition(selectedPetition, user) && (
                <button
                  type="button"
                  onClick={() => handleDeletePetition(selectedPetition)}
                  disabled={deletingId === selectedPetition.id}
                  className="mt-5 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                  <Trash2 size={14} />
                  {deletingId === selectedPetition.id ? "Deleting..." : "Delete Petition"}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function isOwnPetition(petition: Petition, user: { id: string; name: string; email: string }) {
  return petition.userId === user.id;
}
