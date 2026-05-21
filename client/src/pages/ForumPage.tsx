/* ForumPage — Community Discussion Boards
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
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            Discuss government decisions with fellow citizens
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
          <Plus size={18} /> New Post
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Posts", value: allPosts.length },
          { label: "Total Views", value: allPosts.reduce((sum, p) => sum + p.views, 0) },
          { label: "Active Discussions", value: allPosts.filter((p) => p.replies > 0).length },
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
            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
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
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Flame size={18} style={{ color: "#F59E0B" }} />
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Trending Discussions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trending.slice(0, 2).map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPost(post)}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,165,0,0.3)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{post.title}</p>
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>{post.content}</p>
                  </div>
                  <Flame size={16} style={{ color: "#F59E0B", flexShrink: 0 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
          {category === "All" ? "All Posts" : `${category} Posts`}
        </h2>
        {filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.4)" }}>
            <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
            <p>No posts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedPost(post)}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">{post.title}</p>
                    <p className="text-sm mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>{post.content}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.2)", color: "#A5B4FC" }}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <MapPin size={12} /> {post.state}
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>by {post.author} · {post.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Eye size={12} /> {post.views}
                      </div>
                      <div className="flex items-center gap-1 justify-end text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Reply size={12} /> {post.replies}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        background: liked.has(post.id) ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
                        color: liked.has(post.id) ? "#EF4444" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      <Heart size={16} fill={liked.has(post.id) ? "#EF4444" : "none"} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Post Form Dialog */}
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
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Create New Post</h3>
                <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Post title"
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
                placeholder="Post content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg outline-none text-sm resize-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />

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

              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                <option value="">Select category</option>
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
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
                  onClick={handleSubmitPost}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                  }}
                >
                  Publish Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSelectedPost(null)}
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
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{selectedPost.title}</h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.2)", color: "#A5B4FC" }}>
                      {selectedPost.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <MapPin size={12} /> {selectedPost.state}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-white/50 hover:text-white flex-shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}>
                  {selectedPost.author[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedPost.author}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{selectedPost.createdAt}</p>
                </div>
              </div>

              <p className="text-white mb-4" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", lineHeight: "1.6" }}>
                {selectedPost.content}
              </p>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Eye size={16} /> {selectedPost.views} views
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Reply size={16} /> {selectedPost.replies} replies
                </div>
                <button
                  onClick={() => {
                    handleLike(selectedPost.id);
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-2 text-sm px-3 py-1 rounded-lg transition-all"
                  style={{
                    background: liked.has(selectedPost.id) ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
                    color: liked.has(selectedPost.id) ? "#EF4444" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <Heart size={16} fill={liked.has(selectedPost.id) ? "#EF4444" : "none"} />
                  {selectedPost.likes} likes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
