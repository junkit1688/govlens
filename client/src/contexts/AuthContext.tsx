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
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const ACCOUNTS_KEY = "govlens.accounts";
const SESSION_KEY = "govlens.session";
const DEMO_ACCOUNTS_TABLE = "demo_accounts";

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

function storeDemoSession(account: StoredAccount) {
  localStorage.setItem(SESSION_KEY, account.id);
  setStoredDemoAccount(account);
}

function getStoredDemoSession() {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  return readAccounts().find((item) => item.id === sessionId) || null;
}

function setStoredDemoAccount(account: StoredAccount) {
  const accounts = readAccounts();
  const existingIndex = accounts.findIndex((item) => item.email === account.email);
  const nextAccounts = existingIndex >= 0
    ? accounts.map((item, index) => index === existingIndex ? account : item)
    : [account, ...accounts];

  writeAccounts(nextAccounts);
}

async function saveRemoteDemoAccount(name: string, email: string, password: string) {
  if (!supabase) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const { data, error } = await supabase
    .from(DEMO_ACCOUNTS_TABLE)
    .upsert({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
    }, { onConflict: "email" })
    .select("id,name,email,created_at")
    .single();

  if (error || !data) return null;

  return {
    id: String(data.id),
    name: String(data.name),
    email: String(data.email),
    createdAt: new Date(String(data.created_at)).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    passwordHash,
  } satisfies StoredAccount;
}

async function findRemoteDemoAccount(email: string, password: string) {
  if (!supabase) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const { data, error } = await supabase
    .from(DEMO_ACCOUNTS_TABLE)
    .select("id,name,email,created_at")
    .eq("email", normalizedEmail)
    .eq("password_hash", passwordHash)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: String(data.id),
    name: String(data.name),
    email: String(data.email),
    createdAt: new Date(String(data.created_at)).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    passwordHash,
  } satisfies StoredAccount;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GovLensUser | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const demoSession = getStoredDemoSession();
    if (demoSession) {
      setUser(toPublicUser(demoSession));
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
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
      if (demoAccount) {
        storeDemoSession(demoAccount);
        setUser(toPublicUser(demoAccount));
        return { ok: true, message: "Signed in with your demo account." };
      }

      const remoteDemoAccount = await findRemoteDemoAccount(normalizedEmail, password);
      if (remoteDemoAccount) {
        storeDemoSession(remoteDemoAccount);
        setUser(toPublicUser(remoteDemoAccount));
        return { ok: true, message: "Signed in with your demo account." };
      }

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) return { ok: false, error: getFriendlyAuthError(error.message) };
        if (!data.session || !data.user) {
          return { ok: false, error: "No active login session was returned. Please try again." };
        }

        setUser(toGovLensUser(data.user));
        return { ok: true };
      }

      return { ok: false, error: "No demo account found with that email and password." };
    },
    register: async (name, email, password) => {
      const trimmedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();
      if (trimmedName.length < 2) return { ok: false, error: "Please enter your name." };
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return { ok: false, error: "Please enter a valid email." };
      if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

      if (supabase) {
        const remoteDemoAccount = await saveRemoteDemoAccount(trimmedName, normalizedEmail, password);
        const demoAccount = remoteDemoAccount || await upsertDemoAccount(trimmedName, normalizedEmail, password);
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

        storeDemoSession(demoAccount);
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
    return "This email exists in Supabase Auth but is not confirmed. For the demo, create the account in GovLens first and make sure the Supabase demo_accounts table has been created.";
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
