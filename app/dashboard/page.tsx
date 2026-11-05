'use client';

import { DashboardAppLauncher } from '@/components/dashboard/dashboard-app-launcher';

export default function DashboardPage() {
  return (
    <div className='flex w-full flex-1 flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pt-5'>
      <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col'>
        <div className='mx-auto mb-5 max-w-2xl space-y-1.5 text-center sm:mb-6'>
          <h1 className='text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            Your Grad Drive
          </h1>
          <p className='text-pretty text-sm leading-relaxed text-muted-foreground'>
            Tap any app to open it. Hover for a quick preview of the page.
          </p>
        </div>
        <div className='flex flex-1 flex-col justify-center pb-6'>
          <DashboardAppLauncher showPreview />
        </div>
      </div>
    </div>
  );
}
