// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { syncWishlistFromServer } from "../hooks/useWishlist.js";   

const AuthContext = createContext(null);

const USER_KEYS = [
  "loginUser", "ssf_user", "currentUser", "member", "user", "account", "profile", "loginInfo"
];
const PRIMARY_KEY = "loginUser";

function normalizeUser(any) {
  if (!any || typeof any !== "object") return null;
  const id =
    any.id ?? any.userId ?? any.memberId ?? any.uid ?? any.username ?? any.loginId ?? any.email ?? null;
  const email = any.email ?? any.userEmail ?? "";
  const name = any.name ?? any.userName ?? any.nickname ?? (email ? email.split("@")[0] : "USER");
  return id ? { id, email, name, ...any } : { email, name, ...any };
}

function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

function loadAndMigrateUser() {
  const primaryRaw = localStorage.getItem(PRIMARY_KEY);
  const primary = normalizeUser(safeParse(primaryRaw));
  if (primary) return primary;

  for (const k of USER_KEYS) {
    if (k === PRIMARY_KEY) continue;
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    const parsed = normalizeUser(safeParse(raw));
    if (parsed) {
      localStorage.setItem(PRIMARY_KEY, JSON.stringify(parsed));
      localStorage.removeItem(k);
      return parsed;
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAndMigrateUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(loadAndMigrateUser());
    setReady(true);
  }, []);

  const login = async (nextUser) => {
    const u = normalizeUser(nextUser);
    if (!u) return;

    localStorage.setItem(PRIMARY_KEY, JSON.stringify(u));
    setUser(u);

    if (u.email) {
      await syncWishlistFromServer(u.email);
    }

    window.dispatchEvent(new Event("auth:changed"));
  };

  const logout = () => {
    localStorage.removeItem(PRIMARY_KEY);
    localStorage.removeItem("wishlist"); //로컬 초기화
    window.dispatchEvent(new Event("wishlistUpdated"));
    setUser(null);
    window.dispatchEvent(new Event("auth:changed"));
  };

  useEffect(() => {
    const sync = () => setUser(loadAndMigrateUser());
    window.addEventListener("storage", sync);
    window.addEventListener("auth:changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:changed", sync);
    };
  }, []);

  const value = useMemo(
    () => ({ user, ready, isAuthenticated: !!user, login, logout }),
    [user, ready]
  );

  if (!ready) return <div style={{ textAlign: "center", padding: 40 }}>로딩 중...</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
