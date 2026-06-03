import { apiClient } from "./api-client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  MeResponse,
} from "@/types/auth.type";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
 me: () =>
    apiClient<MeResponse>("/auth/me", {
      method: "GET",
    }),

  logout: () =>
    apiClient<void>("/auth/logout", {
      method: "POST",
    }),
};