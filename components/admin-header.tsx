'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  Menu,
  UserCircle,
  Eye,
  Camera,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminSidebarNav } from '@/components/admin-sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function AdminHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const { userData } = useAuth();
  const { setViewMode, isAdminViewingAsUser, isAdminViewingAsPhotographer } =
    useViewMode();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const role = userData?.role || 'admin';
  const roleDisplay = role === 'super admin' ? 'Super Admin' : 'Admin';
  const displayName = userData?.displayName || 'Admin';

  const handleLogout = async () => {
    const { error } = await signOutUser();
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      return;
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminPasskeyVerified');
      sessionStorage.removeItem('adminRole');
      localStorage.removeItem('adminViewMode');
    }
    router.push('/');
    router.refresh();
  };

  const handleSwitchToUserView = () => {
    setViewMode('user');
    router.push('/dashboard');
    toast({
      title: 'Switched to User View',
      description:
        'You are now viewing the site as a regular user. Your admin permissions remain active.',
    });
  };

  const handleSwitchToPhotographerView = () => {
    setViewMode('photographer-admin');
    router.push('/photographer-admin/dashboard');
    toast({
      title: 'Switched to Photographer Admin View',
      description:
        'You are now viewing the photographer admin portal. Your admin permissions remain active.',
    });
  };

  return (
    <>
      <header className='sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='md:hidden shrink-0 rounded-lg'
          onClick={() => setMobileNavOpen(true)}
          aria-label='Open navigation'
        >
          <Menu className='h-5 w-5' />
        </Button>

        <div className='flex flex-1 items-center justify-end gap-2 sm:gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='shrink-0 rounded-full'
            asChild
          >
            <Link href='/admin/notifications' aria-label='Notifications'>
              <Bell className='h-5 w-5' />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className='flex max-w-[240px] items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 text-left transition-colors duration-200 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
              >
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt=''
                    className='h-9 w-9 shrink-0 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent'>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className='min-w-0 flex-1 hidden sm:block'>
                  <p className='truncate text-sm font-semibold text-foreground'>
                    {displayName}
                  </p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {roleDisplay}
                  </p>
                </div>
                <ChevronDown className='hidden h-4 w-4 shrink-0 text-muted-foreground sm:block' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/admin/settings' className='flex items-center gap-2'>
                  <UserCircle className='h-4 w-4' />
                  Account Profile
                </Link>
              </DropdownMenuItem>
              {!isAdminViewingAsUser && !isAdminViewingAsPhotographer && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSwitchToUserView}
                    className='flex items-center gap-2'
                  >
                    <Eye className='h-4 w-4' />
                    Switch to User View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSwitchToPhotographerView}
                    className='flex items-center gap-2'
                  >
                    <Camera className='h-4 w-4' />
                    Switch to Photographer View
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='flex items-center gap-2'
              >
                <LogOut className='h-4 w-4' />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side='left' className='w-72 p-0 flex flex-col'>
          <AdminSidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
