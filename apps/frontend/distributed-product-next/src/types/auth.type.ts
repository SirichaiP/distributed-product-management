export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export interface RegisterResponse {
  userId: string;
  email: string;
  fullName: string;
  message: string;
}
// src/types/auth.type.ts

export interface MeResponse {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "User";
  isActive: boolean;
}
export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  role?: string;
};