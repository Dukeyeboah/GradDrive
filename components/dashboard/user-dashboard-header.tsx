'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, Search, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  BookOpen,
  Camera,
  Award,
  FileImage,
  PlaneTakeoff,
  Landmark,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { DASHBOARD_SEARCH_ROUTES } from '@/lib/config/user-dashboard';

export function UserDashboardHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { userData } = useAuth();
  const { setViewMode, isAdminViewingAsUser } = useViewMode();
  const [query, setQuery] = useState('');
  /** Radix dropdown IDs differ SSR vs client — render menu only after mount. */
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

  const resolveSearch = (raw: string) => {
    const q = raw.trim().toLowerCase();
    if (!q) return '/dashboard/ebooks';
    for (const { keywords, href } of DASHBOARD_SEARCH_ROUTES) {
      if (keywords.some((k) => q.includes(k))) return href;
    }
    return '/dashboard';
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(resolveSearch(query));
    setQuery('');
  };

  return (
    <header className='sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6'>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='md:hidden shrink-0'
        onClick={onMenuClick}
        aria-label='Open menu'
      >
        <Menu className='h-5 w-5' />
      </Button>

      <form
        onSubmit={onSearch}
        className='flex flex-1 justify-end md:justify-end'
      >
        <div className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none' />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search resources, tools, and more...'
            className='h-10 w-full rounded-xl border-border bg-muted/40 pl-9 pr-3 text-sm'
            aria-label='Search dashboard'
          />
        </div>
      </form>

      <Button
        variant='ghost'
        size='icon'
        className='shrink-0 rounded-full'
        asChild
      >
        <Link href='/dashboard/messages' aria-label='Notifications'>
          <Bell className='h-5 w-5' />
        </Link>
      </Button>

      {avatarMenuMounted ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0 rounded-full h-10 w-10 p-0 overflow-hidden relative'
            >
              {userData?.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName || 'User'}
                  className='h-full w-full rounded-full object-cover'
                />
              ) : (
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent'>
                  {getInitial()}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>Quick links</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/dashboard' className='flex items-center gap-2'>
                <LayoutDashboard className='h-4 w-4' />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/grad-drive'
                className='flex items-center gap-2'
              >
                <Compass className='h-4 w-4' />
                Explore offerings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/photographers'
                className='flex items-center gap-2'
              >
                <Camera className='h-4 w-4' />
                Photography
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/ebooks' className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4' />
                Ebooks &amp; Guides
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/posters' className='flex items-center gap-2'>
                <FileImage className='h-4 w-4' />
                Posters &amp; Artworks
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/discounts' className='flex items-center gap-2'>
                <PlaneTakeoff className='h-4 w-4' />
                Travel opportunities
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/cap-designs'
                className='flex items-center gap-2'
              >
                <GraduationCap className='h-4 w-4' />
                Cap Designs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/scholarship'
                className='flex items-center gap-2'
              >
                <Award className='h-4 w-4' />
                Scholarships
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/kente-history'
                className='flex items-center gap-2'
              >
                <Landmark className='h-4 w-4' />
                Cultural Content
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/dashboard/alum-club' className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Events
              </Link>
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
        <div
          className='h-10 w-10 shrink-0 rounded-full bg-muted'
          aria-hidden
        />
      )}
    </header>
  );
}
