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
  Users,
  Globe,
  ChevronRight,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { nationalStats } from "@/lib/mockData";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663646625067/ihHM7ZDmrkLrYL33x6xYVd/govlens-hero-bg-hFCJdLTv6nXD7UEtc9S3hR.webp";

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

const statsItems = [
  { label: "Total National Budget", value: `RM${(nationalStats.totalBudget / 1000).toFixed(1)}B`, icon: TrendingUp, color: "#0EA5E9" },
  { label: "Active Projects", value: nationalStats.activeProjects.toLocaleString(), icon: CheckCircle, color: "#22C55E" },
  { label: "Citizen Reports", value: nationalStats.citizenReports.toLocaleString(), icon: Users, color: "#6366F1" },
  { label: "Active Petitions", value: nationalStats.activePetitions.toString(), icon: FileText, color: "#F59E0B" },
];

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
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          paddingTop: "4rem",
          background: "#060B18",
        }}
      >
        {/* Hero background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(14,165,233,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(99,102,241,0.12) 0%, transparent 55%), linear-gradient(to bottom, rgba(6,11,24,0.3) 0%, rgba(6,11,24,0.8) 100%)",
          }}
        />

        <div className="relative z-10 container text-center max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.25)" }}>
              <Globe size={14} style={{ color: "#0EA5E9" }} />
              <span className="text-xs font-semibold" style={{ color: "#0EA5E9" }}>Malaysia Government Transparency Platform</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              See Through{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Government
              </span>
              <br />
              Spending
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              GovLens empowers Malaysian citizens with real-time visibility into public spending,
              enabling community engagement, transparent governance, and civic participation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/map">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(14,165,233,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #0EA5E9, #6366F1)",
                    boxShadow: "0 0 24px rgba(14,165,233,0.3)",
                  }}
                >
                  <Map size={18} />
                  Explore Spending Map
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link href="/petitions">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <FileText size={18} />
                  View Petitions
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {statsItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${stat.color}22` }}
                >
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
                <div className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
            <div className="w-1 h-2 rounded-full" style={{ background: "#0EA5E9" }} />
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
