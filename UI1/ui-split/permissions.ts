// lib/permissions.ts
import { Role } from '@/types/auth';

/** Pages/sections each role can access */
export const rolePermissions: Record<Role, string[]> = {
  Admin: ['dashboard', 'categories', 'products', 'orders', 'users', 'roles'],
  User: ['dashboard', 'products', 'orders'],
};

/** Whether the current role can perform write actions (add/edit/delete) */
export function canWrite(role: Role): boolean {
  return role === 'Admin';
}

/** Whether the current role can access a given feature key */
export function canAccess(role: Role, feature: string): boolean {
  return rolePermissions[role]?.includes(feature) ?? false;
}
