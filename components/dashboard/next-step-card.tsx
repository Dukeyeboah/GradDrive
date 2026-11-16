'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const STEPS = {
  connect: { label: 'Meet other graduates', text: 'Find a graduate in your field and introduce yourself with one thing you’re working on.', href: '/dashboard/grad-drivers', cta: 'Explore the community' },
  plan: { label: 'Plan my next chapter', text: 'Choose a guide and turn one idea into a small action for this week.', href: '/dashboard/ebooks', cta: 'Open the guides' },
  celebrate: { label: 'Celebrate graduation', text: 'Find an artwork to celebrate your achievement and share your next chapter.', href: '/dashboard/posters', cta: 'Browse artworks' },
};
type Goal = keyof typeof STEPS;
export function NextStepCard() {
  const [goal, setGoal] = useState<Goal>('connect');
  useEffect(() => { try { const saved = sessionStorage.getItem('gradDriveGoal'); if (saved && Object.hasOwn(STEPS, saved)) setGoal(saved as Goal); } catch {} }, []);
  const step = STEPS[goal];
  return <section aria-label="Your next step" className="mb-8 rounded-2xl border border-orange-200/60 bg-orange-50/40 p-4 dark:border-orange-900/50 dark:bg-orange-950/10 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label htmlFor="grad-goal" className="text-sm font-semibold">Your next step</label>
      <select id="grad-goal" value={goal} onChange={e => { const value = e.target.value as Goal; setGoal(value); try { sessionStorage.setItem('gradDriveGoal', value); } catch {} }} className="max-w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        {Object.entries(STEPS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
      </select>
    </div>
    <p className="mt-3 text-sm text-muted-foreground">{step.text}</p>
    <Link href={step.href} className="mt-3 inline-flex rounded-lg text-sm font-semibold text-orange-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 dark:text-orange-400">{step.cta} →</Link>
  </section>;
}
