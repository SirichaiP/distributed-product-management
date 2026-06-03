"use client";

import { create } from "zustand";

import { authApi } from "@/lib/auth-api";

import type {
  LoginRequest,
  AuthResponse,
  MeResponse,
} from "@/types/auth.type";

interface AuthState {
  accessToken: string | null;
  user: MeResponse | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  me: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null,

  user: null,

  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("accessToken")
      : false,

  isLoading: false,

  login: async (data) => {
    set({ isLoading: true });

    try {
      const result: AuthResponse =
        await authApi.login(data);

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      set({
        accessToken: result.accessToken,
        isAuthenticated: true,
      });

      // โหลด user profile ต่อทันที
      await get().me();
    } finally {
      set({ isLoading: false });
    }
  },

  me: async () => {
    const token =
      get().accessToken ||
      localStorage.getItem("accessToken");

    if (!token) {
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });

      return;
    }

    try {
      const user: MeResponse =
        await authApi.me();

      set({
        user,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem("accessToken");

      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("accessToken");

      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));