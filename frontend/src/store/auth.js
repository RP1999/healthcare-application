// frontend/src/store/auth.js
import { create } from "zustand";

function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === "" || raw === "undefined") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (value === undefined) {
    // never store undefined in localStorage
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
}

export const useAuth = create((set) => ({
  user: readJSON("ml_user", null),
  token: localStorage.getItem("ml_token") || null,

  login: ({ user, token }) => {
    writeJSON("ml_user", user);                 // always JSON string
    localStorage.setItem("ml_token", token || "");
    set({ user, token: token || null });
  },

  logout: () => {
    localStorage.removeItem("ml_user");
    localStorage.removeItem("ml_token");
    set({ user: null, token: null });
  },

  // optional: refresh current user from backend /auth/me
  setUser: (user) => {
    writeJSON("ml_user", user);
    set({ user });
  },
}));
