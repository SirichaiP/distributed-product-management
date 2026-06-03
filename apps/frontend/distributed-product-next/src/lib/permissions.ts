

import { Role } from "@/types/user.type";

export const rolePermissions: Record<Role, string[]> = {
  Admin: [
    "dashboard",
    "categories",
    "products",
    "orders",
    "users",
    "roles",
  ],

  User: [
    "dashboard",
    // "categories",
    "products",
    "orders",
  ],
};

export function canAccess(
  role: Role,
  feature: string
): boolean {
  return rolePermissions[role]?.includes(feature) ?? false;
}

export function canWrite(role: Role): boolean {
  return role === "Admin";
}

export function canManageUsers(role: Role): boolean {
  return role === "Admin";
}

export function canManageProducts(role: Role): boolean {
  return role === "Admin";
}

export function canManageCategories(role: Role): boolean {
  return role === "Admin";
}

export function canManageOrders(role: Role): boolean {
  return role === "Admin";
}