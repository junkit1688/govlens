import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export interface GovLensUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface StoredAccount extends GovLensUser {
  passwordHash: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: GovLensUser | null;
  loading: boolean;
  isBackendConfigured: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  loginWithGitHub: () => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const ACCOUNTS_KEY = "govlens.accounts";
const SESSION_KEY = "govlens.session";

const AuthContext = createContext<AuthContextValue | null>(null);

function readAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]") as StoredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toPublicUser(account: StoredAccount): GovLensUser {
  const { passwordHash: _passwordHash, ...user } = account;
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GovLensUser | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) return;

      const account = readAccounts().find((item) => item.id === sessionId);
      if (account) setUser(toPublicUser(account));
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ? toGovLensUser(data.session.user) : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toGovLensUser(session.user) : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isBackendConfigured: isSupabaseConfigured,
    login: async (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) return { ok: false, error: error.message };
        if (data.user) setUser(toGovLensUser(data.user));
        return { ok: true };
      }

      const account = readAccounts().find((item) => item.email === normalizedEmail);
      if (!account) return { ok: false, error: "No account found with that email." };

      const passwordHash = await hashPassword(password);
      if (account.passwordHash !== passwordHash) {
        return { ok: false, error: "Incorrect password." };
      }

      localStorage.setItem(SESSION_KEY, account.id);
      setUser(toPublicUser(account));
      return { ok: true };
    },
    loginWithGitHub: async () => {
      if (!supabase) {
        return {
          ok: false,
          error: "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.",
        };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    register: async (name, email, password) => {
      const trimmedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();
      if (trimmedName.length < 2) return { ok: false, error: "Please enter your name." };
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return { ok: false, error: "Please enter a valid email." };
      if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: { name: trimmedName },
          },
        });

        if (error) return { ok: false, error: error.message };
        if (data.user) setUser(toGovLensUser(data.user));
        return { ok: true };
      }

      const accounts = readAccounts();
      if (accounts.some((item) => item.email === normalizedEmail)) {
        return { ok: false, error: "An account already exists with that email." };
      }

      const account: StoredAccount = {
        id: `usr-${Date.now()}`,
        name: trimmedName,
        email: normalizedEmail,
        createdAt: new Date().toLocaleDateString("en-MY", { year: "numeric", month: "short", day: "numeric" }),
        passwordHash: await hashPassword(password),
      };

      writeAccounts([account, ...accounts]);
      localStorage.setItem(SESSION_KEY, account.id);
      setUser(toPublicUser(account));
      return { ok: true };
    },
    logout: async () => {
      if (supabase) await supabase.auth.signOut();
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

function toGovLensUser(user: User): GovLensUser {
  const metadataName = user.user_metadata?.name || user.user_metadata?.full_name || user.user_metadata?.user_name;
  const name = typeof metadataName === "string"
    ? metadataName
    : user.email?.split("@")[0] || "GovLens user";

  return {
    id: user.id,
    name,
    email: user.email || "",
    createdAt: new Date(user.created_at).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}
