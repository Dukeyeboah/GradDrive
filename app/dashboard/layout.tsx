import type React from 'react';
import { UserDashboardShell } from '@/components/dashboard/user-dashboard-shell';
import { GradDriveAccessGate } from '@/components/dashboard/grad-drive-access-gate';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GradDriveAccessGate>
      <UserDashboardShell>{children}</UserDashboardShell>
    </GradDriveAccessGate>
  );
}
