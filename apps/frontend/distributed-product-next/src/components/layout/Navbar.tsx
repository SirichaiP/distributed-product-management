"use client";

import { useState } from "react";
import { MeResponse } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface NavbarProps {
  Profile: MeResponse;
}

export default function Navbar({ Profile }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className="topbar-right">
        {/* Cart */}
        <button className="icon-btn" aria-label="Cart">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>

        {/* Notification */}
        <button className="icon-btn notif-dot">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* User Menu */}
        <div className="user-menu">
          <button
            className="avatar-btn"
            onClick={() => setOpen(!open)}
          >
           <div className="avatar">
  {Profile.fullName
    .split(" ")
    .map(x => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()}
</div>

            
<div className="avatar-info">
  <span className="avatar-name">
    {Profile.fullName}
  </span>

  <span className="avatar-role">
    {Profile.role}
  </span>
</div>
            <span className="chevron">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

         {open && (
  <div className="user-dropdown">
    <div className="dropdown-profile">
      <div className="dropdown-avatar">
        {Profile.fullName.substring(0, 2).toUpperCase()}
      </div>

      <div>
        <strong>{Profile.fullName}</strong>
        <small>{Profile.email}</small>
      </div>
    </div>

    <div className="dropdown-section-label">Account</div>

    <button className="dropdown-item" onClick={() => router.push("/profile")}>
      <span className="dropdown-icon icon-primary">👤</span>
      <span>Profile</span>
    </button>

    <button className="dropdown-item" onClick={() => router.push("/cart")}>
      <span className="dropdown-icon icon-success">🛒</span>
      <span>Cart</span>
    </button>

    <div className="dropdown-divider" />

    <button className="dropdown-item logout" onClick={handleLogout}>
      <span className="dropdown-icon icon-danger">⏻</span>
      <span>Logout</span>
    </button>
  </div>
)}
        </div>
      </div>
    </header>
  );
}