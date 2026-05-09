'use client';

import { DashboardCategoryCard } from '@/components/dashboard/dashboard-category-card';
import { DASHBOARD_CATEGORY_CARDS } from '@/lib/config/user-dashboard';

export default function GradDriveExplorePage() {
  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
      <div className='mx-auto max-w-7xl space-y-8'>
        <div className='space-y-2 text-center max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
            Explore Grad Drive
          </h1>
          <p className='text-muted-foreground text-pretty leading-relaxed md:text-lg'>
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
