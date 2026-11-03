'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useLandingAuth } from '@/contexts/LandingAuthContext';
import { HOUSE_OF_STOLE_SHOP_URL } from '@/lib/config/marketing-urls';
import { cn } from '@/lib/utils';

const HERO_IMAGE = '/images/grad.jpg';

/** Matches dashboard app-launcher tiles. */
const featureStripItems = [
  {
    label: 'Artworks',
    imageSrc: '/images/app-icons/posters.jpg',
  },
  {
    label: 'Cap Designs',
    imageSrc: '/images/app-icons/caps.jpg',
  },
  {
    label: 'Photography',
    imageSrc: '/images/app-icons/photography.jpg',
  },
  {
    label: 'E-book Guides',
    imageSrc: '/images/app-icons/ebooks.jpg',
  },
  {
    label: 'Scholarships',
    imageSrc: '/images/app-icons/scholarships.jpg',
  },
  {
    label: 'Cultural',
    imageSrc: '/images/app-icons/culture.jpg',
  },
] as const;

const benefitCards = [
  {
    title: 'Posters & Cap Designs',
    description:
      'Download polished posters, cap mockups, and creative assets to celebrate your milestone.',
    imageSrc: '/images/capDesign.jpg',
    iconSrc: '/images/app-icons/posters.jpg',
    imageAlt: 'Graduation posters and artwork',
  },
  {
    title: 'Cultural & Educational Content',
    description:
      'Explore stories, heritage, and learning that connect you to culture beyond the ceremony.',
    imageSrc: '/images/culture.jpg',
    iconSrc: '/images/app-icons/culture.jpg',
    imageAlt: 'Cultural and educational content',
  },
  {
    title: 'Opportunities & Scholarships',
    description:
      'Discover tours, scholarships, and experiences designed for grads ready for what’s next.',
    imageSrc: '/images/scholarship.jpg',
    iconSrc: '/images/app-icons/scholarships.jpg',
    imageAlt: 'Opportunities for graduates',
  },
  {
    title: 'Tools & Practical Resources',
    description:
      'Guides, checklists, and digital tools that help you plan, share, and enjoy graduation week.',
    imageSrc: '/images/tools.jpg',
    iconSrc: '/images/app-icons/tools.jpg',
    imageAlt: 'Practical grad tools',
  },
] as const;

const howItWorksSteps = [
  {
    step: 1,
    title: 'You order your stole',
    description:
      'Complete your House of Stole order and unlock Grad Drive as part of your package.',
    imageSrc: '/images/app-icons/shop.jpg',
  },
  {
    step: 2,
    title: 'Get your access details',
    description:
      'Receive instructions and credentials so you can sign in and start exploring.',
    // Temporary stand-in — see note below for preferred asset
    imageSrc: '/images/app-icons/messages.jpg',
  },
  {
    step: 3,
    title: 'Unlock and explore',
    description: 'Use downloads, perks, and opportunities whenever you need them.',
    imageSrc: '/images/app-icons/explore.jpg',
  },
] as const;

