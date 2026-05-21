'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, UserRound, X } from 'lucide-react';
import { uploadUserProfileImage } from '@/lib/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

type ProfileMediaUploadsProps = {
  userId: string;
  avatarUrl: string;
  bannerUrl: string;
  onAvatarUrlChange: (url: string) => void;
  onBannerUrlChange: (url: string) => void;
  /** Shown under the controls (e.g. remind to save Firestore on Settings). */
  persistHint?: string;
  /** When true, shows a sample “profile page” header using current avatar + banner URLs */
  showCombinedHeroPreview?: boolean;
  className?: string;
};

export function ProfileMediaUploads({
  userId,
  avatarUrl,
  bannerUrl,
  onAvatarUrlChange,
  onBannerUrlChange,
  persistHint,
  showCombinedHeroPreview,
  className,
}: ProfileMediaUploadsProps) {
  const { toast } = useToast();
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [busyAvatar, setBusyAvatar] = useState(false);
  const [busyBanner, setBusyBanner] = useState(false);

  async function onPick(
    file: File | undefined,
    kind: 'avatar' | 'banner',
  ) {
    if (!file) return;
    const setBusy = kind === 'avatar' ? setBusyAvatar : setBusyBanner;
    const apply = kind === 'avatar' ? onAvatarUrlChange : onBannerUrlChange;
    setBusy(true);
    const { url, error } = await uploadUserProfileImage(userId, kind, file);
    setBusy(false);
    if (error || !url) {
      toast({
        title: 'Upload failed',
        description: error || 'Could not upload this file.',
        variant: 'destructive',
      });
      return;
    }
    apply(url);
  }

  return (
    <div className={cn('space-y-8', className)}>
      {showCombinedHeroPreview ? (
        <div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
          <div className='relative h-36 sm:h-44 w-full bg-gradient-to-br from-cyan-900/30 via-muted to-violet-900/25'>
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt=''
                className='absolute inset-0 h-full w-full object-cover'
              />
            ) : null}
            <div className='absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent' />
          </div>
          <div className='relative px-5 pb-5 pt-0 -mt-14 flex flex-col items-center sm:items-start sm:pl-8'>
            <div className='h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md'>
              {avatarUrl ? (
                <img src={avatarUrl} alt='' className='h-full w-full object-cover' />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                  <UserRound className='h-14 w-14' strokeWidth={1.25} />
                </div>
              )}
            </div>
            <p className='mt-3 text-center sm:text-left text-xs text-muted-foreground max-w-sm'>
              Preview of how your banner and profile photo appear on your Grad Drivers
              public profile. Uploads apply after you save.
            </p>
          </div>
        </div>
      ) : null}

      <div className='space-y-3'>
        <Label>Profile photo</Label>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
          <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted'>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=''
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                <UserRound className='h-10 w-10' strokeWidth={1.25} />
              </div>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <input
              ref={avatarRef}
              type='file'
              accept={ACCEPT}
              className='sr-only'
              onChange={(e) => {
                void onPick(e.target.files?.[0], 'avatar');
                e.target.value = '';
              }}
            />
            <Button
              type='button'
              variant='secondary'
              className='rounded-xl gap-2'
              disabled={busyAvatar}
              onClick={() => avatarRef.current?.click()}
            >
              {busyAvatar ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Upload className='h-4 w-4' />
              )}
              {busyAvatar ? 'Uploading…' : 'Upload photo'}
            </Button>
            {avatarUrl ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='gap-1 text-muted-foreground'
                onClick={() => onAvatarUrlChange('')}
              >
                <X className='h-4 w-4' />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
        <p className='text-xs text-muted-foreground'>
          JPEG, PNG, WebP, or GIF · up to 5MB
        </p>
      </div>

      <div className='space-y-3'>
        <Label>Banner image</Label>
        <div className='space-y-3'>
          <div className='relative h-28 w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted'>
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt=''
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full min-h-[7rem] w-full items-center justify-center text-sm text-muted-foreground'>
                Wide image works best (e.g. 1200×400)
              </div>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <input
              ref={bannerRef}
              type='file'
              accept={ACCEPT}
              className='sr-only'
              onChange={(e) => {
                void onPick(e.target.files?.[0], 'banner');
                e.target.value = '';
              }}
            />
            <Button
              type='button'
              variant='secondary'
              className='rounded-xl gap-2'
              disabled={busyBanner}
              onClick={() => bannerRef.current?.click()}
            >
              {busyBanner ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Upload className='h-4 w-4' />
              )}
              {busyBanner ? 'Uploading…' : 'Upload banner'}
            </Button>
            {bannerUrl ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='gap-1 text-muted-foreground'
                onClick={() => onBannerUrlChange('')}
              >
                <X className='h-4 w-4' />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
        <p className='text-xs text-muted-foreground'>
          JPEG, PNG, WebP, or GIF · up to 5MB
        </p>
      </div>

      {persistHint ? (
        <p className='text-xs text-muted-foreground border-t border-border pt-4'>
          {persistHint}
        </p>
      ) : null}
    </div>
  );
}
