'use client';

import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminStatCard({
  label,
  value,
  descriptor,
  icon: Icon,
  iconBgClassName,
  onClick,
  loading,
}: {
  label: string;
  value: string;
  descriptor: string;
  icon: LucideIcon;
  iconBgClassName: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type='button'
      disabled={loading || !onClick}
      onClick={onClick}
      className={cn(
        'relative w-full rounded-2xl border border-border/80 bg-card p-5 text-left shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        (loading || !onClick) && 'cursor-default hover:translate-y-0 hover:shadow-sm',
        onClick && !loading && 'cursor-pointer',
      )}
    >
      <div
        className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors duration-300 group-hover:text-accent'
        aria-hidden
      >
        {loading ? (
          <Loader2 className='h-3.5 w-3.5 animate-spin' />
        ) : (
          <Icon className='h-3.5 w-3.5' strokeWidth={2} />
        )}
      </div>
      <div className='flex gap-4 pr-10'>
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-out',
            iconBgClassName,
          )}
        >
          {loading ? (
            <Loader2 className='h-6 w-6 animate-spin text-white' />
          ) : (
            <Icon className='h-7 w-7 text-white' strokeWidth={1.75} />
          )}
        </div>
        <div className='min-w-0 flex-1 space-y-1'>
          <p className='text-sm font-medium text-muted-foreground'>{label}</p>
          <p className='text-3xl font-bold tracking-tight text-foreground tabular-nums'>
            {value}
          </p>
          <p className='text-xs text-muted-foreground'>{descriptor}</p>
        </div>
      </div>
    </button>
  );
}
