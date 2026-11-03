'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DASHBOARD_APP_LAUNCHER } from '@/lib/config/dashboard-app-launcher';
import { useToast } from '@/hooks/use-toast';
import { signOutUser } from '@/lib/firebase/auth';

/** Centered horizontal app-icon strip for dashboard pages (hidden on Explore). */
export function DashboardPageChrome() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  // Home dashboard is the icon grid — no need for the strip there.
  if (pathname === '/dashboard') {
    return null;
  }

  const onLogout = async () => {
    await signOutUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminViewMode');
    }
    router.push('/');
  };

  const onSoon = () => {
    toast({
      title: 'Coming soon',
      description: 'This Grad Drive app is on the way.',
    });
  };

  return (
    <div className='border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90'>
      <div className='mx-auto max-w-7xl px-3 py-1.5 sm:px-6 lg:px-8'>
        <div className='overflow-x-auto scrollbar-none'>
          <div className='mx-auto flex w-max items-center justify-center gap-2.5 py-0.5'>
            {DASHBOARD_APP_LAUNCHER.map((app) => {
              const active =
                app.href &&
                (app.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === app.href ||
                    pathname.startsWith(`${app.href}/`));

              const face = (
                <span
                  className={cn(
                    'relative block h-9 w-9 overflow-hidden rounded-[0.7rem] shadow-sm transition-transform group-hover:scale-105',
                    active &&
                      'ring-2 ring-accent ring-offset-1 ring-offset-background',
                  )}
                >
                  {app.imageSrc ? (
                    <Image
                      src={app.imageSrc}
                      alt=''
                      fill
                      className='object-cover'
                      sizes='36px'
                    />
                  ) : (
                    <span
                      className='flex h-full w-full items-center justify-center'
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${app.gradient.from}, ${app.gradient.to})`,
                      }}
                    >
                      <app.icon
                        className='h-4 w-4 text-slate-700'
                        strokeWidth={1.75}
                      />
                    </span>
                  )}
                </span>
              );

              if (app.action === 'logout') {
                return (
                  <button
                    key={app.id}
                    type='button'
                    className='group flex shrink-0 flex-col items-center gap-0.5'
                    onClick={() => void onLogout()}
                    aria-label={app.label}
                    title={app.label}
                  >
                    {face}
                  </button>
                );
              }

              if (app.action === 'soon') {
                return (
                  <button
                    key={app.id}
                    type='button'
                    className='group flex shrink-0 flex-col items-center gap-0.5 opacity-90'
                    onClick={onSoon}
                    aria-label={`${app.label} (coming soon)`}
                    title={app.label}
                  >
                    {face}
                  </button>
                );
              }

              if (app.href?.startsWith('http')) {
                return (
                  <a
                    key={app.id}
                    href={app.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex shrink-0 flex-col items-center gap-0.5'
                    aria-label={app.label}
                    title={app.label}
                  >
                    {face}
                  </a>
                );
              }

              return (
                <Link
                  key={app.id}
                  href={app.href || '/dashboard'}
                  className='group flex shrink-0 flex-col items-center gap-0.5'
                  aria-label={app.label}
                  title={app.label}
                >
                  {face}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
