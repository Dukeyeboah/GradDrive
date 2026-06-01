import type React from 'react';
import { UserDashboardShell } from '@/components/dashboard/user-dashboard-shell';
import { GradDriveAccessGate } from '@/components/dashboard/grad-drive-access-gate';
import { DashboardRouteGuard } from '@/components/auth/dashboard-route-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GradDriveAccessGate>
      <DashboardRouteGuard>
        <UserDashboardShell>{children}</UserDashboardShell>
      </DashboardRouteGuard>
    </GradDriveAccessGate>
  );
}
