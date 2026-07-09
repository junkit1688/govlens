import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Github, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AuthPageProps {
  mode: "login" | "register";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { user, login, loginWithGitHub, register } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  useEffect(() => {
    if (user) navigate("/account");
  }, [navigate, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = isRegister
      ? await register(name, email, password)
      : await login(email, password);
    setBusy(false);

    if (!result.ok) {
      toast.error(result.error || "Unable to continue.");
      return;
    }

    if (result.needsEmailConfirmation) {
      toast.success(result.message || "Account created. Please confirm your email before logging in.");
      navigate("/login");
      return;
    }

    toast.success(result.message || (isRegister ? "Account created. Welcome to GovLens." : "Welcome back."));
    navigate("/account");
  };

  const handleGitHubLogin = async () => {
    setBusy(true);
    const result = await loginWithGitHub();
    setBusy(false);

    if (!result.ok) {
      toast.error(result.error || "Unable to continue with GitHub.");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: "#050A16", fontFamily: "DM Sans, sans-serif" }}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(14,165,233,0.22), transparent 28%), radial-gradient(circle at 82% 22%, rgba(250,204,21,0.13), transparent 26%), radial-gradient(circle at 74% 78%, rgba(99,102,241,0.18), transparent 32%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <nav className="relative z-10 h-16 px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0EA5E9, #22C55E 48%, #F59E0B)", boxShadow: "0 0 24px rgba(14,165,233,0.35)" }}
            >
              <Eye size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl" style={{ fontFamily: "Syne, sans-serif" }}>
              Gov<span style={{ color: "#0EA5E9" }}>Lens</span>
            </span>
          </div>
        </Link>
        <Link href="/">
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.62)" }}>Back home</span>
        </Link>
      </nav>

      <main className="relative z-10 min-h-[calc(100vh-4rem)] grid lg:grid-cols-[0.9fr_1fr] gap-10 items-center max-w-6xl mx-auto px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(250,204,21,0.24)" }}>
            <Lock size={14} style={{ color: "#FACC15" }} />
            <span className="text-xs font-semibold text-white">Personal civic workspace</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Your GovLens
            <br />
            account keeps your
            <br />
            civic actions together.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.64)" }}>
            Sign petitions, create forum posts, and submit citizen reports under your own profile.
          </p>
        </motion.section>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-[2rem] p-6 sm:p-8"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035))",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)",
            backdropFilter: "blur(22px)",
          }}
        >
          <div className="mb-7">
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              {isRegister ? "Create account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.52)" }}>
              {isRegister ? "Use Supabase Auth to create your GovLens account." : "Log in with your Supabase account."}
            </p>
          </div>

          <div className="space-y-4">
            {isRegister && (
              <label className="block">
                <span className="text-xs font-semibold uppercase" style={{ color: "rgba(255,255,255,0.48)" }}>Full name</span>
                <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(6,11,24,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <UserRound size={17} style={{ color: "#0EA5E9" }} />
                  <input value={name} onChange={(event) => setName(event.target.value)} className="w-full bg-transparent outline-none text-white" placeholder="Your name" />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-xs font-semibold uppercase" style={{ color: "rgba(255,255,255,0.48)" }}>Email</span>
              <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(6,11,24,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Mail size={17} style={{ color: "#0EA5E9" }} />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full bg-transparent outline-none text-white" placeholder="you@example.com" />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase" style={{ color: "rgba(255,255,255,0.48)" }}>Password</span>
              <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(6,11,24,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Lock size={17} style={{ color: "#0EA5E9" }} />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full bg-transparent outline-none text-white" placeholder={isRegister ? "At least 8 characters" : "Your password"} />
              </div>
            </label>
          </div>

          <button
            disabled={busy}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #0EA5E9, #2563EB 55%, #6366F1)", boxShadow: "0 0 26px rgba(14,165,233,0.3)" }}
          >
            {busy ? "Please wait..." : isRegister ? "Create account" : "Log in"}
            {!busy && <ArrowRight size={17} />}
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-semibold uppercase" style={{ color: "rgba(255,255,255,0.38)" }}>
              or
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold disabled:opacity-60"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <Github size={17} />
            Continue with GitHub
          </button>

          <p className="mt-5 text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            {isRegister ? "Already have an account?" : "New to GovLens?"}{" "}
            <Link href={isRegister ? "/login" : "/register"}>
              <span className="font-bold" style={{ color: "#FACC15" }}>{isRegister ? "Log in" : "Create one"}</span>
            </Link>
          </p>

          <p className="mt-4 text-xs leading-relaxed text-center" style={{ color: "rgba(255,255,255,0.36)" }}>
            GovLens uses secure Supabase authentication for email and GitHub sign-in.
          </p>
        </motion.form>
      </main>
    </div>
  );
}
