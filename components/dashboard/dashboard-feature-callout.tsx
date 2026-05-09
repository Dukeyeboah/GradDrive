import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardFeatureCallout({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-card p-6 md:p-8 shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5 hover:shadow-md hover:border-accent/20',
        className,
      )}
    >
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent'>
            <GraduationCap className='h-6 w-6' strokeWidth={1.75} />
          </div>
          <div className='space-y-2 max-w-2xl'>
            <h2 className='text-xl font-bold tracking-tight text-foreground md:text-2xl'>
              Your Graduation Hub
            </h2>
            <p className='text-sm text-muted-foreground leading-relaxed md:text-base'>
              Your one-stop platform for everything you need to succeed after
              graduation.
            </p>
          </div>
        </div>
        <Button
          asChild
          className='shrink-0 rounded-xl px-6 font-semibold bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 md:self-center'
        >
          <Link href='/dashboard#categories'>Explore All</Link>
        </Button>
      </div>
    </div>
  );
}
