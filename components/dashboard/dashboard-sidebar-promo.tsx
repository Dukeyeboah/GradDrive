import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HOUSE_OF_STOLE_SHOP_URL } from '@/lib/config/marketing-urls';

export function DashboardSidebarPromo() {
  return (
    <div className='rounded-xl border border-border/80 bg-accent/10 p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30'>
      <p className='text-sm font-semibold text-foreground leading-snug'>
        Unlock more with Grad Drive Access
      </p>
      <p className='mt-2 text-xs text-muted-foreground leading-relaxed'>
        Explore add-ons and official House of Stole offerings to complement your
        grad experience.
      </p>
      <Button
        asChild
        size='sm'
        className='mt-3 w-full rounded-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
      >
        <Link href={HOUSE_OF_STOLE_SHOP_URL} target='_blank' rel='noopener noreferrer'>
          Upgrade Now
        </Link>
      </Button>
    </div>
  );
}
