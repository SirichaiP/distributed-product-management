import { apiClient } from "./api-client";
import type { User } from "@/types/user.type";

export const userApi = {
  getUsers: () => apiClient<User[]>("/users"),

  getCurrentUser: () => apiClient<User>("/users/me"),

  getUserById: (id: string) => apiClient<User>(`/users/${id}`),
};