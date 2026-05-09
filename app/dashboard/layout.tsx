import type React from 'react';
import { UserDashboardShell } from '@/components/dashboard/user-dashboard-shell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardShell>{children}</UserDashboardShell>;
}
