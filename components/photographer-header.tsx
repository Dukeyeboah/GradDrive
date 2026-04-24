'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/firebase/auth';
import { usePhotographerBasePath } from '@/hooks/use-photographer-base-path';

export function PhotographerHeader() {
  const router = useRouter();
  const basePath = usePhotographerBasePath();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('photographerPasskeyVerified');
    }
    router.push('/');
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6 pl-8'>
          <Link
            href={`${basePath}/dashboard`}
            className='flex items-center gap-2 sm:gap-3 shrink-0'
            aria-label='Grad Drive photographer home'
          >
            <Image
              src='/images/logo.png'
              alt=''
              width={40}
              height={40}
              className='h-8 w-8 sm:h-9 sm:w-9 object-contain'
            />
            <Image
              src='/images/graddrive.png'
              alt='Grad Drive'
              width={160}
              height={40}
              className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
            />
          </Link>
          <nav className='hidden md:flex items-center gap-4'>
            <Link href={`${basePath}/dashboard`}>
              <Button variant='ghost' size='sm'>
                Dashboard
              </Button>
            </Link>
            <Link href={`${basePath}/profile`}>
              <Button variant='ghost' size='sm'>
                Profile
              </Button>
            </Link>
            <Link href={`${basePath}/bookings`}>
              <Button variant='ghost' size='sm'>
                Bookings
              </Button>
            </Link>
          </nav>
        </div>
        <div className='flex items-center gap-2'>
          {user && (
            <>
              <Link href='/'>
                <Button variant='ghost' size='sm' className='gap-2'>
                  <Home className='h-4 w-4' />
                  Home
                </Button>
              </Link>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSignOut}
                className='gap-2'
              >
                <LogOut className='h-4 w-4' />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
