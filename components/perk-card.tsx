import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PerkCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  buttonText?: string;
}

/** Match welcome-screen feature strip palette by route. */
const accentByHref: Record<
  string,
  { box: string; icon: string }
> = {
  '/dashboard/photographers': {
    box: 'bg-rose-100/90 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/50',
    icon: 'text-rose-700 dark:text-rose-400',
  },
  '/dashboard/ebooks': {
    box: 'bg-sky-100/90 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/50',
    icon: 'text-sky-700 dark:text-sky-400',
  },
  '/dashboard/posters': {
    box: 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50',
    icon: 'text-amber-700 dark:text-amber-400',
  },
  '/dashboard/cap-designs': {
    box: 'bg-orange-100/90 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-800/50',
    icon: 'text-orange-700 dark:text-orange-400',
  },
  '/dashboard/discounts': {
    box: 'bg-violet-100/90 dark:bg-violet-950/40 border-violet-200/80 dark:border-violet-800/50',
    icon: 'text-violet-700 dark:text-violet-400',
  },
  '/dashboard/alum-club': {
    box: 'bg-cyan-100/90 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-800/50',
    icon: 'text-cyan-700 dark:text-cyan-400',
  },
  '/dashboard/kente-history': {
    box: 'bg-violet-100/90 dark:bg-violet-950/40 border-violet-200/80 dark:border-violet-800/50',
    icon: 'text-violet-700 dark:text-violet-400',
  },
  '/dashboard/scholarship': {
    box: 'bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50',
    icon: 'text-emerald-700 dark:text-emerald-400',
  },
};

const defaultAccent = {
  box: 'bg-accent/15 border-border/80',
  icon: 'text-accent',
};

export function PerkCard({
  icon: Icon,
  title,
  description,
  href,
  buttonText = 'View',
}: PerkCardProps) {
  const { box, icon: iconClass } = accentByHref[href] ?? defaultAccent;

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card',
        'shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full',
      )}
    >
      <div className='p-6 flex flex-col gap-3 flex-1'>
        <div className='flex items-start gap-3'>
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm',
              box,
            )}
          >
            <Icon className={cn('h-5 w-5', iconClass)} strokeWidth={1.75} />
          </div>
          <h3 className='font-bold text-lg text-foreground leading-snug pt-1.5'>
            {title}
          </h3>
        </div>
        <p className='text-sm text-muted-foreground leading-relaxed flex-1'>
          {description}
        </p>
      </div>
      <div className='px-6 pb-6 pt-0 mt-auto'>
        <Button
          asChild
          className='w-full rounded-xl font-semibold bg-accent text-accent-foreground shadow-sm hover:bg-accent/90'
        >
          <Link href={href}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  );
}
