/* GovLens Landing Page — Glassmorphic Civic Premium
 * Hero section, feature showcase, SDG highlights, CTA
 * Dark navy + teal/indigo gradient, Syne headings, DM Sans body
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Eye,
  Map,
  FileText,
  Vote,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Shield,
  BarChart3,
  Globe,
  ChevronRight,
  MapPin,
  Radio,
  Flag,
  Activity,
} from "lucide-react";
import { MALAYSIA_STATES } from "@/lib/malaysiaPaths";

const features = [
  {
    icon: Map,
    title: "Interactive Spending Map",
    description: "Explore government budget allocations across all 16 Malaysian states with our custom interactive map.",
    href: "/map",
    color: "#0EA5E9",
  },
  {
    icon: FileText,
    title: "Citizen Petitions",
    description: "Create and sign petitions for community issues. Track progress and rally support from fellow Malaysians.",
    href: "/petitions",
    color: "#6366F1",
  },
  {
    icon: Vote,
    title: "Public Voting",
    description: "Vote on government initiatives and community proposals. Make your voice count in shaping Malaysia.",
    href: "/voting",
    color: "#22C55E",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Discuss public issues, share insights, and engage with fellow citizens on matters that affect your community.",
    href: "/forum",
    color: "#F59E0B",
  },
  {
    icon: AlertTriangle,
    title: "Citizen Reporting",
    description: "Report infrastructure issues like potholes, broken streetlights, and sanitation problems directly to authorities.",
    href: "/reports",
    color: "#EC4899",
  },
  {
    icon: BarChart3,
    title: "Spending Analytics",
    description: "Deep-dive into state-level spending data with interactive charts, timelines, and project breakdowns.",
    href: "/map",
    color: "#14B8A6",
  },
];

const sdgItems = [
  {
    number: "11",
    title: "Sustainable Cities",
    description: "Making cities inclusive, safe, resilient and sustainable through transparent governance.",
    color: "#F59E0B",
  },
  {
    number: "16",
    title: "Peace & Justice",
    description: "Promoting peaceful, inclusive societies and accountable institutions at all levels.",
    color: "#0EA5E9",
  },
];

const liveSignals = [
  { state: "Kuala Lumpur", label: "Pothole report", value: "42 new", x: 104, y: 318, color: "#FACC15" },
  { state: "Selangor", label: "Transit petition", value: "12.4k signed", x: 89, y: 294, color: "#0EA5E9" },
  { state: "Penang", label: "Waste vote", value: "10.5k votes", x: 76, y: 213, color: "#EF4444" },
  { state: "Sabah", label: "Rural roads", value: "RM8.9B", x: 790, y: 137, color: "#22C55E" },
  { state: "Sarawak", label: "Forest watch", value: "31.2k signed", x: 606, y: 374, color: "#6366F1" },
];

const heroActivity = [
  { icon: Radio, label: "Live reports", value: "28,450", color: "#FACC15" },
  { icon: Flag, label: "Active petitions", value: "312", color: "#EF4444" },
  { icon: Activity, label: "State dashboards", value: "16", color: "#0EA5E9" },
];

const heroStateColors: Record<string, string> = {
  selangor: "#0EA5E9",
  "kuala-lumpur": "#FACC15",
  penang: "#EF4444",
  sabah: "#22C55E",
  sarawak: "#6366F1",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#060B18", fontFamily: "DM Sans, sans-serif" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
        style={{
          background: "rgba(6, 11, 24, 0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
              boxShadow: "0 0 16px rgba(14,165,233,0.4)",
            }}
          >
            <Eye size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl" style={{ fontFamily: "Syne, sans-serif" }}>
            Gov<span style={{ color: "#0EA5E9" }}>Lens</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Map", href: "/map" },
            { label: "Petitions", href: "/petitions" },
            { label: "Forum", href: "/forum" },
            { label: "Reports", href: "/reports" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0EA5E9")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <Link href="/map">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
              boxShadow: "0 0 20px rgba(14,165,233,0.3)",
            }}
          >
            Explore Map <ArrowRight size={14} />
          </motion.button>
        </Link>
      </nav>

      {/* Hero */}
      <section
        className="relative min-h-screen overflow-hidden"
        style={{
          paddingTop: "4rem",
          background:
            "radial-gradient(circle at 18% 18%, rgba(14,165,233,0.22), transparent 28%), radial-gradient(circle at 78% 20%, rgba(250,204,21,0.14), transparent 24%), radial-gradient(circle at 80% 82%, rgba(239,68,68,0.13), transparent 30%), #050A16",
        }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-10%] top-20 h-24"
          animate={{ x: ["-4%", "4%", "-4%"] }}
          transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.24) 18%, rgba(255,255,255,0.10) 42%, rgba(14,165,233,0.22) 62%, rgba(250,204,21,0.24) 82%, transparent 100%)",
            filter: "blur(26px)",
            transform: "rotate(-7deg)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(circle at center, black 0%, transparent 74%)",
          }}
        />

        <div className="relative z-10 container max-w-7xl mx-auto px-6 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-[0.95fr_1.15fr] gap-10 lg:gap-14 items-center w-full py-16">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" as const }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(250,204,21,0.28)" }}>
                <Globe size={14} style={{ color: "#FACC15" }} />
                <span className="text-xs font-semibold" style={{ color: "#F8FAFC" }}>Malaysia civic transparency, live on the map</span>
              </div>

              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[0.95]"
                style={{
                  fontFamily: "Syne, sans-serif",
                  textShadow: "0 18px 42px rgba(0,0,0,0.45), 0 0 38px rgba(14,165,233,0.18)",
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              >
                Malaysia's
                <br />
                public spending,
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #FACC15 0%, #FFFFFF 36%, #0EA5E9 70%, #6366F1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  made visible.
                </span>
              </motion.h1>

              <p
                className="text-base md:text-lg max-w-xl mt-7 mb-8 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                Follow state budgets, citizen reports, petitions, and public votes in one civic dashboard built around Malaysia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/map">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(14,165,233,0.44)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, #0EA5E9, #2563EB 55%, #6366F1)",
                      boxShadow: "0 0 24px rgba(14,165,233,0.34)",
                    }}
                  >
                    <Map size={18} />
                    Explore Malaysia Map
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
                <Link href="/reports">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(250,204,21,0.24)",
                      color: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <MapPin size={18} />
                    View Live Reports
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl">
                {heroActivity.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.1 }}
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon size={15} style={{ color: item.color }} />
                      <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.52)" }}>{item.label}</span>
                    </div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" as const }}
              className="relative"
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="relative rounded-[2rem] p-4 sm:p-6"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 30px 90px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.08)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#FACC15" }}>Live civic map</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1" style={{ fontFamily: "Syne, sans-serif" }}>
                      Malaysia activity layer
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.24)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: "#22C55E", boxShadow: "0 0 12px #22C55E" }} />
                    <span className="text-xs font-semibold" style={{ color: "#BBF7D0" }}>updating</span>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl" style={{ background: "rgba(3,7,18,0.62)", border: "1px solid rgba(14,165,233,0.13)" }}>
                  <svg viewBox="0 0 900 500" className="w-full block" style={{ minHeight: 310 }}>
                    <defs>
                      <radialGradient id="homeMapGlow" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="rgba(14,165,233,0.24)" />
                        <stop offset="100%" stopColor="rgba(14,165,233,0)" />
                      </radialGradient>
                      <filter id="homePinGlow">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <rect width="900" height="500" fill="url(#homeMapGlow)" opacity="0.65" />
                    <path d="M82 314 C230 150, 455 166, 636 340 S826 286, 862 124" fill="none" stroke="rgba(250,204,21,0.22)" strokeWidth="2" strokeDasharray="10 16" />
                    <path d="M92 284 C260 390, 408 420, 604 374 S728 220, 792 137" fill="none" stroke="rgba(239,68,68,0.18)" strokeWidth="2" strokeDasharray="4 14" />

                    {MALAYSIA_STATES.map((state, i) => {
                      const color = heroStateColors[state.id] || "#0EA5E9";
                      const highlighted = Boolean(heroStateColors[state.id]);
                      return (
                        <motion.path
                          key={state.id}
                          d={state.path}
                          fill={highlighted ? `${color}72` : "rgba(14,165,233,0.18)"}
                          stroke={highlighted ? color : "rgba(148,163,184,0.35)"}
                          strokeWidth={highlighted ? 1.3 : 0.7}
                          animate={{
                            opacity: highlighted ? [0.78, 1, 0.78] : 0.42,
                          }}
                          transition={{ repeat: Infinity, duration: 3.2 + (i % 4) * 0.35, delay: i * 0.04 }}
                        />
                      );
                    })}

                    {liveSignals.map((signal, i) => (
                      <g key={signal.state}>
                        <motion.circle
                          cx={signal.x}
                          cy={signal.y}
                          r="18"
                          fill={signal.color}
                          opacity="0.15"
                          filter="url(#homePinGlow)"
                          animate={{ scale: [0.6, 1.7, 0.6], opacity: [0.2, 0, 0.2] }}
                          transition={{ repeat: Infinity, duration: 2.7, delay: i * 0.34 }}
                        />
                        <motion.circle
                          cx={signal.x}
                          cy={signal.y}
                          r="5"
                          fill={signal.color}
                          animate={{ r: [4, 7, 4] }}
                          transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.25 }}
                        />
                      </g>
                    ))}
                  </svg>

                  {liveSignals.map((signal, i) => (
                    <motion.div
                      key={signal.label}
                      className="absolute hidden sm:block rounded-xl px-3 py-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: [0, -8, 0] }}
                      transition={{ opacity: { delay: 0.5 + i * 0.12 }, y: { repeat: Infinity, duration: 4 + i * 0.35, ease: "easeInOut" } }}
                      style={{
                        left: `${[7, 18, 12, 72, 54][i]}%`,
                        top: `${[55, 68, 34, 24, 70][i]}%`,
                        background: "rgba(6,11,24,0.84)",
                        border: `1px solid ${signal.color}55`,
                        boxShadow: `0 16px 36px rgba(0,0,0,0.26), 0 0 18px ${signal.color}20`,
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <div className="text-[10px] font-semibold uppercase" style={{ color: signal.color }}>{signal.state}</div>
                      <div className="text-xs text-white mt-0.5">{signal.label}</div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{signal.value}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2" style={{ borderColor: "rgba(255,255,255,0.22)" }}>
            <div className="w-1 h-2 rounded-full" style={{ background: "#FACC15" }} />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 relative" style={{ background: "rgba(6,11,24,0.98)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.05) 0%, transparent 60%)",
          }}
        />
        <div className="container max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <Shield size={14} style={{ color: "#6366F1" }} />
              <span className="text-xs font-semibold" style={{ color: "#6366F1" }}>Platform Features</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Everything You Need for
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Civic Engagement
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              A comprehensive platform for government transparency, community participation, and citizen empowerment.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Link href={feature.href}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="h-full rounded-2xl p-6 cursor-pointer group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(12px)",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${feature.color}44`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 32px ${feature.color}12`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${feature.color}18` }}
                    >
                      <feature.icon size={22} style={{ color: feature.color }} />
                    </div>
                    <h3
                      className="text-lg font-bold text-white mb-2"
                      style={{ fontFamily: "Syne, sans-serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: feature.color }}>
                      Explore <ChevronRight size={14} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SDG Section */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.06) 0%, transparent 50%), #060B18",
          }}
        />
        <div className="container max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-extrabold text-white mb-4"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Aligned with UN Sustainable
              <br />
              Development Goals
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              GovLens directly supports Malaysia's commitment to the 2030 Agenda for Sustainable Development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sdgItems.map((sdg, i) => (
              <motion.div
                key={sdg.number}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="rounded-2xl p-8 flex gap-6 items-start"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${sdg.color}33`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-extrabold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${sdg.color}33, ${sdg.color}11)`,
                    border: `2px solid ${sdg.color}44`,
                    fontFamily: "Syne, sans-serif",
                    color: sdg.color,
                  }}
                >
                  {sdg.number}
                </div>
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: sdg.color }}>
                    SDG {sdg.number}
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {sdg.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {sdg.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(99,102,241,0.08) 100%), #060B18",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: "1px solid rgba(14,165,233,0.1)",
            margin: "2rem",
            borderRadius: "2rem",
          }}
        />
        <div className="container max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-6"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Ready to Explore Malaysia's
              <br />
              Government Spending?
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
              Start with the interactive map and discover how your state's budget is being allocated.
            </p>
            <Link href="/map">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(14,165,233,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                  boxShadow: "0 0 30px rgba(14,165,233,0.3)",
                }}
              >
                <Map size={22} />
                Open Interactive Map
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 text-center"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.8rem",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}
          >
            <Eye size={10} className="text-white" />
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
            GovLens
          </span>
        </div>
        <p>© 2025 GovLens — Malaysia Government Transparency Platform. HCI Prototype &amp; Portfolio Demonstration.</p>
        <p className="mt-1">All data shown is mock/simulated for demonstration purposes only.</p>
      </footer>
    </div>
  );
}
