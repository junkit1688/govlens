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
  message?: string;
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

async function upsertDemoAccount(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  const existingIndex = accounts.findIndex((item) => item.email === normalizedEmail);
  const passwordHash = await hashPassword(password);
  const account: StoredAccount = {
    id: existingIndex >= 0 ? accounts[existingIndex].id : `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    createdAt: existingIndex >= 0
      ? accounts[existingIndex].createdAt
      : new Date().toLocaleDateString("en-MY", { year: "numeric", month: "short", day: "numeric" }),
    passwordHash,
  };

  const nextAccounts = existingIndex >= 0
    ? accounts.map((item, index) => index === existingIndex ? account : item)
    : [account, ...accounts];

  writeAccounts(nextAccounts);
  return account;
}

async function findDemoAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === normalizedEmail);
  if (!account) return null;

  const passwordHash = await hashPassword(password);
  return account.passwordHash === passwordHash ? account : null;
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

      const demoAccount = await findDemoAccount(normalizedEmail, password);

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error && demoAccount) {
          localStorage.setItem(SESSION_KEY, demoAccount.id);
          setUser(toPublicUser(demoAccount));
          return { ok: true, message: "Signed in with your demo account." };
        }

        if (error) return { ok: false, error: getFriendlyAuthError(error.message) };
        if (!data.session || !data.user) {
          if (demoAccount) {
            localStorage.setItem(SESSION_KEY, demoAccount.id);
            setUser(toPublicUser(demoAccount));
            return { ok: true, message: "Signed in with your demo account." };
          }

          return { ok: false, error: "No active login session was returned. Please try again." };
        }

        setUser(toGovLensUser(data.user));
        return { ok: true };
      }

      if (!demoAccount) return { ok: false, error: "No demo account found with that email and password." };

      localStorage.setItem(SESSION_KEY, demoAccount.id);
      setUser(toPublicUser(demoAccount));
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
        const demoAccount = await upsertDemoAccount(trimmedName, normalizedEmail, password);
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: { name: trimmedName },
          },
        });

        if (error && !isDemoSafeSignupError(error.message)) {
          return { ok: false, error: getFriendlyAuthError(error.message) };
        }

        localStorage.setItem(SESSION_KEY, demoAccount.id);
        setUser(toPublicUser(demoAccount));

        if (data.session && data.user) {
          setUser(toGovLensUser(data.user));
          return { ok: true };
        }

        return {
          ok: true,
          message: "Demo account ready. Supabase also received the signup request.",
        };
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

function getFriendlyAuthError(message: string) {
  if (/email not confirmed/i.test(message)) {
    return "This Supabase account needs email confirmation. For this demo, create the account once on this browser and log in again here.";
  }

  if (/security purposes|rate limit/i.test(message)) {
    return "Supabase is rate limiting auth emails. For this demo, use the account you already created in this browser.";
  }

  return message;
}

function isDemoSafeSignupError(message: string) {
  return /already registered|already been registered|security purposes|rate limit/i.test(message);
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
