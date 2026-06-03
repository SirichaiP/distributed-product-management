// components/layout/DashboardLayout.tsx
// Composes Sidebar + Navbar around page content.
// Must be a Client Component because it includes Sidebar (which uses usePathname).

'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { CurrentUser } from '@/types/auth';

interface DashboardLayoutProps {
  user: CurrentUser;
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={user.role} />
      <div className="main">
        <Navbar user={user} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
