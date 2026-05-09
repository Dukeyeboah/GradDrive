'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Camera,
  BookOpen,
  FileImage,
  GraduationCap,
  Award,
  PlaneTakeoff,
  Landmark,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOutUser } from '@/lib/firebase/auth';
// import { DashboardSidebarPromo } from '@/components/dashboard/dashboard-sidebar-promo';

const NAV: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Explore', href: '/dashboard/grad-drive', icon: Compass },
  { label: 'Photography', href: '/dashboard/photographers', icon: Camera },
  { label: 'Ebooks & Guides', href: '/dashboard/ebooks', icon: BookOpen },
  { label: 'Posters & Artworks', href: '/dashboard/posters', icon: FileImage },
  { label: 'Travel opportunities', href: '/dashboard/discounts', icon: PlaneTakeoff },
  { label: 'Cap Designs', href: '/dashboard/cap-designs', icon: GraduationCap },
  { label: 'Scholarships', href: '/dashboard/scholarship', icon: Award },
  { label: 'Cultural Content', href: '/dashboard/kente-history', icon: Landmark },
  // { label: 'Tools & Resources', href: '/dashboard/ebooks', icon: Wrench },
  { label: 'Events', href: '/dashboard/alum-club', icon: Calendar },
  { label: 'Settings', href: '/dashboard/account', icon: Settings },
];

function isActive(pathname: string, href: string, end?: boolean) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function UserDashboardSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn('flex h-full flex-col bg-card border-border', className)}
    >
      <div className='flex h-16 items-center border-b border-border px-4'>
        <Link
          href='/dashboard'
          className='flex items-center gap-2 sm:gap-2.5'
          onClick={onNavigate}
        >
          <Image
            src='/images/logo.png'
            alt=''
            width={36}
            height={36}
            className='h-9 w-9 object-contain'
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

      <nav className='flex-1 space-y-0.5 overflow-y-auto p-3'>
        {NAV.map(({ label, href, icon: Icon, end }) => {
          const active = isActive(pathname, href, end);
          return (
            <Link key={`${href}-${label}`} href={href} onClick={onNavigate}>
              <span
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-200 ease-out',
                  active
                    ? 'bg-accent/15 text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-0.5',
                )}
              >
                <Icon className='h-4 w-4 shrink-0' strokeWidth={1.75} />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className='border-t border-border p-3 space-y-3'>
        {/* <DashboardSidebarPromo /> */}
        <Button
          variant='outline'
          className='w-full justify-center gap-2 rounded-xl border-border'
          onClick={async () => {
            await signOutUser();
            if (typeof window !== 'undefined') {
              localStorage.removeItem('adminViewMode');
            }
            router.push('/');
            onNavigate?.();
          }}
        >
          <LogOut className='h-4 w-4' />
          Logout
        </Button>
      </div>
    </div>
  );
}
