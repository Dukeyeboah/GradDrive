import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type DashboardCategoryCardProps = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  imageSrc: string;
};

export function DashboardCategoryCard({
  title,
  description,
  href,
  ctaLabel,
  imageSrc,
}: DashboardCategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-border/80 shadow-sm',
        'cursor-pointer transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-lg hover:border-accent/25',
      )}
    >
      <div className='absolute inset-0'>
        <Image
          src={imageSrc}
          alt=''
          fill
          className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
          sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw'
        />
        {/* Dark bottom scrim so white copy stays readable on any photo */}
        <div
          className='pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 from-15% via-black/55 to-transparent'
          aria-hidden
        />
      </div>

      <div className='relative z-[1] mt-auto flex min-w-0 flex-col p-5'>
        <h3 className='w-fit max-w-full rounded-lg bg-black px-3 py-2 text-base font-semibold leading-snug text-white'>
          {title}
        </h3>
        <p className='mt-2 min-w-0 truncate text-sm leading-relaxed text-white/90'>
          {description}
        </p>
        <span
          className={cn(
            'mt-4 flex h-10 w-full items-center justify-center rounded-xl',
            'bg-accent font-semibold text-accent-foreground shadow-md',
            'transition-colors group-hover:bg-accent/90',
          )}
        >
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}
