'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  BookOpen,
  Camera,
  Award,
  FileImage,
  Landmark,
  ShoppingBag,
  Mail,
  Unlock,
  Lock,
} from 'lucide-react';
import { AuthModals } from '@/components/auth-modals';
import { HOUSE_OF_STOLE_SHOP_URL } from '@/lib/config/marketing-urls';
import { cn } from '@/lib/utils';

const HERO_IMAGE = '/images/grad.jpg';

const featureStripItems = [
  {
    icon: FileImage,
    label: 'Posters & Artwork',
    boxClass: 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50',
    iconClass: 'text-amber-700 dark:text-amber-400',
  },
  {
    icon: GraduationCap,
    label: 'Cap Designs',
    boxClass: 'bg-orange-100/90 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-800/50',
    iconClass: 'text-orange-700 dark:text-orange-400',
  },
  {
    icon: Camera,
    label: 'Photography',
    boxClass: 'bg-rose-100/90 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/50',
    iconClass: 'text-rose-700 dark:text-rose-400',
  },
  {
    icon: BookOpen,
    label: 'eBooks & Guides',
    boxClass: 'bg-sky-100/90 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/50',
    iconClass: 'text-sky-700 dark:text-sky-400',
  },
  {
    icon: Award,
    label: 'Scholarships & Opportunities',
    boxClass: 'bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50',
    iconClass: 'text-emerald-700 dark:text-emerald-400',
  },
  {
    icon: Landmark,
    label: 'Cultural Content',
    boxClass: 'bg-violet-100/90 dark:bg-violet-950/40 border-violet-200/80 dark:border-violet-800/50',
    iconClass: 'text-violet-700 dark:text-violet-400',
  },
] as const;

const benefitCards = [
  {
    icon: FileImage,
    title: 'Posters & Cap Designs',
    description:
      'Download polished posters, cap mockups, and creative assets to celebrate your milestone.',
    imageSrc: '/images/capDesign.jpg',
    imageAlt: 'Graduation design resources',
  },
  {
    icon: Landmark,
    title: 'Cultural & Educational Content',
    description:
      'Explore stories, heritage, and learning that connect you to culture beyond the ceremony.',
    imageSrc: '/images/culture.jpg',
    imageAlt: 'Cultural and educational content',
  },
  {
    icon: Award,
    title: 'Opportunities & Scholarships',
    description:
      'Discover tours, scholarships, and experiences designed for grads ready for what’s next.',
    imageSrc: '/images/scholarship.jpg',
    imageAlt: 'Opportunities for graduates',
  },
  {
    icon: BookOpen,
    title: 'Tools & Practical Resources',
    description:
      'Guides, checklists, and digital tools that help you plan, share, and enjoy graduation week.',
    imageSrc: '/images/tools.jpg',
    imageAlt: 'Practical grad tools',
  },
] as const;

const howItWorksSteps = [
  {
    icon: ShoppingBag,
    step: 1,
    title: 'You order your stole',
    description: 'Complete your House of Stole order and unlock Grad Drive as part of your package.',
    boxClass:
      'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50',
    iconClass: 'text-amber-700 dark:text-amber-400',
  },
  {
    icon: Mail,
    step: 2,
    title: 'Get your access details',
    description: 'Receive instructions and credentials so you can sign in and start exploring.',
    boxClass:
      'bg-sky-100/90 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/50',
    iconClass: 'text-sky-700 dark:text-sky-400',
  },
  {
    icon: Unlock,
    step: 3,
    title: 'Unlock and explore',
    description: 'Use downloads, perks, and opportunities whenever you need them.',
    boxClass:
      'bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50',
    iconClass: 'text-emerald-700 dark:text-emerald-400',
  },
] as const;

