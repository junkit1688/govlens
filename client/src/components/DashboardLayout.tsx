/* DashboardLayout — GovLens Main Layout
 * Fixed left sidebar (64px collapsed / 240px expanded) + top bar + main content
 * Dark navy background with glass sidebar
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
  const [location] = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
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
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg"
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
                className="bg-transparent text-sm outline-none flex-1"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "DM Sans, sans-serif" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}
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

            {/* Avatar/Account */}
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                fontFamily: "Syne, sans-serif",
              }}
            >
              R
            </button>
          </div>
        </header>

        {/* Notification Panel */}
        <AnimatePresence>
          {notificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-6 w-80 rounded-2xl p-4 z-50"
              style={{
                background: "rgba(10, 16, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Notifications</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="p-3 rounded-lg" style={{ background: "rgba(14,165,233,0.1)", borderLeft: "3px solid #0EA5E9" }}>
                  <p className="text-xs font-semibold text-white">New petition reached 500 signatures</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>5 minutes ago</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", borderLeft: "3px solid #22C55E" }}>
                  <p className="text-xs font-semibold text-white">Your report status updated to Investigating</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>2 hours ago</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(99,102,241,0.1)", borderLeft: "3px solid #6366F1" }}>
                  <p className="text-xs font-semibold text-white">New reply to your forum post</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>1 day ago</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Panel */}
        <AnimatePresence>
          {accountOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-6 w-64 rounded-2xl p-4 z-50"
              style={{
                background: "rgba(10, 16, 35, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}>R</div>
                <div>
                  <p className="text-sm font-semibold text-white">Rajeev Kumar</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Citizen</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>👤 My Profile</button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>⭐ My Petitions</button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>📝 My Reports</button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>⚙️ Settings</button>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "8px", paddingTop: "8px" }}>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all" style={{ color: "#EF4444" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>🚪 Logout</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
