'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLandingAuth } from '@/contexts/LandingAuthContext';

/**
 * Navbar brand assets (on disk):
 * - Mark:     public/images/logo.png (legacy: logo-legacy.png)
 * - Full logo: public/images/graddrive.png (legacy: graddrive-legacy.png)
 */

export function PublicNav() {
  const { openLogin, openSignup } = useLandingAuth();

  return (
    <nav className='sticky top-0 z-50 flex w-full items-center justify-center bg-background'>
      <div className='container flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-16 lg:px-8'>
        <Link
          href='/'
          className='flex shrink-0 items-center overflow-visible'
          aria-label='Grad Drive home'
        >
          <Image
            src='/images/logo.png'
            alt='Grad Drive'
            width={64}
            height={36}
            className='h-8 w-auto bg-transparent object-contain object-left sm:hidden'
            priority
            unoptimized
          />
          <Image
            src='/images/graddrive-update.png'
            alt='Grad Drive'
            width={280}
            height={52}
            className='hidden h-9 w-auto max-w-[min(58vw,280px)] bg-transparent object-contain object-left sm:block'
            priority
            unoptimized
          />
        </Link>

        <div className='flex items-center gap-4 md:gap-6'>
          <button
            type='button'
            className='cursor-pointer text-sm font-medium text-foreground hover:text-accent transition-colors'
            onClick={openLogin}
          >
            Login
          </button>
          <Button
            size='sm'
            className='cursor-pointer rounded-xl px-5 font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm'
            onClick={openSignup}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
}
