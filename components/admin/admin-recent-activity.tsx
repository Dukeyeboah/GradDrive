'use client';

import Link from 'next/link';
import { ArrowUpCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SystemLog } from '@/lib/firebase/firestore';
import { cn } from '@/lib/utils';

function formatActivityAction(action: string) {
  const actionMap: Record<string, string> = {
    user_signup: 'New user registration',
    user_login: 'User logged in',
    download_poster: 'Asset downloaded',
    download_ebook: 'E-book accessed',
    download_cap_design: 'Cap design downloaded',
    contact_photographer: 'Photographer contacted',
    add_poster: 'Poster uploaded',
    add_ebook: 'E-book uploaded',
    add_cap_design: 'Cap design uploaded',
    delete_poster: 'Poster deleted',
    update_poster: 'Poster updated',
  };
  return actionMap[action] || action.replace(/_/g, ' ');
}

function formatTimeAgo(timestamp: unknown) {
  if (!timestamp) return 'Unknown';
  const date =
    timestamp && typeof timestamp === 'object' && 'toDate' in timestamp
      ? (timestamp as { toDate: () => Date }).toDate()
      : new Date(timestamp as string | number);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function isDeletion(action: string) {
  return action.includes('delete');
}

export function AdminRecentActivity({
  loading,
  activities,
}: {
  loading: boolean;
  activities: SystemLog[];
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card shadow-sm',
        'transition-shadow duration-300 hover:shadow-md',
      )}
    >
      <div className='flex items-center justify-between border-b border-border/60 px-5 py-4'>
        <h2 className='text-lg font-semibold text-foreground'>Recent Activity</h2>
        <Button
          variant='ghost'
          asChild
          className='h-auto p-0 text-sm font-semibold text-accent hover:text-accent/90 hover:bg-transparent'
        >
          <Link href='/admin/logs'>View all</Link>
        </Button>
      </div>
      <div className='p-2'>
        {loading ? (
          <p className='px-3 py-8 text-sm text-muted-foreground text-center'>
            Loading activity…
          </p>
        ) : activities.length > 0 ? (
          <ul className='max-h-[420px] divide-y divide-border/60 overflow-y-auto'>
            {activities.map((activity, idx) => {
              const del = isDeletion(activity.action);
              return (
                <li
                  key={activity.id ?? `activity-${idx}`}
                  className='flex items-start gap-3 px-3 py-3 transition-colors duration-200 first:pt-2 last:pb-2 hover:bg-muted/50'
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      del
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    {del ? (
                      <Trash2 className='h-4 w-4' />
                    ) : (
                      <ArrowUpCircle className='h-4 w-4' />
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium text-foreground leading-snug'>
                      {formatActivityAction(activity.action)}
                    </p>
                    {activity.userName ? (
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {activity.userName}
                        {activity.userRole
                          ? ` (${activity.userRole})`
                          : ''}
                      </p>
                    ) : null}
                  </div>
                  <span className='shrink-0 text-xs text-muted-foreground whitespace-nowrap'>
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className='px-3 py-8 text-sm text-muted-foreground text-center'>
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