function AppIconFace({
  src,
  alt = '',
  size = 'md',
}: {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const dim =
    size === 'lg'
      ? 'h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] rounded-[1.15rem]'
      : size === 'md'
        ? 'h-14 w-14 md:h-16 md:w-16 rounded-[1.05rem] md:rounded-[1.15rem]'
        : size === 'sm'
          ? 'h-10 w-10 rounded-[0.8rem]'
          : 'h-8 w-8 shrink-0 rounded-[0.65rem]';

  return (
    <span
      className={cn(
        'relative block overflow-hidden shadow-md shadow-black/10',
        dim,
      )}
    >
      <Image src={src} alt={alt} fill className='object-cover' sizes='72px' />
    </span>
  );
}

export function WelcomeScreen() {
  const { openLogin, openSignup } = useLandingAuth();

  return (
    <main className='flex w-full flex-col bg-background'>
      {/* Hero — compact so the next section enters the first viewport */}
      <section className='border-b border-border/60 bg-background'>
        <div className='mx-auto max-w-7xl px-4 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-4 lg:px-8 lg:pb-12 lg:pt-5'>
          <div className='grid items-center gap-6 lg:grid-cols-2 lg:gap-10'>
            <div className='space-y-4 text-center lg:space-y-5 lg:text-left'>
              <h1 className='text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight'>
                Graduate with more than a stole.
              </h1>
              <p className='mx-auto max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0'>
                Unlock Grad Drive — a platform of tools, downloads, and
                opportunities included with your House of Stole order.
              </p>
              <div className='flex flex-col justify-center gap-2.5 pt-1 sm:flex-row sm:gap-3 lg:justify-start'>
                <Button
                  size='lg'
                  className='cursor-pointer rounded-xl bg-accent px-7 py-5 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 sm:text-base'
                  onClick={openSignup}
                >
                  Get Grad Drive Access
                </Button>
                <Button
                  size='lg'
                  variant='secondary'
                  className='cursor-pointer rounded-xl bg-primary px-7 py-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:text-base'
                  onClick={openLogin}
                >
                  Already a Member? Login
                </Button>
              </div>
            </div>
            <div className='relative mx-auto aspect-[16/10] w-full max-h-[220px] sm:max-h-[260px] lg:max-h-[300px] lg:aspect-[16/11]'>
              <div className='absolute inset-0 -z-10 scale-[1.02] rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 blur-sm' />
              <div className='relative h-full w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/40'>
                <Image
                  src={HERO_IMAGE}
                  alt='Graduate wearing a custom House of Stole'
                  fill
                  className='object-cover object-center'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything unlocked — app button icons */}
      <section className='border-b border-border/60 bg-muted/30'>
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8'>
          <div className='mx-auto mb-8 max-w-3xl space-y-2 text-center md:mb-10'>
            <h2 className='text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
              Everything unlocked with your stole
            </h2>
            <p className='text-pretty text-sm text-muted-foreground sm:text-base'>
              A curated set of tools, downloads, and opportunities designed to
              support you beyond graduation.
            </p>
          </div>
          <div className='grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8'>
            {featureStripItems.map(({ label, imageSrc }) => (
              <div
                key={label}
                className='flex flex-col items-center gap-2.5 text-center'
              >
                <AppIconFace src={imageSrc} alt='' size='md' />
                <span className='max-w-[7.5rem] text-xs font-semibold leading-snug text-foreground sm:text-sm'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits — rounded image on top, copy underneath */}
      <section className='border-b border-border/60 bg-background'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'>
          <div className='mx-auto mb-8 max-w-3xl space-y-2 text-center md:mb-10'>
            <h2 className='text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
              Everything you need for what’s next
            </h2>
            <p className='text-pretty text-sm text-muted-foreground sm:text-base'>
              Grad Drive brings together practical tools, creative resources,
              and real opportunities — all included when you order your stole.
            </p>
          </div>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
            {benefitCards.map((card) => (
              <div key={card.title} className='flex flex-col gap-3'>
                <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md shadow-black/10 ring-1 ring-border/30'>
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    className='object-cover transition-transform duration-300 hover:scale-[1.03]'
                    sizes='(max-width: 640px) 100vw, 25vw'
                  />
                </div>
                <div className='space-y-1.5 px-0.5'>
                  <div className='flex items-center gap-2.5'>
                    <AppIconFace src={card.iconSrc} size='xs' />
                    <h3 className='text-base font-bold leading-snug text-foreground'>
                      {card.title}
                    </h3>
                  </div>
                  <p className='text-sm leading-relaxed text-muted-foreground'>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className='mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground md:mt-12'>
            <Lock className='h-4 w-4 shrink-0 text-primary' />
            <span>Included with every House of Stole order.</span>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className='bg-muted/30'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'>
          <div className='mx-auto mb-8 max-w-3xl space-y-2 text-center md:mb-10'>
            <h2 className='text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
              How Grad Drive Works
            </h2>
            <p className='text-pretty text-sm text-muted-foreground sm:text-base'>
              Simple steps. Instant access. Lasting impact.
            </p>
          </div>
          <div className='mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8'>
            {howItWorksSteps.map((step) => (
              <div
                key={step.step}
                className='relative flex flex-col items-center text-center'
              >
                <div className='mb-4 flex w-full justify-center'>
                  <div className='relative inline-flex'>
                    <AppIconFace src={step.imageSrc} size='lg' />
                    <span className='absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm'>
                      {step.step}
                    </span>
                  </div>
                </div>
                <h3 className='mb-2 text-lg font-bold text-foreground'>
                  {step.title}
                </h3>
                <p className='mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground'>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className='mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4'>
            <Button
              size='lg'
              variant='secondary'
              className='w-full cursor-pointer rounded-xl bg-primary px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto'
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
              className='w-full cursor-pointer rounded-xl bg-accent px-8 py-6 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 sm:w-auto'
              onClick={openSignup}
            >
              Get Grad Drive Access
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
