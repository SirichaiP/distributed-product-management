"use client";

// src/components/layout/Sidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { navigationSections } from "@/lib/navigation";
import { Role } from "@/types/user.type";

const icons: Record<string, ReactNode> = {
  dashboard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),

  categories: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h7" />
    </svg>
  ),

  products: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),

  stock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),

  orders: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),

  orderItems: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),

  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  roles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

interface SidebarProps {
  role: Role;
}

function normalizeIconKey(icon: string) {
  if (icon === "order-items" || icon === "orderItems") {
    return "orderItems";
  }

  if (icon === "stock-management" || icon === "stockManagement") {
    return "stock";
  }

  return icon;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-logo">
        <div className="logo-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>

        <span className="logo-name">DPMS</span>
      </Link>

      <nav className="sidebar-nav">
        {navigationSections.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.allowedRoles.includes(role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label} className="nav-section">
              <div className="nav-label">{section.label}</div>

              {visibleItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                const iconKey = normalizeIconKey(item.icon);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item${isActive ? " active" : ""}`}
                  >
                    <span className="nav-icon">
                      {icons[iconKey] ?? icons.dashboard}
                    </span>

                    <span className="nav-text">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}