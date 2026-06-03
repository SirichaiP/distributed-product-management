// src/services/auth.service.ts
import { apiClient } from "@/lib/api-client";
import { authApi } from "@/lib/auth-api";
import { RegisterRequest } from "@/types/auth.type";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "User";
}

export const authService = {
  login: (data: LoginRequest) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

      async register(data: RegisterRequest) {
    return await authApi.register(data);
  },
  
  me: () =>
    apiClient<MeResponse>("/auth/me", {
      method: "GET",
    }),
};