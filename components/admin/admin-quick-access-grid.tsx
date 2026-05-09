import Link from 'next/link';
import { ADMIN_QUICK_ACCESS_ITEMS } from '@/lib/config/admin-quick-access';
import { cn } from '@/lib/utils';

export function AdminQuickAccessGrid() {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='text-xl font-bold tracking-tight text-foreground md:text-2xl'>
          Quick Access
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Jump to the tools you use most.
        </p>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {ADMIN_QUICK_ACCESS_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group rounded-xl border border-border/80 bg-card p-4 shadow-sm',
                'transition-all duration-300 ease-out',
                'hover:-translate-y-1 hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              )}
            >
              <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105'>
                <Icon className='h-5 w-5' strokeWidth={1.75} />
              </div>
              <h3 className='font-semibold text-foreground leading-snug'>
                {item.title}
              </h3>
              <p className='mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2'>
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
