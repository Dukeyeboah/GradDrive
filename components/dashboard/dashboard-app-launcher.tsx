'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { signOutUser } from '@/lib/firebase/auth';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  DASHBOARD_APP_LAUNCHER,
  type DashboardAppItem,
} from '@/lib/config/dashboard-app-launcher';

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 800;
const PREVIEW_SCALE = 0.22;
const PREVIEW_FRAME_W = Math.round(PREVIEW_WIDTH * PREVIEW_SCALE);
const PREVIEW_FRAME_H = Math.round(PREVIEW_HEIGHT * PREVIEW_SCALE);

function previewHref(href: string) {
  const join = href.includes('?') ? '&' : '?';
  return `${href}${join}embed=1`;
}

function PagePreviewFrame({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  if (!active) {
    return (
      <div
        className='flex items-center justify-center bg-muted text-xs text-muted-foreground'
        style={{ width: PREVIEW_FRAME_W, height: PREVIEW_FRAME_H }}
      >
        Loading preview…
      </div>
    );
  }

  return (
    <div
      className='relative overflow-hidden bg-muted'
      style={{ width: PREVIEW_FRAME_W, height: PREVIEW_FRAME_H }}
    >
      <iframe
        src={previewHref(href)}
        title={`Preview of ${label}`}
        tabIndex={-1}
        loading='lazy'
        className='pointer-events-none absolute left-0 top-0 border-0 bg-background'
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `scale(${PREVIEW_SCALE})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

function AppTile({
  app,
  index,
  onLogout,
  onSoon,
  onNavigate,
  size,
  showPreview,
}: {
  app: DashboardAppItem;
  index: number;
  onLogout: () => void;
  onSoon: () => void;
  onNavigate?: () => void;
  size: 'lg' | 'sm' | 'xs';
  showPreview: boolean;
}) {
  const Icon = app.icon;
  const isExternal = Boolean(app.href?.startsWith('http'));
  const hasImage = Boolean(app.imageSrc);
  const [previewOpen, setPreviewOpen] = useState(false);

  const canPreviewPage =
    showPreview &&
    size === 'lg' &&
    app.action === 'navigate' &&
    Boolean(app.href) &&
    !isExternal;

  const faceSize =
    size === 'lg'
      ? 'h-[5.5rem] w-[5.5rem] rounded-[1.45rem] sm:h-[6.25rem] sm:w-[6.25rem] sm:rounded-[1.65rem]'
      : size === 'sm'
        ? 'h-12 w-12 rounded-[0.9rem]'
        : 'h-10 w-10 rounded-[0.8rem]';

  const labelClass =
    size === 'lg'
      ? 'max-w-[8rem] text-xs sm:max-w-[9rem] sm:text-sm'
      : size === 'sm'
        ? 'max-w-[4.5rem] text-[9px] leading-tight'
        : 'max-w-[3.75rem] text-[8px] leading-tight';

  const iconLucide =
    size === 'lg' ? 'h-9 w-9 sm:h-10 sm:w-10' : size === 'sm' ? 'h-5 w-5' : 'h-4 w-4';

  // Stagger float like AIAM category cards
  const floatDelay = size === 'lg' ? `${-(index % 7) * 0.45}s` : undefined;
  const floatDuration = size === 'lg' ? `${5.5 + (index % 5) * 0.35}s` : undefined;

  const label = (
    <span
      className={cn(
        'line-clamp-2 text-center font-semibold text-foreground/90',
        labelClass,
      )}
    >
      {app.label}
    </span>
  );

  const face = hasImage ? (
    <span
      className={cn(
        'block shadow-md shadow-black/15',
        faceSize,
        size === 'lg' && 'animate-float',
      )}
      style={
        size === 'lg'
          ? { animationDelay: floatDelay, animationDuration: floatDuration }
          : undefined
      }
    >
      <span className='relative block h-full w-full overflow-hidden rounded-[inherit] transition-transform duration-300 group-hover:scale-105'>
        <Image
          src={app.imageSrc!}
          alt=''
          fill
          className='object-cover'
          sizes={size === 'lg' ? '100px' : '48px'}
        />
      </span>
    </span>
  ) : (
    <span
      className={cn(
        'block shadow-md shadow-black/15',
        faceSize,
        size === 'lg' && 'animate-float',
      )}
      style={
        size === 'lg'
          ? { animationDelay: floatDelay, animationDuration: floatDuration }
          : undefined
      }
    >
      <span
        className='flex h-full w-full items-center justify-center rounded-[inherit] backdrop-blur-md transition-transform duration-300 group-hover:scale-105'
        style={{
          backgroundImage: `linear-gradient(135deg, ${app.gradient.from}, ${app.gradient.to})`,
        }}
      >
        <Icon className={cn('text-slate-700', iconLucide)} strokeWidth={1.75} />
      </span>
    </span>
  );

  const content = (
    <>
      {face}
      {label}
    </>
  );

  const className = cn(
    'group flex w-full flex-col items-center justify-start rounded-2xl border-none bg-transparent',
    'cursor-pointer transition-all duration-300 hover:-translate-y-0.5',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    size === 'lg' ? 'gap-2.5 p-1.5' : 'gap-1.5 p-1',
  );

  let control: React.ReactNode;

  if (app.action === 'logout') {
    control = (
      <button
        type='button'
        className={className}
        onClick={onLogout}
        aria-label={app.label}
      >
        {content}
      </button>
    );
  } else if (app.action === 'soon') {
    control = (
      <button
        type='button'
        className={cn(className, 'opacity-90')}
        onClick={onSoon}
        aria-label={`${app.label} (coming soon)`}
      >
        {content}
      </button>
    );
  } else if (isExternal && app.href) {
    control = (
      <a
        href={app.href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
        aria-label={app.label}
        onClick={() => onNavigate?.()}
      >
        {content}
      </a>
    );
  } else {
    control = (
      <Link
        href={app.href || '/dashboard'}
        className={className}
        onClick={() => onNavigate?.()}
      >
        {content}
      </Link>
    );
  }

  if (!canPreviewPage) return control;

  return (
    <HoverCard
      openDelay={280}
      closeDelay={120}
      open={previewOpen}
      onOpenChange={setPreviewOpen}
    >
      <HoverCardTrigger asChild>{control}</HoverCardTrigger>
      <HoverCardContent
        side='top'
        className='w-auto overflow-hidden rounded-2xl border-border/80 p-0 shadow-xl'
      >
        <PagePreviewFrame
          href={app.href!}
          label={app.label}
          active={previewOpen}
        />
        <div className='border-t border-border/60 px-3 py-2'>
          <p className='text-sm font-semibold text-foreground'>{app.label}</p>
          <p className='text-[11px] text-muted-foreground'>Page preview</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function DashboardAppLauncher({
  onNavigate,
  className,
  size = 'lg',
  showPreview = false,
  columns = 'home',
}: {
  onNavigate?: () => void;
  className?: string;
  size?: 'lg' | 'sm' | 'xs';
  showPreview?: boolean;
  columns?: 'home' | 'launchpad';
} = {}) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    onNavigate?.();
    await signOutUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminViewMode');
    }
    router.push('/');
  };

  const handleSoon = () => {
    toast({
      title: 'Coming soon',
      description: 'This Grad Drive app is on the way.',
    });
  };

  return (
    <section aria-label='Grad Drive apps' className={className}>
      <div
        className={cn(
          'mx-auto grid justify-items-center',
          columns === 'home'
            ? 'max-w-5xl grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-9 md:grid-cols-7 md:gap-x-9 md:gap-y-10'
            : 'grid-cols-3 gap-x-3 gap-y-4',
        )}
      >
        {DASHBOARD_APP_LAUNCHER.map((app, index) => (
          <AppTile
            key={app.id}
            app={app}
            index={index}
            onLogout={() => void handleLogout()}
            onSoon={handleSoon}
            onNavigate={onNavigate}
            size={size}
            showPreview={showPreview}
          />
        ))}
      </div>
    </section>
  );
}
