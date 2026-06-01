/* ForumPage — GovLens Community Forum
 * Discussion boards, trending topics, community cards
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, TrendingUp, Heart, Eye, Reply, MapPin, Tag, Flame, Plus, X } from "lucide-react";
import { forumPosts as initialPosts, type ForumPost } from "@/lib/mockData";
import { toast } from "sonner";

const CATEGORIES = ["All", "Transportation", "Infrastructure", "Healthcare", "Environment", "Agriculture", "Community", "Utilities"];

const STATES = [
  "Selangor", "Johor", "Penang", "Perak", "Sabah", "Sarawak", "Kedah",
  "Kelantan", "Pahang", "Terengganu", "Negeri Sembilan", "Malacca",
  "Perlis", "Kuala Lumpur", "Putrajaya", "Labuan"
];

export default function ForumPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [allPosts, setAllPosts] = useState<ForumPost[]>(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formState, setFormState] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTags, setFormTags] = useState("");

  const filtered = allPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.state.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const trending = allPosts.filter((p) => p.trending);

  const handleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setAllPosts((posts) => posts.map((p) => p.id === id ? { ...p, likes: p.likes - 1 } : p));
      } else {
        next.add(id);
        setAllPosts((posts) => posts.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
        toast.success("Post liked!");
      }
      return next;
    });
  };

  const handleSubmitPost = () => {
    if (!formTitle.trim()) { toast.error("Please enter a post title."); return; }
    if (!formContent.trim()) { toast.error("Please enter post content."); return; }
    if (!formState) { toast.error("Please select a state."); return; }
    if (!formCategory) { toast.error("Please select a category."); return; }

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: formTitle.trim(),
      content: formContent.trim(),
      author: "You",
      state: formState,
      category: formCategory,
      likes: 0,
      replies: 0,
      views: 1,
      createdAt: "Just now",
      tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
      trending: false,
    };

    setAllPosts((prev) => [newPost, ...prev]);
    toast.success("Post published! Your discussion is now live.");

    // Reset form
    setFormTitle("");
    setFormContent("");
    setFormState("");
    setFormCategory("");
    setFormTags("");
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
            Community Forum
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Discuss public issues and engage with fellow citizens
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
            boxShadow: "0 0 20px rgba(14,165,233,0.25)",
          }}
        >
          <MessageSquare size={16} /> New Post
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
          { label: "Total Posts", value: allPosts.length, icon: MessageSquare, color: "#0EA5E9" },
          { label: "Trending", value: trending.length, icon: Flame, color: "#F59E0B" },
          { label: "Total Views", value: allPosts.reduce((a, p) => a + p.views, 0).toLocaleString(), icon: Eye, color: "#6366F1" },
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

      {/* Trending topics */}
      {trending.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
            <Flame size={14} style={{ color: "#F59E0B" }} /> Trending Topics
          </h3>
          <div className="flex gap-2 flex-wrap">
            {trending.map((post) => (
              <span
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all duration-200"
                style={{
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#F59E0B",
                }}
              >
                🔥 {post.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search + category filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: category === cat ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${category === cat ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.07)"}`,
              color: category === cat ? "#0EA5E9" : "rgba(255,255,255,0.5)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Forum posts */}
      <div className="space-y-4">
        {filtered.map((post, i) => {
          const isLiked = liked.has(post.id);
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
              onClick={() => setSelectedPost(post)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.2)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, #0EA5E9, #6366F1)`,
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {post.author[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white leading-snug">{post.title}</h3>
                    {post.trending && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}>
                        🔥 Trending
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed mt-1 mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <MapPin size={11} /> {post.state}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <Tag size={11} /> {post.category}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      by {post.author} · {post.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className="flex items-center gap-1.5 text-xs transition-all duration-200"
                      style={{ color: isLiked ? "#EC4899" : "rgba(255,255,255,0.4)" }}
                    >
                      <Heart size={13} fill={isLiked ? "#EC4899" : "none"} />
                      {post.likes}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <Reply size={13} />
                      {post.replies}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <Eye size={13} />
                      {post.views.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.3)" }}>
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No posts found matching your search.</p>
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedPost(null); }}
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
                    {selectedPost.title}
                  </h2>
                  <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                    by {selectedPost.author} · {selectedPost.state} · {selectedPost.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
                {selectedPost.content}
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
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
                  Create New Post
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
                    Post Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Discussion on new MRT line proposal"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Content *
                  </label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Share your thoughts, questions, or ideas with the community..."
                    rows={5}
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
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c} style={{ background: "#0A1023" }}>{c}</option>
                      ))}
                    </select>
                  </div>
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
                    placeholder="e.g., transport, mrt, public"
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
                  onClick={handleSubmitPost}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                    boxShadow: "0 0 20px rgba(14,165,233,0.25)",
                  }}
                >
                  Publish Post
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
