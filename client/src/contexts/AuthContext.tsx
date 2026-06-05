import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
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

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return;

    const account = readAccounts().find((item) => item.id === sessionId);
    if (account) setUser(toPublicUser(account));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: async (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();
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
    register: async (name, email, password) => {
      const trimmedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();
      if (trimmedName.length < 2) return { ok: false, error: "Please enter your name." };
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return { ok: false, error: "Please enter a valid email." };
      if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

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
    logout: () => {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
