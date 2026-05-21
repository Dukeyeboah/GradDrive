'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  getGradDriverPublicProfile,
  type GradDriverPublicProfile,
} from '@/lib/firebase/firestore';

export default function GradDriverProfilePage() {
  const params = useParams();
  const uid = typeof params?.uid === 'string' ? params.uid : '';
  const { user } = useAuth();
  const [profile, setProfile] = useState<GradDriverPublicProfile | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const p = await getGradDriverPublicProfile(uid);
      if (!cancelled) setProfile(p);
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const isSelf = user?.uid === uid;
  const hiddenFromOthers =
    profile &&
    profile.directoryVisible !== true &&
    !isSelf;

  if (profile === undefined) {
    return (
      <div className='w-full px-4 py-16 text-center text-muted-foreground text-sm'>
        Loading profile…
      </div>
    );
  }

  if (!profile || hiddenFromOthers) {
    return (
      <div className='w-full px-4 py-12 sm:px-6'>
        <div className='mx-auto max-w-lg space-y-6 text-center'>
          <Card className='border-border'>
            <CardHeader>
              <CardTitle>Profile unavailable</CardTitle>
              <CardDescription>
                This member is not listed in the directory, or the profile does not
                exist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant='secondary' className='rounded-xl'>
                <Link href='/dashboard/grad-drivers'>Back to directory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const banner = profile.bannerPhotoURL?.trim();
  const avatar = profile.photoURL?.trim();

  return (
    <div className='w-full pb-12'>
      <div className='border-b border-border bg-muted/25'>
        <div className='mx-auto max-w-4xl px-4 pt-6 sm:px-6'>
          <Button
            variant='ghost'
            size='sm'
            asChild
            className='mb-4 gap-1 text-muted-foreground hover:text-foreground -ml-2'
          >
            <Link href='/dashboard/grad-drivers'>
              <ArrowLeft className='h-4 w-4' />
              Directory
            </Link>
          </Button>
        </div>
        <div className='relative h-40 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-cyan-900/40 via-background to-violet-900/30'>
          {banner ? (
            <img src={banner} alt='' className='h-full w-full object-cover' />
          ) : null}
          <div className='absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent' />
        </div>
      </div>

      <div className='mx-auto max-w-4xl px-4 sm:px-6 -mt-16 relative z-10'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
            <div className='h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-lg'>
              {avatar ? (
                <img src={avatar} alt='' className='h-full w-full object-cover' />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-muted text-muted-foreground'>
                  <UserRound className='h-14 w-14' strokeWidth={1.25} />
                </div>
              )}
            </div>
            <div className='space-y-1 pb-1'>
              <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                {profile.displayName || 'Grad Driver'}
              </h1>
              <p className='text-muted-foreground'>
                {[profile.collegeName, profile.graduationYear && `Class of ${profile.graduationYear}`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {profile.major?.trim() && (
                <p className='text-sm font-medium text-accent'>{profile.major}</p>
              )}
            </div>
          </div>
          {isSelf && (
            <Button asChild variant='outline' className='rounded-xl shrink-0'>
              <Link href='/dashboard/account'>Edit profile</Link>
            </Button>
          )}
        </div>

        <div className='mt-10 grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2 border-border shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg'>About</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm leading-relaxed text-muted-foreground'>
              {profile.bio?.trim() ? (
                <p className='whitespace-pre-wrap text-foreground/90'>{profile.bio.trim()}</p>
              ) : (
                <p className='italic'>No bio yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className='border-border shadow-sm h-fit'>
            <CardHeader>
              <CardTitle className='text-lg'>Interests</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              {profile.interests?.trim() ? (
                <p className='whitespace-pre-wrap text-foreground/90'>{profile.interests.trim()}</p>
              ) : (
                <p className='italic'>Not shared yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {profile.collegeGroup?.trim() && (
          <p className='mt-8 text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>Group:</span>{' '}
            {profile.collegeGroup}
          </p>
        )}
      </div>
    </div>
  );
}
