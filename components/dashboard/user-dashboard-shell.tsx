'use client';

import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { UserDashboardSidebar } from '@/components/dashboard/user-dashboard-sidebar';
import { UserDashboardHeader } from '@/components/dashboard/user-dashboard-header';
import { GradDriverOnboardingWizard } from '@/components/dashboard/grad-driver-onboarding-wizard';
import { AdminUserPreviewBanner } from '@/components/dashboard/admin-user-preview-banner';

export function UserDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='min-h-screen bg-muted/35'>
      <aside className='hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col md:border-r md:border-border'>
        <UserDashboardSidebar className='h-full w-64' />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='left' className='w-72 p-0 flex flex-col'>
          <UserDashboardSidebar
            className='h-full border-0'
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className='flex min-h-screen flex-col md:pl-64'>
        <AdminUserPreviewBanner />
        <UserDashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <div className='flex-1'>{children}</div>
        <GradDriverOnboardingWizard />
      </div>
    </div>
  );
}
