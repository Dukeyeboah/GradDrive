'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserDashboardHeader } from '@/components/dashboard/user-dashboard-header';
import { DashboardSearchBar } from '@/components/dashboard/dashboard-search-bar';
import { DashboardPageChrome } from '@/components/dashboard/dashboard-page-chrome';
import { LaunchpadOverlay } from '@/components/dashboard/launchpad-overlay';
import { GradDriverOnboardingWizard } from '@/components/dashboard/grad-driver-onboarding-wizard';
import { AdminUserPreviewBanner } from '@/components/dashboard/admin-user-preview-banner';
import { DashboardSearchProvider } from '@/contexts/DashboardSearchContext';
import { LaunchpadProvider } from '@/contexts/LaunchpadContext';

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';

  // Hover previews load pages with ?embed=1 — content only, no chrome.
  if (embed) {
    return (
      <div className='min-h-screen bg-muted/35'>
        <div className='flex min-h-screen flex-col'>{children}</div>
      </div>
    );
  }

  return (
    <DashboardSearchProvider>
      <LaunchpadProvider>
        <div className='min-h-screen bg-muted/35'>
          <div className='flex min-h-screen flex-col'>
            <AdminUserPreviewBanner />
            <div className='sticky top-0 z-20'>
              <UserDashboardHeader />
              <DashboardSearchBar />
              <DashboardPageChrome />
            </div>
            <div className='flex flex-1 flex-col'>{children}</div>
            <GradDriverOnboardingWizard />
          </div>
          <LaunchpadOverlay />
        </div>
      </LaunchpadProvider>
    </DashboardSearchProvider>
  );
}

export function UserDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen flex-col bg-muted/35'>{children}</div>
      }
    >
      <DashboardShellInner>{children}</DashboardShellInner>
    </Suspense>
  );
}
