'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeroSection } from '@/components/dashboard/dashboard-hero-section';
import { DashboardCategoryCard } from '@/components/dashboard/dashboard-category-card';
import { DashboardEventCard } from '@/components/dashboard/dashboard-event-card';
import { DashboardContinueCard } from '@/components/dashboard/dashboard-continue-card';
import {
  DASHBOARD_HOME_OFFERING_CARDS,
  DASHBOARD_UPCOMING_EVENTS,
} from '@/lib/config/user-dashboard';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

export default function DashboardPage() {
  const { userData } = useAuth();

  const getFirstName = () => {
    if (userData?.displayName) {
      return userData.displayName.split(' ')[0];
    }
    if (userData?.email) {
      return userData.email.split('@')[0];
    }
    return null;
  };

  const firstName = getFirstName();
  const greetingLine =
    'Explore tools, resources, and opportunities designed to support your journey beyond graduation.';

  const primaryEvent = DASHBOARD_UPCOMING_EVENTS[0];

  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
      <div className='mx-auto max-w-7xl space-y-10 lg:space-y-12'>
        <DashboardHeroSection
          greetingLine={greetingLine}
          userName={firstName}
        />

        <section id='offerings' className='scroll-mt-24 space-y-6'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <h2 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
              Grad Drive offerings
            </h2>
            <Button
              variant='ghost'
              asChild
              className='w-fit gap-1 px-0 text-accent hover:text-accent/90 hover:bg-transparent font-semibold'
            >
              <Link href='/dashboard/grad-drive'>View All →</Link>
            </Button>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {DASHBOARD_HOME_OFFERING_CARDS.map((card) => (
              <DashboardCategoryCard key={card.href + card.title} {...card} />
            ))}
          </div>
        </section>

        <section className='grid gap-8 lg:grid-cols-2 lg:gap-10'>
          <div className='space-y-4'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <h2 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                Upcoming Events
              </h2>
              <Button
                variant='ghost'
                asChild
                className='w-fit gap-1 px-0 text-accent hover:text-accent/90 hover:bg-transparent font-semibold'
              >
                <Link href='/dashboard/alum-club'>View All →</Link>
              </Button>
            </div>
            {primaryEvent ? (
              <DashboardEventCard event={primaryEvent} />
            ) : (
              <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center shadow-sm'>
                <CalendarDays className='mb-3 h-10 w-10 text-muted-foreground' />
                <p className='font-medium text-foreground'>No upcoming events yet</p>
                <p className='mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed'>
                  When new alumni and community events are scheduled, they will
                  show up here. You can always visit the alumni club for the
                  latest.
                </p>
                <Button
                  asChild
                  className='mt-6 rounded-xl font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
                >
                  <Link href='/dashboard/alum-club'>Go to Events</Link>
                </Button>
              </div>
            )}
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
              Continue where you left off
            </h2>
            <DashboardContinueCard />
          </div>
        </section>
      </div>
    </div>
  );
}
