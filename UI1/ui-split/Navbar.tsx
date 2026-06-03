// components/layout/Navbar.tsx
// Static server component — no client state needed.

import { CurrentUser } from '@/types/auth';

interface NavbarProps {
  user: CurrentUser;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notif-dot" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <button className="icon-btn" aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-3M6 12H3M12 21v-3M12 6V3" />
          </svg>
        </button>

        <button className="avatar-btn" aria-label="User menu">
          <div className="avatar">{user.initials}</div>
          <span className="avatar-name">{user.name}</span>
          <span className="chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
}
