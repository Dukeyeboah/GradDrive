'use client';

import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewMode } from '@/contexts/ViewModeContext';

export function AdminUserPreviewBanner() {
  const { isAdminViewingAsUser, setViewMode } = useViewMode();

  if (!isAdminViewingAsUser) return null;

  return (
    <div className='flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm'>
      <p className='flex items-center gap-2 text-foreground'>
        <Shield className='h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400' />
        <span>
          <strong>Previewing member view.</strong> Passkey admin tools are in the
          admin panel.
        </span>
      </p>
      <Button
        type='button'
        size='sm'
        variant='secondary'
        className='rounded-lg shrink-0'
        onClick={() => {
          setViewMode('admin');
          window.location.assign('/admin/dashboard');
        }}
      >
        Exit to admin
      </Button>
    </div>
  );
}
