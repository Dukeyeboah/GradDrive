'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AuthModals } from '@/components/auth-modals';
import { UserPasskeyModal } from '@/components/user-passkey-modal';

/**
 * Navbar brand assets (on disk):
 * - Logo mark: public/images/logo.png
 * - Wordmark:   public/images/graddrive.png
 * Adjust display size via the `className` on each <Image> (h-9 w-9, max-w-[...], etc.).
 */

export function PublicNav() {
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuthAfterPasskey = () => {
    setPasskeyModalOpen(false);
    setAuthOpen(true);
  };

  return (
    <>
      <nav className='sticky top-0 z-50 flex justify-center items-center w-full border-b border-border bg-background'>
        <div className='container flex h-16 md:h-[4.25rem] items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <Link
            href='/'
            className='flex items-center gap-2 sm:gap-3 shrink-0'
            aria-label='Grad Drive home'
          >
            <Image
              src='/images/logo.png'
              alt=''
              width={44}
              height={44}
              className='h-9 w-9 sm:h-10 sm:w-10 object-contain'
              priority
            />
            <Image
              src='/images/graddrive.png'
              alt='Grad Drive'
              width={160}
              height={40}
              className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
              priority
            />
          </Link>

          <div className='flex items-center gap-4 md:gap-6'>
            <button
              type='button'
              className='cursor-pointer text-sm font-medium text-foreground hover:text-accent transition-colors'
              onClick={() => {
                setAuthMode('login');
                if (typeof window !== 'undefined' && localStorage.getItem('userPasskeyVerified') === 'true') {
                  setAuthOpen(true);
                } else {
                  setPasskeyModalOpen(true);
                }
              }}
            >
              Login
            </button>
            <Button
              size='sm'
              className='cursor-pointer rounded-xl px-5 font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm'
              onClick={() => {
                setAuthMode('signup');
                if (typeof window !== 'undefined' && localStorage.getItem('userPasskeyVerified') === 'true') {
                  setAuthOpen(true);
                } else {
                  setPasskeyModalOpen(true);
                }
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
      <UserPasskeyModal
        open={passkeyModalOpen}
        onOpenChange={setPasskeyModalOpen}
        onVerified={openAuthAfterPasskey}
      />
      <AuthModals
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
