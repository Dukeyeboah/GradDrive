'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import { PhotographerSidebar } from '@/components/photographer-sidebar';
import { PhotographerSidebarProvider } from '@/contexts/PhotographerSidebarContext';
import { PhotographerAdminTitle } from '@/components/photographer-admin-title';

// Routes where we show only the passkey/login UI (no sidebar).
const authRoutes = ['/photographer-admin'];

export default function PhotographerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <>
      <PhotographerAdminTitle />
      {isAuthRoute ? (
        <>{children}</>
      ) : (
        <PhotographerSidebarProvider>
          <div className='flex h-screen'>
            <PhotographerSidebar />
            <div className='flex-1 flex flex-col overflow-hidden'>
              <main className='flex-1 overflow-y-auto bg-muted/30'>
                <div className='w-full pt-4 md:pt-6 pb-0'>{children}</div>
              </main>
            </div>
          </div>
        </PhotographerSidebarProvider>
      )}
    </>
  );
}
