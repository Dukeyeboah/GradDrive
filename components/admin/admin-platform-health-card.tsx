'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AdminPlatformHealthCard({
  userEngagement,
  assetDownloads,
  contentCatalog,
}: {
  userEngagement: number;
  assetDownloads: number;
  contentCatalog: number;
}) {
  const rows = [
    { label: 'User Engagement', value: userEngagement },
    { label: 'Asset Downloads', value: assetDownloads },
    { label: 'Content catalog', value: contentCatalog },
  ];

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden',
        'transition-shadow duration-300 hover:shadow-md',
      )}
    >
      <div className='border-b border-border/60 px-5 py-4'>
        <h2 className='text-lg font-semibold text-foreground'>Platform Health</h2>
      </div>
      <div className='space-y-5 p-5'>
        {rows.map((row) => (
          <div key={row.label} className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>{row.label}</span>
              <span className='font-semibold tabular-nums text-foreground'>
                {row.value}%
              </span>
            </div>
            <div className='h-2.5 overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-accent transition-all duration-700 ease-out'
                style={{ width: `${row.value}%` }}
              />
            </div>
          </div>
        ))}

        <div
          className={cn(
            'rounded-xl border border-accent/25 bg-accent/10 p-4',
            'transition-transform duration-300 hover:-translate-y-0.5',
          )}
        >
          <div className='flex gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/80 text-accent shadow-sm'>
              <BarChart3 className='h-5 w-5' strokeWidth={1.75} />
            </div>
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-sm font-semibold text-foreground'>
                Platform Performance is Strong
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Keep up the great work! Your platform is performing above average.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant='outline'
            className='mt-4 w-full rounded-xl border-accent/40 bg-background font-semibold text-accent hover:bg-accent/10 hover:text-accent'
          >
            <Link href='/admin/logs'>View Insights</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