export function WelcomeScreen() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openSignup = () => {
    setAuthMode('signup');
    setAuthOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthOpen(true);
  };

  return (
    <main className='w-full flex flex-col bg-background'>
      {/* Hero */}
      <section className='border-b border-border/60 bg-background'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-14 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24'>
          <div className='grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center'>
            <div className='space-y-8 text-center lg:text-left'>
              <div className='inline-flex items-center rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-sm font-medium text-secondary-foreground'>
                🎓 Celebrate Your Achievement!
              </div>
              <h1 className='text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance'>
                Graduate with more than a stole.
              </h1>
              <p className='text-lg text-muted-foreground md:text-xl max-w-xl mx-auto lg:mx-0 text-pretty leading-relaxed'>
                Unlock Grad Drive — a platform of tools, downloads, and
                opportunities included with your House of Stole order.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2'>
                <Button
                  size='lg'
                  className='cursor-pointer rounded-xl px-8 py-6 text-base font-semibold bg-accent text-accent-foreground shadow-sm hover:bg-accent/90'
                  onClick={openSignup}
                >
                  Get Grad Drive Access
                </Button>
                <Button
                  size='lg'
                  variant='secondary'
                  className='cursor-pointer rounded-xl px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90'
                  onClick={openLogin}
                >
                  Already a Member? Login
                </Button>
              </div>
            </div>
            <div className='relative w-full aspect-[4/5] max-h-[560px] mx-auto lg:max-h-none lg:aspect-[3/4]'>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 -z-10 scale-[1.02] blur-sm' />
              <div className='relative h-full w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/40'>
                <Image
                  src={HERO_IMAGE}
                  alt='Graduate wearing a custom House of Stole'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon feature strip */}
      <section className='border-b border-border/60 bg-muted/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16'>
            <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
              Everything unlocked with your stole
            </h2>
            <p className='text-lg text-muted-foreground text-pretty'>
              A curated set of tools, downloads, and opportunities designed to
              support you beyond graduation.
            </p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8'>
            {featureStripItems.map(({ icon: Icon, label, boxClass, iconClass }) => (
              <div
                key={label}
                className='flex flex-col items-center text-center gap-3'
              >
                <div
                  className={cn(
                    'flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl border shadow-sm',
                    boxClass
                  )}
                >
                  <Icon
                    className={cn('h-7 w-7 md:h-8 md:w-8', iconClass)}
                    strokeWidth={1.75}
                  />
                </div>
                <span className='text-sm font-semibold text-foreground leading-snug max-w-[140px]'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits cards */}
      <section className='border-b border-border/60 bg-background'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16'>
            <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
              Everything you need for what’s next
            </h2>
            <p className='text-lg text-muted-foreground text-pretty'>
              Grad Drive brings together practical tools, creative resources,
              and real opportunities — all included when you order your stole.
            </p>
          </div>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {benefitCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card',
                    'shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5'
                  )}
                >
                  <div className='p-6 flex flex-col gap-3 flex-1'>
                    <div className='flex items-start gap-3'>
                      <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15'>
                        <Icon className='h-5 w-5 text-accent' strokeWidth={2} />
                      </div>
                      <h3 className='font-bold text-lg text-foreground leading-snug pt-1.5'>
                        {card.title}
                      </h3>
                    </div>
                    <p className='text-sm text-muted-foreground leading-relaxed flex-1'>
                      {card.description}
                    </p>
                  </div>
                  <div className='relative h-36 w-full mt-auto'>
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
                      sizes='(max-width: 640px) 100vw, 25vw'
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className='mt-12 md:mt-16 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Lock className='h-4 w-4 text-primary shrink-0' />
            <span>Included with every House of Stole order.</span>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className='bg-muted/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16'>
            <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
              How Grad Drive Works
            </h2>
            <p className='text-lg text-muted-foreground text-pretty'>
              Simple steps. Instant access. Lasting impact.
            </p>
          </div>
          <div className='grid gap-10 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto'>
            {howItWorksSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className='relative flex flex-col items-center text-center'
                >
                  <div className='mb-4 flex justify-center w-full'>
                    <div className='relative inline-flex'>
                      <div
                        className={cn(
                          'flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm',
                          step.boxClass
                        )}
                      >
                        <Icon
                          className={cn('h-7 w-7', step.iconClass)}
                          strokeWidth={1.75}
                        />
                      </div>
                      <span className='absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm'>
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className='font-bold text-lg text-foreground mb-2'>
                    {step.title}
                  </h3>
                  <p className='text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto'>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className='mt-12 md:mt-16 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
            <Button
              size='lg'
              variant='secondary'
              className='cursor-pointer rounded-xl px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto'
              asChild
            >
              <a
                href={HOUSE_OF_STOLE_SHOP_URL}
                target='_blank'
                rel='noopener noreferrer'
              >
                Order your stole
              </a>
            </Button>
            <Button
              size='lg'
              className='cursor-pointer rounded-xl px-8 py-6 text-base font-semibold bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 w-full sm:w-auto'
              onClick={openSignup}
            >
              Get Grad Drive Access
            </Button>
          </div>
        </div>
      </section>

      <AuthModals
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </main>
  );
}
