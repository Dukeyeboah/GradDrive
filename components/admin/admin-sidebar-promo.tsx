import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HOUSE_OF_STOLE_SHOP_URL } from '@/lib/config/marketing-urls';

export function AdminSidebarPromo() {
  return (
    <div className='rounded-xl border border-amber-200/60 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/30 p-4'>
      <div className='flex items-start gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent'>
          <GraduationCap className='h-5 w-5' strokeWidth={1.75} />
        </div>
        <div className='min-w-0 space-y-1'>
          <p className='text-sm font-semibold text-foreground leading-snug'>
            Grad Drive Pro
          </p>
          <p className='text-xs text-muted-foreground leading-relaxed'>
            Unlock advanced tools and exclusive features.
          </p>
        </div>
      </div>
      <Button
        asChild
        size='sm'
        className='mt-3 w-full rounded-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm transition-transform duration-300 hover:scale-[1.02]'
      >
        <Link href={HOUSE_OF_STOLE_SHOP_URL} target='_blank' rel='noopener noreferrer'>
          Upgrade Now
        </Link>
      </Button>
    </div>
  );
}
