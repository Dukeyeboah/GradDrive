'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { isAdminRole } from '@/lib/auth/roles';

/** Non-admins cannot access /admin/* (except auth entry routes handled by layout). */
export function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const { setViewMode } = useViewMode();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/admin');
      return;
    }
    if (!isAdminRole(userData?.role)) {
      router.replace('/dashboard');
      return;
    }
    setViewMode('admin');
  }, [user, userData, loading, router, setViewMode]);

  if (loading || !user || !isAdminRole(userData?.role)) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/30'>
        <Loader2 className='h-8 w-8 animate-spin text-accent' aria-label='Loading' />
      </div>
    );
  }

  return <>{children}</>;
}
