import type React from 'react';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserNav />
      <main className='flex-1 flex justify-center items-start min-h-[calc(100vh-4rem)]'>
        {children}
      </main>
    </>
  );
}
