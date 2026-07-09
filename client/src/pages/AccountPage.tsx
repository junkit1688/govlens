import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, FileText, LogOut, MessageSquare, ShieldCheck, TriangleAlert, Vote } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const actionItems = [
  { icon: FileText, label: "Create petitions", href: "/petitions", color: "#0EA5E9" },
  { icon: Vote, label: "Vote on issues", href: "/voting", color: "#22C55E" },
  { icon: MessageSquare, label: "Join forum", href: "/forum", color: "#F59E0B" },
  { icon: TriangleAlert, label: "Submit reports", href: "/reports", color: "#EF4444" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="p-6 space-y-6" style={{ minHeight: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            My Account
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Manage your GovLens civic profile
          </p>
        </div>
        <button
          onClick={() => {
            void logout();
            toast.success("Signed out.");
            navigate("/");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)", color: "#FCA5A5" }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.24)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #0EA5E9, #22C55E 52%, #FACC15)", fontFamily: "Syne, sans-serif" }}
            >
              {initials(user.name)}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{user.name}</h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.52)" }}>{user.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(6,11,24,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-xs font-semibold uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Member since</div>
              <div className="mt-1 text-white font-bold">{user.createdAt}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)" }}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#BBF7D0" }}>
                <ShieldCheck size={16} /> Local prototype account
              </div>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
                This profile is saved in this browser for demo use. It can later connect to a real secure backend.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2 className="text-xl font-extrabold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Continue as {user.name.split(" ")[0]}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {actionItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="rounded-xl p-4 h-full transition-transform hover:-translate-y-1" style={{ background: "rgba(6,11,24,0.55)", border: `1px solid ${item.color}33` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}1f` }}>
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-white">{item.label}</span>
                    <ArrowRight size={16} style={{ color: item.color }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
