'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Camera,
  FileImage,
  BookOpen,
  Award,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  Bell,
} from 'lucide-react';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
// import { AdminSidebarPromo } from '@/components/admin/admin-sidebar-promo';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/photographers', label: 'Fotomatic', icon: Camera },
  { href: '/admin/posters', label: 'Posters', icon: FileImage },
  { href: '/admin/cap-designs', label: 'Cap Designs', icon: GraduationCap },
  { href: '/admin/ebooks', label: 'E-books', icon: BookOpen },
  { href: '/admin/scholarship', label: 'Scholarships', icon: Award },
  // { href: '/admin/customizer', label: 'Customizer', icon: Palette },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/logs', label: 'System Logs', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function navActive(pathname: string, href: string, end?: boolean) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOutUser();
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('adminPasskeyVerified');
        sessionStorage.removeItem('adminRole');
        localStorage.removeItem('adminViewMode');
      }
      router.push('/');
      router.refresh();
    }
    onNavigate?.();
  };

  return (
    <div className='flex h-full flex-col bg-muted/50'>
      <div className='flex h-16 items-center border-b border-border px-4'>
        <Link
          href='/admin/dashboard'
          className='flex items-center gap-2 min-w-0'
          onClick={onNavigate}
          aria-label='Grad Drive admin home'
        >
          <Image
            src='/images/logo.png'
            alt=''
            width={36}
            height={36}
            className='h-9 w-9 shrink-0 object-contain'
          />
          <Image
            src='/images/graddrive.png'
            alt='Grad Drive'
            width={140}
            height={36}
            className='h-7 w-auto max-w-[120px] object-contain object-left'
          />
        </Link>
      </div>

      <nav className='flex-1 space-y-1 overflow-y-auto p-3'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = navActive(pathname, item.href, item.end);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                'transition-all duration-200 ease-out',
                active
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground hover:translate-x-0.5',
              )}
            >
              <Icon className='h-4 w-4 shrink-0' strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className='space-y-3 border-t border-border p-3'>
        {/* <AdminSidebarPromo /> */}
        <Button
          variant='outline'
          className='w-full justify-center gap-2 rounded-xl border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm'
          onClick={handleLogout}
        >
          <LogOut className='h-4 w-4' />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className='hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col md:border-r md:border-border'>
      <AdminSidebarNav />
    </aside>
  );
}
