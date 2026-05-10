/* ForumPage — GovLens Community Forum
 * Discussion boards, trending topics, community cards
 * Glassmorphic Civic Premium design
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, TrendingUp, Heart, Eye, Reply, MapPin, Tag, Flame } from "lucide-react";
import { forumPosts } from "@/lib/mockData";
import { toast } from "sonner";

const CATEGORIES = ["All", "Transportation", "Infrastructure", "Healthcare", "Environment", "Agriculture", "Community", "Utilities"];

export default function ForumPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const filtered = forumPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.state.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const trending = forumPosts.filter((p) => p.trending);

  const handleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success("Post liked!");
      }
      return next;
    });
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
          onClick={() => toast.info("Post creation coming soon!")}
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
          { label: "Total Posts", value: forumPosts.length, icon: MessageSquare, color: "#0EA5E9" },
          { label: "Trending", value: trending.length, icon: Flame, color: "#F59E0B" },
          { label: "Total Views", value: forumPosts.reduce((a, p) => a + p.views, 0).toLocaleString(), icon: Eye, color: "#6366F1" },
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
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
          <Flame size={14} style={{ color: "#F59E0B" }} /> Trending Topics
        </h3>
        <div className="flex gap-2 flex-wrap">
          {trending.map((post) => (
            <span
              key={post.id}
              className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                color: "#F59E0B",
              }}
            >
              🔥 {post.title.slice(0, 40)}...
            </span>
          ))}
        </div>
      </div>

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
                    {post.content.slice(0, 140)}...
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
                      {post.likes + (isLiked ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => toast.info("Replies coming soon!")}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      <Reply size={13} />
                      {post.replies}
                    </button>
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
    </div>
  );
}
