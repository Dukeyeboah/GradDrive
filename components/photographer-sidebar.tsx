'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Camera,
  Menu,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { usePhotographerSidebar } from '@/contexts/PhotographerSidebarContext';
import { usePhotographerBasePath } from '@/hooks/use-photographer-base-path';
import { Shield } from 'lucide-react';

const PHOTOGRAPHER_PREFIX = '/photographer-admin';
const navItems = [
  { path: `${PHOTOGRAPHER_PREFIX}/dashboard`, slug: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: `${PHOTOGRAPHER_PREFIX}/bookings`, slug: '/bookings', label: 'Bookings', icon: Bell },
];

export function PhotographerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = usePhotographerBasePath();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const { viewMode, setViewMode, isAdminViewingAsPhotographer } = useViewMode();
  const { isCollapsed, setIsCollapsed, openProfileModal } =
    usePhotographerSidebar();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Check if user is an admin
  const isAdmin = userData?.role === 'admin' || userData?.role === 'super admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const { error } = await signOutUser();
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else {
      // Clear photographer passkey verification and view mode
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('photographerPasskeyVerified');
        localStorage.removeItem('adminViewMode');
      }
      router.push('/');
      router.refresh();
    }
  };

  const handleSwitchToAdminView = () => {
    setViewMode('admin');
    router.push('/admin/dashboard');
    toast({
      title: 'Switched to Admin View',
      description: 'You are now viewing the admin dashboard.',
    });
  };

  const displayName =
    userData?.displayName || user?.displayName || 'User';
  const displayEmail = userData?.email || user?.email || '';
  const photoURL = userData?.photoURL || user?.photoURL;

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className='flex flex-col h-full'>
      <div
        className={cn(
          'p-5 border-b border-border',
          isCollapsed && !isMobile && 'p-4'
        )}
      >
        <div className='flex items-center justify-between'>
          {!isCollapsed && (
            <Link
              href={`${basePath}/dashboard`}
              className='flex items-center gap-2'
            >
              <div className='flex h-7 w-7 items-center justify-center rounded-md bg-primary'>
                <Camera className='h-4 w-4 text-primary-foreground' />
              </div>
              <div>
                <span className='font-bold text-sm block'>
                  Fotomatic
                </span>
              </div>
            </Link>
          )}
          {isCollapsed && !isMobile && (
            <Link
              href={`${basePath}/dashboard`}
              className='flex items-center justify-center w-full'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary'>
                <Camera className='h-4 w-4 text-primary-foreground' />
              </div>
            </Link>
          )}
        </div>
      </div>

      <nav className={cn('flex-1 p-4 space-y-1 relative', isMobile && 'pb-20')}>
        {!isMobile && (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'absolute -right-3 -top-4 h-6 w-6 rounded-full border border-border bg-card shadow-sm z-[100] hover:bg-accent transition-all',
              isCollapsed ? '-right-3' : '-right-3'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className='h-3 w-3' />
            ) : (
              <ChevronLeft className='h-3 w-3' />
            )}
          </Button>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = `${basePath}${item.slug}`;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isCollapsed && !isMobile && 'justify-center',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
              title={isCollapsed && !isMobile ? item.label : undefined}
            >
              <Icon className='h-4 w-4 flex-shrink-0' />
              {(!isCollapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-border'>
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className={cn(
                  'w-full justify-start gap-3',
                  isCollapsed && !isMobile && 'justify-center px-2'
                )}
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className='h-8 w-8 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600'>
                    <User className='h-4 w-4 text-white' />
                  </div>
                )}
                {(!isCollapsed || isMobile) && (
                  <div className='flex flex-col items-start flex-1 min-w-0'>
                    <span className='text-sm font-medium truncate w-full'>
                      {displayName}
                    </span>
                    <span className='text-xs text-muted-foreground truncate w-full'>
                      {displayEmail}
                    </span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>Your Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openProfileModal}>
                <Settings className='h-4 w-4 mr-2' />
                Profile Settings
              </DropdownMenuItem>
              {isAdmin && isAdminViewingAsPhotographer && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSwitchToAdminView}>
                    <Shield className='h-4 w-4 mr-2' />
                    Switch to Admin View
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className='h-4 w-4 mr-2' />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant='ghost'
            className={cn(
              'w-full justify-start gap-3',
              isCollapsed && !isMobile && 'justify-center px-2'
            )}
            disabled
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className='h-8 w-8 rounded-full object-cover'
              />
            ) : (
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600'>
                <User className='h-4 w-4 text-white' />
              </div>
            )}
            {(!isCollapsed || isMobile) && (
              <div className='flex flex-col items-start flex-1 min-w-0'>
                <span className='text-sm font-medium truncate w-full'>
                  {displayName}
                </span>
                <span className='text-xs text-muted-foreground truncate w-full'>
                  {displayEmail}
                </span>
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden md:flex relative'>
        <aside
          className={cn(
            'flex flex-col border-r border-border bg-card transition-all duration-300',
            isCollapsed ? 'w-16' : 'w-64'
          )}
        >
          <SidebarContent />
        </aside>
      </div>

      {/* Mobile Sidebar */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-sm'
            >
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-64 p-0'>
            <SheetHeader className='sr-only'>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className='flex flex-col h-full'>
              <SidebarContent isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
