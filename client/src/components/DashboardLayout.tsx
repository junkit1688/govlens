/* DashboardLayout — GovLens Glassmorphic Civic Premium
 * Fixed left sidebar (64px collapsed / 240px expanded) + top bar + main content
 * Dark navy background with glass sidebar
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Map,
  FileText,
  Vote,
  MessageSquare,
  AlertTriangle,
  Home,
  ChevronLeft,
  ChevronRight,
  Eye,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { statesData } from "@/lib/mockData";

const navItems = [
  { icon: Map, label: "Spending Map", href: "/map" },
  { icon: FileText, label: "Petitions", href: "/petitions" },
  { icon: Vote, label: "Voting", href: "/voting" },
  { icon: MessageSquare, label: "Forum", href: "/forum" },
  { icon: AlertTriangle, label: "Reports", href: "/reports" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [location, navigate] = useLocation();

  const searchItems = [
    ...navItems,
    ...Object.values(statesData).map((state) => ({
      icon: Map,
      label: state.name,
      href: `/state/${state.id}`,
    })),
  ];
  const searchResults = search.trim()
    ? searchItems
        .filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060B18" }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-shrink-0 flex flex-col h-full z-30"
        style={{
          background: "rgba(10, 16, 35, 0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                boxShadow: "0 0 16px rgba(14,165,233,0.4)",
              }}
            >
              <Eye size={16} className="text-white" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span
                    className="font-bold text-white text-lg"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    Gov<span style={{ color: "#0EA5E9" }}>Lens</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {/* Home */}
          <Link href="/">
            <div
              className={`nav-item ${location === "/" ? "active" : ""}`}
              title="Home"
            >
              <Home size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Home
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          <div className="my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`nav-item ${location === item.href || location.startsWith(item.href + "/") ? "active" : ""}`}
                title={item.label}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
            }}
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-6 flex-shrink-0 z-20"
          style={{
            background: "rgba(6, 11, 24, 0.8)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "rgba(255,255,255,0.6)" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            {/* Search bar */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg relative"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: 220,
              }}
            >
              <Search size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
              <input
                type="text"
                placeholder="Search states, projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults[0]) {
                    navigate(searchResults[0].href);
                    setSearch("");
                  }
                }}
                className="bg-transparent text-sm outline-none flex-1"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "DM Sans, sans-serif" }}
              />
              {searchResults.length > 0 && (
                <div
                  className="absolute top-11 left-0 right-0 rounded-xl overflow-hidden z-50"
                  style={{
                    background: "rgba(10,16,35,0.98)",
                    border: "1px solid rgba(14,165,233,0.2)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                  }}
                >
                  {searchResults.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                        onClick={() => setSearch("")}
                      >
                        <item.icon size={14} style={{ color: "#0EA5E9" }} />
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              className="relative p-2 rounded-lg transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={() => {
                setNotificationsOpen((open) => !open);
                if (!notificationsOpen) toast.info("Showing latest civic updates.");
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#0EA5E9" }}
              />
            </button>
            {notificationsOpen && (
              <div
                className="absolute top-14 right-14 w-72 rounded-xl p-3 z-50"
                style={{
                  background: "rgba(10,16,35,0.98)",
                  border: "1px solid rgba(14,165,233,0.2)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                }}
              >
                {[
                  "New budget updates added for Selangor.",
                  "3 citizen reports moved to investigating.",
                  "Public voting closes soon for active initiatives.",
                ].map((message) => (
                  <div
                    key={message}
                    className="py-2 text-xs"
                    style={{ color: "rgba(255,255,255,0.65)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {message}
                  </div>
                ))}
              </div>
            )}

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                fontFamily: "Syne, sans-serif",
              }}
            >
              R
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
