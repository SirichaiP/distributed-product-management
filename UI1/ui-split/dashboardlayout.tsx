// app/dashboard/layout.tsx
// Wraps all /dashboard/* pages with DashboardLayout.
// currentUser is imported from mock data — swap with real auth later.

import DashboardLayout from '@/components/layout/DashboardLayout';
import { currentUser } from '@/data/mockUsers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout user={currentUser}>{children}</DashboardLayout>;
}
