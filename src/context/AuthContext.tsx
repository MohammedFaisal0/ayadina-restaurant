"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  AUTH_CHANGE_EVENT,
  AUTH_STORAGE_KEY,
  emitAuthChange,
} from "@/lib/storage";

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "ayadina2026";
export const ADMIN_TOKEN = "ayadina-mock-admin-session";

type AuthContextValue = {
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribeAuth(onStoreChange: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getAuthSnapshot() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === ADMIN_TOKEN;
}

function getAuthServerSnapshot() {
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );

  const login = useCallback((username: string, password: string) => {
    const isValid =
      username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;

    if (!isValid) {
      return false;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, ADMIN_TOKEN);
    emitAuthChange();
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    emitAuthChange();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isHydrated: true,
      login,
      logout,
    }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
