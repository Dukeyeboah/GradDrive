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
  LayoutDashboard,
  Users,
  Camera,
  FileImage,
  BookOpen,
  Award,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  LogOut,
  UserCircle,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/photographers', label: 'Photographers', icon: Camera },
  { href: '/admin/posters', label: 'Posters', icon: FileImage },
  { href: '/admin/cap-designs', label: 'Cap Designs', icon: GraduationCap },
  { href: '/admin/ebooks', label: 'E-books', icon: BookOpen },
  { href: '/admin/scholarship', label: 'Scholarship', icon: Award },
  { href: '/admin/customizer', label: 'Customizer', icon: Palette },
  { href: '/admin/logs', label: 'System Logs', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      // Clear admin passkey verification
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('adminPasskeyVerified');
        sessionStorage.removeItem('adminRole');
      }
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className='hidden md:flex relative'>
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className={cn('p-5 border-b border-border', isCollapsed && 'p-4')}>
          <div className='flex items-center justify-between'>
            {!isCollapsed && (
              <Link href='/admin/dashboard' className='flex items-center gap-2'>
                <div className='flex h-7 w-7 items-center justify-center rounded-md bg-primary'>
                  <span className='font-bold text-primary-foreground text-lg'>
                    GD
                  </span>
                </div>
                <div>
                  <span className='font-bold text-lg block'>Grad Drive</span>
                  {/* <span className='text-xs text-muted-foreground'>
                    Admin Portal
                  </span> */}
                </div>
              </Link>
            )}
            {isCollapsed && (
              <Link
                href='/admin/dashboard'
                className='flex items-center justify-center w-full'
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary'>
                  <span className='font-bold text-primary-foreground text-lg'>
                    GD
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <nav className='flex-1 p-4 space-y-1 relative'>
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isCollapsed && 'justify-center',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className='h-4 w-4 flex-shrink-0' />
                {!isCollapsed && <span>{item.label}</span>}
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
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName || 'User'}
                      className='h-8 w-8 rounded-full object-cover'
                    />
                  ) : (
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600'>
                      <User className='h-4 w-4 text-white' />
                    </div>
                  )}
                  {!isCollapsed && (
                    <div className='flex flex-col items-start'>
                      <span className='text-sm font-medium'>
                        {userData?.displayName || 'Admin User'}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {userData?.email || 'admin@graddrive.com'}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/admin/settings'>
                    <UserCircle className='h-4 w-4 mr-2' />
                    Account Profile
                  </Link>
                </DropdownMenuItem>
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
                isCollapsed && 'justify-center px-2'
              )}
              disabled
            >
              {userData?.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName || 'User'}
                  className='h-8 w-8 rounded-full object-cover'
                />
              ) : (
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600'>
                  <User className='h-4 w-4 text-white' />
                </div>
              )}
              {!isCollapsed && (
                <div className='flex flex-col items-start'>
                  <span className='text-sm font-medium'>
                    {userData?.displayName || 'Admin User'}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {userData?.email || 'admin@graddrive.com'}
                  </span>
                </div>
              )}
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
