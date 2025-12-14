import { authApi } from "./authApi";
import type { User } from "../types";

/**
 * Frontend-facing auth service used by the existing UI.
 * Backend auth is cookie-based and only stores {id,email}.
 * We keep optional profile fields (name/company/role) locally.
 */

const SESSION_KEY = "lexi_session";
const PROFILE_KEY = "lexi_profile";

type LocalProfile = Partial<Pick<User, "name" | "company" | "role">>;

function inferNameFromEmail(email: string) {
  const part = (email || "").split("@")[0] || "User";
  return part.charAt(0).toUpperCase() + part.slice(1);
}

function getProfile(userId: string): LocalProfile {
  const raw = localStorage.getItem(PROFILE_KEY);
  const all: Record<string, LocalProfile> = raw ? JSON.parse(raw) : {};
  return all[userId] || {};
}

function setProfile(userId: string, patch: LocalProfile) {
  const raw = localStorage.getItem(PROFILE_KEY);
  const all: Record<string, LocalProfile> = raw ? JSON.parse(raw) : {};
  all[userId] = { ...(all[userId] || {}), ...patch };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
}

function cacheSession(user: User | null) {
  if (!user) return localStorage.removeItem(SESSION_KEY);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function readCachedSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export const authService = {
  /**
   * Cookie-login via backend.
   */
  async login(email: string, password: string): Promise<User | null> {
    try {
      const u = await authApi.login(email, password);
      const local = getProfile(u.userId);
      const user: User = {
        id: u.userId,
        email: u.email,
        joinedDate: new Date(),
        name: local.name || inferNameFromEmail(u.email),
        company: local.company,
        role: local.role,
      };
      cacheSession(user);
      return user;
    } catch {
      return null;
    }
  },

  /**
   * Cookie-register via backend. Backend only stores email/password.
   * We keep name locally.
   */
  async signup(name: string, email: string, password: string): Promise<User> {
    const u = await authApi.register(email, password);
    setProfile(u.userId, { name });
    const user: User = {
      id: u.userId,
      email: u.email,
      joinedDate: new Date(),
      name,
    };
    cacheSession(user);
    return user;
  },

  /**
   * Resolve current user from backend cookie if possible.
   */
  async getCurrentUser(): Promise<User | null> {
    // quick path: cached
    const cached = readCachedSession();
    try {
      const u = await authApi.me();
      const profile = getProfile(u.userId);
      const user: User = {
        id: u.userId,
        email: u.email,
        joinedDate: cached?.joinedDate ? new Date(cached.joinedDate) : new Date(),
        name: profile.name || cached?.name || inferNameFromEmail(u.email),
        company: profile.company || cached?.company,
        role: profile.role || cached?.role,
      };
      cacheSession(user);
      return user;
    } catch {
      // cookie invalid/expired
      cacheSession(null);
      return null;
    }
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      cacheSession(null);
    }
  },

  updateProfile(user: User) {
    // backend doesn't store profile fields yet.
    setProfile(user.id, { name: user.name, company: user.company, role: user.role });
    cacheSession(user);
  },
};
