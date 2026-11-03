'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { DashboardAppLauncher } from '@/components/dashboard/dashboard-app-launcher';
import { useLaunchpad } from '@/contexts/LaunchpadContext';

/** Side drawer launchpad with a compact 3-column icon grid. */
export function LaunchpadOverlay() {
  const { launchpadOpen, setLaunchpadOpen, closeLaunchpad } = useLaunchpad();

  return (
    <Sheet open={launchpadOpen} onOpenChange={setLaunchpadOpen}>
      <SheetContent
        side='right'
        className='flex w-[min(100vw,20rem)] flex-col gap-0 p-0 sm:max-w-xs'
      >
        <SheetHeader className='space-y-1 border-b border-border/70 px-4 py-3 pr-12 text-left'>
          <SheetTitle className='text-base font-semibold'>Launchpad</SheetTitle>
          <SheetDescription className='text-xs'>
            Jump to any Grad Drive experience.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto px-3 py-4'>
          <DashboardAppLauncher
            size='sm'
            columns='launchpad'
            onNavigate={closeLaunchpad}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
