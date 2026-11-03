'use client';

import { DashboardCategoryCard } from '@/components/dashboard/dashboard-category-card';
import { DASHBOARD_CATEGORY_CARDS } from '@/lib/config/user-dashboard';

export default function GradDriveExplorePage() {
  return (
    <div className='w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-5'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='mx-auto max-w-2xl space-y-1.5 text-center'>
          <h1 className='text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            Explore Grad Drive
          </h1>
          <p className='text-pretty text-sm leading-relaxed text-muted-foreground'>
            Browse everything included with your Grad Drive access—open a card
            to go to that experience.
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {DASHBOARD_CATEGORY_CARDS.map((card) => (
            <DashboardCategoryCard key={card.href + card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
