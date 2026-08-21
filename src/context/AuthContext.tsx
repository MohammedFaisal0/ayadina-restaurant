"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  AUTH_CHANGE_EVENT,
  AUTH_STORAGE_KEY,
  emitAuthChange,
} from "@/lib/storage";
import { loginApi, getAuthToken } from "@/lib/api";

type AuthContextValue = {
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginError: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    function handleStorageChange() {
      const token = getAuthToken();
      setIsAuthenticated(!!token);
    }
    window.addEventListener(AUTH_CHANGE_EVENT, handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoginError(null);
    try {
      const session = await loginApi(username, password);
      localStorage.setItem(AUTH_STORAGE_KEY, session.token);
      emitAuthChange();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLoginError(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    emitAuthChange();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, isHydrated, login, logout, loginError }),
    [isAuthenticated, isHydrated, login, logout, loginError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
