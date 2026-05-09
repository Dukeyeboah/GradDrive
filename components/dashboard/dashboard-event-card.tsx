import Image from 'next/image';
import Link from 'next/link';
import type { DashboardEventItem } from '@/lib/config/user-dashboard';
import { cn } from '@/lib/utils';

export function DashboardEventCard({
  event,
  className,
}: {
  event: DashboardEventItem;
  className?: string;
}) {
  return (
    <Link
      href={event.href}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm',
        'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-accent/25',
        className,
      )}
    >
      <div className='relative aspect-[16/10] w-full'>
        <Image
          src={event.imageSrc}
          alt=''
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          sizes='(max-width: 768px) 100vw, 400px'
        />
        <div className='absolute right-3 top-3 rounded-lg bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground shadow-sm'>
          {event.dateLabel}
        </div>
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <h3 className='font-semibold text-foreground leading-snug group-hover:text-accent transition-colors'>
          {event.title}
        </h3>
        <p className='mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2'>
          {event.description}
        </p>
        <p className='mt-3 text-xs font-medium text-muted-foreground'>
          {event.time}
        </p>
      </div>
    </Link>
  );
}
