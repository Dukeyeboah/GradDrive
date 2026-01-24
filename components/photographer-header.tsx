'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/firebase/auth';

export function PhotographerHeader() {
  const router = useRouter();
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
            href='/photographer-admin/dashboard'
            className='flex items-center gap-2'
          >
            <Camera className='h-6 w-6' />
            <span className='font-bold text-lg'>
              HoS GradDrive Photographer Portal
            </span>
          </Link>
          <nav className='hidden md:flex items-center gap-4'>
            <Link href='/photographer-admin/dashboard'>
              <Button variant='ghost' size='sm'>
                Dashboard
              </Button>
            </Link>
            <Link href='/photographer-admin/profile'>
              <Button variant='ghost' size='sm'>
                Profile
              </Button>
            </Link>
            <Link href='/photographer-admin/bookings'>
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
