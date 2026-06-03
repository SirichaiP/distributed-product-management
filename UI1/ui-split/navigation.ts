// data/navigation.ts
import { Role } from '@/types/auth';

export interface NavItem {
  label: string;
  href: string;
  icon: string; // SVG path key
  allowedRoles: Role[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    label: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
        allowedRoles: ['Admin', 'User'],
      },
      {
        label: 'Categories',
        href: '/dashboard/categories',
        icon: 'categories',
        allowedRoles: ['Admin'],
      },
      {
        label: 'Products',
        href: '/dashboard/products',
        icon: 'products',
        allowedRoles: ['Admin', 'User'],
      },
    ],
  },
  {
    label: 'Commerce',
    items: [
      {
        label: 'Orders',
        href: '/dashboard/orders',
        icon: 'orders',
        allowedRoles: ['Admin', 'User'],
      },
    ],
  },
  {
    label: 'Admin',
    items: [
      {
        label: 'Users',
        href: '/dashboard/users',
        icon: 'users',
        allowedRoles: ['Admin'],
      },
      {
        label: 'Roles',
        href: '/dashboard/roles',
        icon: 'roles',
        allowedRoles: ['Admin'],
      },
    ],
  },
];
