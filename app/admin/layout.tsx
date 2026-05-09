'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminHeader } from '@/components/admin-header';

const authRoutes = ['/admin', '/admin/login', '/admin/signup'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className='min-h-screen bg-muted/30'>
      <AdminSidebar />
      <div className='flex min-h-screen flex-col md:pl-64'>
        <AdminHeader />
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
