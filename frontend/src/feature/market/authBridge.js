// src/feature/market/authBridge.js
import { useAuth } from "../../context/AuthContext.js";

export function setDevAdmin(flag = true, profile = {}) {
  localStorage.setItem("dev_admin", flag ? "1" : "0");
  if (flag && profile && Object.keys(profile).length) {
    localStorage.setItem("dev_admin_profile", JSON.stringify(profile));
  } else {
    localStorage.removeItem("dev_admin_profile");
  }
}

const pick = (obj, ...keys) => {
  if (!obj) return undefined;
  for (const k of keys) if (obj[k] != null) return obj[k];
  return undefined;
};

function readAnyUserFromLocalStorage() {
  try {
    const keys = [
      "currentUser",
      "user",
      "loginUser",
      "member",
      "account",
      "profile",
      "authUser",
      "ssf_user",
    ];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const v = JSON.parse(raw);
      if (v && (v.email || v.id || v.name || v.nickname || v.username)) return v;
    }
  } catch {}
  return null;
}

function normalizeUser(u) {
  if (!u) return null;
  const id =
    pick(u, "id", "userId", "memberId", "uid", "username") ||
    u.email ||
    u.name ||
    u.nickname ||
    null;
  const email = pick(u, "email", "userEmail") || "";
  const name =
    pick(u, "name", "nickname", "displayName", "username") ||
    (email ? email.split("@")[0] : "USER");
  return { id, email, name, raw: u };
}

export function useMarketAuth() {
  const auth = useAuth();
  const devOn = localStorage.getItem("dev_admin") === "1";
  if (devOn) {
    const prof =
      JSON.parse(localStorage.getItem("dev_admin_profile") || "null") || {
        id: "admin",
        email: "admin@local",
        name: "ADMIN",
      };
    return { isAuthenticated: true, user: normalizeUser(prof) };
  }

  const rawAuthUser =
    pick(
      auth,
      "currentUser",
      "user",
      "member",
      "loginUser",
      "account",
      "profile"
    ) || (typeof auth === "object" && (auth.email || auth.id) ? auth : null);

  const rawLocalUser = readAnyUserFromLocalStorage();

  const user = normalizeUser(rawAuthUser || rawLocalUser);

  const authFlag =
    !!user ||
    !!pick(auth, "isAuthenticated", "isLoggedIn", "signedIn", "authed") ||
    !!localStorage.getItem("token") ||
    !!localStorage.getItem("access_token");

  return { isAuthenticated: !!(authFlag && user), user };
}
