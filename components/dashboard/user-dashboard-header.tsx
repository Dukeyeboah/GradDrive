'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, Shield, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { useDashboardSearch } from '@/contexts/DashboardSearchContext';
import { useLaunchpad } from '@/contexts/LaunchpadContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function UserDashboardHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const { userData } = useAuth();
  const { setViewMode, isAdminViewingAsUser } = useViewMode();
  const { searchForcedOpen, toggleSearch } = useDashboardSearch();
  const { openLaunchpad } = useLaunchpad();
  const [avatarMenuMounted, setAvatarMenuMounted] = useState(false);

  useEffect(() => {
    setAvatarMenuMounted(true);
  }, []);

  const isAdmin =
    userData?.role === 'admin' || userData?.role === 'super admin';

  const getInitial = () => {
    if (userData?.displayName) {
      return userData.displayName.charAt(0).toUpperCase();
    }
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className='flex h-12 shrink-0 items-center gap-2 bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:gap-3 sm:px-4 md:h-14 md:px-6'>
      <Link
        href='/dashboard'
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

      <div className='flex flex-1 items-center justify-end gap-1 sm:gap-1.5'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={cn(
            'h-9 w-9 shrink-0 rounded-full',
            searchForcedOpen && 'bg-muted text-foreground',
          )}
          onClick={toggleSearch}
          aria-label={searchForcedOpen ? 'Hide search' : 'Show search'}
          aria-pressed={searchForcedOpen}
        >
          <Search className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon'
          className='h-9 w-9 shrink-0 rounded-full'
          asChild
        >
          <Link href='/dashboard/notifications' aria-label='Notifications'>
            <Bell className='h-4 w-4' />
          </Link>
        </Button>

        {avatarMenuMounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full p-0'
              >
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.displayName || 'User'}
                    className='h-full w-full rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent'>
                    {getInitial()}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuItem
                className='flex cursor-pointer items-center gap-2'
                onSelect={() => openLaunchpad()}
              >
                <LayoutGrid className='h-4 w-4' />
                Launchpad
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/dashboard/account' className='flex items-center gap-2'>
                  <User className='h-4 w-4' />
                  Account
                </Link>
              </DropdownMenuItem>
              {isAdmin && isAdminViewingAsUser && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setViewMode('admin');
                      router.push('/admin/dashboard');
                      toast({
                        title: 'Switched to Admin View',
                        description: 'You are now viewing the admin dashboard.',
                      });
                    }}
                    className='flex items-center gap-2'
                  >
                    <Shield className='h-4 w-4' />
                    Switch to Admin View
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOutUser();
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('adminViewMode');
                  }
                  router.push('/');
                }}
                className='flex items-center gap-2'
              >
                <LogOut className='h-4 w-4' />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className='h-9 w-9 shrink-0 rounded-full bg-muted' aria-hidden />
        )}
      </div>
    </header>
  );
}
