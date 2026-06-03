// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authApi } from "@/lib/auth-api";
import type { MeResponse } from "@/types/auth.type";

interface AuthContextValue {
  user: MeResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  reloadMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function hasInitialToken() {
  if (typeof window === "undefined") return true;

  return Boolean(localStorage.getItem("accessToken"));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(hasInitialToken);

  const clearAuth = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    setUser(null);
    setLoading(false);
  }, []);

  const reloadMe = useCallback(async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const me = await authApi.me();

      setUser(me);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout api error
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    const task = window.setTimeout(() => {
      void reloadMe();
    }, 0);

    return () => {
      window.clearTimeout(task);
    };
  }, [reloadMe]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      reloadMe,
      logout,
    }),
    [user, loading, reloadMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}