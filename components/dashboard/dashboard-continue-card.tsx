'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useContinueReading } from '@/hooks/use-continue-reading';

const DEFAULT_COVER = '/images/tools.jpg';

export function DashboardContinueCard({ className }: { className?: string }) {
  const persisted = useContinueReading();

  const title = persisted?.title ?? 'eBooks & guides';
  const href = persisted?.href ?? '/dashboard/ebooks';
  const progressPercent = persisted?.progressPercent ?? 0;
  const progressNote =
    persisted?.progressNote ??
    'Open your library to start reading or pick up where you left off.';

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-accent/25 ${className ?? ''}`}
    >
      <div className='relative aspect-[16/10] w-full'>
        <Image
          src={DEFAULT_COVER}
          alt=''
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 400px'
        />
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <h3 className='font-semibold text-foreground leading-snug'>{title}</h3>
        <p className='mt-2 text-sm text-muted-foreground leading-relaxed'>
          {progressNote}
        </p>
        {persisted ? (
          <>
            <div className='mt-4 h-2 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-accent transition-all'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>
              {progressPercent}% complete
            </p>
          </>
        ) : null}
        <Button
          asChild
          className='mt-4 w-full rounded-xl font-semibold bg-accent text-accent-foreground shadow-sm hover:bg-accent/90'
        >
          <Link href={href}>
            {persisted ? 'Continue reading' : 'Browse library'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
