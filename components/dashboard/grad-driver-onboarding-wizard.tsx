'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles, Users, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileMediaUploads } from '@/components/dashboard/profile-media-uploads';

const STEP_COUNT = 4;

export function GradDriverOnboardingWizard() {
  const { user, userData, loading, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bannerPhotoURL, setBannerPhotoURL] = useState('');
  const [directoryOptIn, setDirectoryOptIn] = useState(true);

  useEffect(() => {
    if (loading || !user || !userData) return;
    if (userData.role !== 'user') return;
    if (
      userData.gradDriverOnboardingDismissed === true ||
      userData.gradDriverProfileComplete === true
    ) {
      return;
    }
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, [loading, user, userData]);

  useEffect(() => {
    if (!userData || !open) return;
    setBio(userData.bio?.trim() || '');
    setInterests(userData.interests?.trim() || '');
    setPhotoURL(userData.photoURL?.trim() || '');
    setBannerPhotoURL(userData.bannerPhotoURL?.trim() || '');
    setDirectoryOptIn(userData.directoryOptIn !== false);
  }, [userData, open]);

  const dismissOnly = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateUserProfile(user.uid, {
      gradDriverOnboardingDismissed: true,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save', description: error, variant: 'destructive' });
      return;
    }
    await refreshUserData();
    setOpen(false);
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateUserProfile(user.uid, {
      bio: bio.trim() || null,
      interests: interests.trim() || null,
      photoURL: photoURL.trim() || null,
      bannerPhotoURL: bannerPhotoURL.trim() || null,
      directoryOptIn,
      gradDriverProfileComplete: true,
      gradDriverOnboardingDismissed: true,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save profile', description: error, variant: 'destructive' });
      return;
    }
    await refreshUserData();
    toast({
      title: 'You are on the map',
      description: 'Other grad drivers can find you in the directory when visibility is on.',
    });
    setOpen(false);
  };

  if (!user || !userData || userData.role !== 'user') return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className='sm:max-w-lg max-h-[90vh] overflow-y-auto'
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            {step === 0 && (
              <>
                <Users className='h-5 w-5 text-accent' strokeWidth={1.75} />
                Meet other grad drivers
              </>
            )}
            {step === 1 && 'Tell your story'}
            {step === 2 && 'Make it yours'}
            {step === 3 && 'Visibility'}
          </DialogTitle>
          <DialogDescription className='text-left space-y-2'>
            {step === 0 && (
              <span>
                Grad Drive includes a directory of members who want to connect after
                graduation. A short profile helps classmates and alumni with similar
                interests find you for collaborations, advice, and community.
              </span>
            )}
            {step === 1 && (
              <span>
                A few lines go a long way. Share what you are studying, what you care
                about, or what you are looking for next.
              </span>
            )}
            {step === 2 && (
              <span>
                Optional photos personalize your profile. Upload from your device — they
                are stored securely and only you can replace them.
              </span>
            )}
            {step === 3 && (
              <span>
                You control whether you appear in the public directory. You can change
                this anytime under Settings.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='flex gap-1.5 pt-1'>
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <div
              key={i}
              className={
                i <= step
                  ? 'h-1 flex-1 rounded-full bg-accent'
                  : 'h-1 flex-1 rounded-full bg-muted'
              }
            />
          ))}
        </div>

        {step === 1 && (
          <div className='space-y-4 py-2'>
            <div className='space-y-2'>
              <Label htmlFor='gdo-bio'>Bio</Label>
              <Textarea
                id='gdo-bio'
                rows={4}
                placeholder='What are you working toward? What should people know about you?'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='gdo-interests'>Interests</Label>
              <Textarea
                id='gdo-interests'
                rows={3}
                placeholder='e.g. Product design, civic tech, running, Afrobeats…'
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && user && (
          <div className='space-y-4 py-2'>
            <div className='flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground'>
              <ImageIcon className='h-5 w-5 shrink-0 text-accent mt-0.5' strokeWidth={1.75} />
              <p>
                Your school and graduation year from your account already appear on your
                card. Add photos here if you like — leave empty to use your default avatar
                only.
              </p>
            </div>
            <ProfileMediaUploads
              userId={user.uid}
              avatarUrl={photoURL}
              bannerUrl={bannerPhotoURL}
              onAvatarUrlChange={setPhotoURL}
              onBannerUrlChange={setBannerPhotoURL}
              showCombinedHeroPreview
            />
          </div>
        )}

        {step === 3 && (
          <div className='space-y-4 py-2'>
            <div className='flex items-start gap-3 rounded-xl border border-border p-4'>
              <Checkbox
                id='gdo-optin'
                checked={directoryOptIn}
                onCheckedChange={(v) => setDirectoryOptIn(v === true)}
                className='mt-1'
              />
              <div className='space-y-1'>
                <Label htmlFor='gdo-optin' className='text-base font-medium cursor-pointer'>
                  List me in the Grad Drivers directory
                </Label>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  Other signed-in members can browse your card and open your full profile.
                  Your email is never shown on your public page.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-2 text-sm text-muted-foreground'>
              <Sparkles className='h-4 w-4 shrink-0 text-accent mt-0.5' strokeWidth={1.75} />
              <span>
                Tip: refine your profile anytime under{' '}
                <Link href='/dashboard/account' className='font-medium text-accent hover:underline'>
                  Settings
                </Link>
                .
              </span>
            </div>
          </div>
        )}

        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center pt-2'>
          <Button
            type='button'
            variant='ghost'
            className='text-muted-foreground'
            disabled={saving}
            onClick={() => {
              if (step === 0) void dismissOnly();
              else setStep((s) => Math.max(0, s - 1));
            }}
          >
            {step === 0 ? 'Maybe later' : 'Back'}
          </Button>
          <div className='flex gap-2 justify-end'>
            {step < STEP_COUNT - 1 ? (
              <Button type='button' onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type='button' disabled={saving} onClick={() => void finish()}>
                {saving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving…
                  </>
                ) : (
                  'Save & finish'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
