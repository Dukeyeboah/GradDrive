'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { isAdminRole } from '@/lib/auth/roles';

/**
 * Admins use /admin/* by default. They only see /dashboard/* when explicitly
 * previewing via "Switch to User View" (viewMode === 'user').
 */
export function DashboardRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, loading } = useAuth();
  const { viewMode, setViewMode } = useViewMode();

  const isAdmin = isAdminRole(userData?.role);
  const previewingUser = viewMode === 'user';

  useEffect(() => {
    if (loading || !isAdmin) return;
    if (previewingUser) return;
    setViewMode('admin');
    const target = '/admin/dashboard';
    if (pathname?.startsWith('/dashboard')) {
      router.replace(target);
    }
  }, [loading, isAdmin, previewingUser, pathname, router, setViewMode]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/35'>
        <Loader2 className='h-8 w-8 animate-spin text-accent' aria-label='Loading' />
      </div>
    );
  }

  if (isAdmin && !previewingUser) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/35'>
        <Loader2 className='h-8 w-8 animate-spin text-accent' aria-label='Redirecting' />
      </div>
    );
  }

  return <>{children}</>;
}
