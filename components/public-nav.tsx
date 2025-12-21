'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { AuthModals } from '@/components/auth-modals';

export function PublicNav() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <>
      <nav className='flex justify-center items-center z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between px-4 md:px-4'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary'>
              <span className='font-bold text-primary-foreground text-lg'>
                GD
              </span>
            </div>
            <span className='font-bold text-xl text-foreground'>
              Grad Drive
            </span>
          </Link>

          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setAuthMode('login');
                setAuthOpen(true);
              }}
            >
              Log in
            </Button>
            <Button
              size='sm'
              className='gap-2'
              onClick={() => {
                setAuthMode('signup');
                setAuthOpen(true);
              }}
            >
              <User className='h-4 w-4' />
              Sign up
            </Button>
          </div>
        </div>
      </nav>
      <AuthModals
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
