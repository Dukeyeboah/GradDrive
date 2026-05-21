'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Calendar, Loader2, UsersRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileMediaUploads } from '@/components/dashboard/profile-media-uploads';

export default function AccountPage() {
  const { user, userData, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    collegeName: '',
    collegeGroup: '',
    major: '',
    graduationYear: '',
    bio: '',
    interests: '',
    photoURL: '',
    bannerPhotoURL: '',
    directoryOptIn: true,
    secondaryEmail: '',
  });

  useEffect(() => {
    if (!userData) return;
    setForm({
      displayName: userData.displayName?.trim() || '',
      collegeName: userData.collegeName?.trim() || '',
      collegeGroup: userData.collegeGroup?.trim() || '',
      major: userData.major?.trim() || '',
      graduationYear: userData.graduationYear?.trim() || '',
      bio: userData.bio?.trim() || '',
      interests: userData.interests?.trim() || '',
      photoURL: userData.photoURL?.trim() || '',
      bannerPhotoURL: userData.bannerPhotoURL?.trim() || '',
      directoryOptIn: userData.directoryOptIn !== false,
      secondaryEmail: userData.secondaryEmail?.trim() || '',
    });
  }, [userData]);

  const getMemberSince = () => {
    if (userData?.createdAt) {
      const date = userData.createdAt.toDate
        ? userData.createdAt.toDate()
        : new Date(userData.createdAt);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
    return 'N/A';
  };

  const getInitial = () => {
    if (userData?.displayName) {
      return userData.displayName.charAt(0).toUpperCase();
    }
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const sec = form.secondaryEmail.trim();
    if (sec && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sec)) {
      toast({
        title: 'Invalid secondary email',
        description: 'Enter a valid address or leave the field empty.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    const { error } = await updateUserProfile(user.uid, {
      displayName: form.displayName.trim() || null,
      collegeName: form.collegeName.trim() || null,
      collegeGroup: form.collegeGroup.trim() || null,
      major: form.major.trim() || null,
      graduationYear: form.graduationYear.trim() || null,
      bio: form.bio.trim() || null,
      interests: form.interests.trim() || null,
      photoURL: form.photoURL.trim() || null,
      bannerPhotoURL: form.bannerPhotoURL.trim() || null,
      directoryOptIn: form.directoryOptIn,
      secondaryEmail: sec ? sec.toLowerCase() : null,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save', description: error, variant: 'destructive' });
      return;
    }
    await refreshUserData();
    toast({ title: 'Saved', description: 'Your profile has been updated.' });
  };

  return (
    <div className='flex flex-col justify-center items-center w-full py-12'>
      <div className='container max-w-3xl space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='font-bold text-3xl md:text-4xl text-balance'>My Account</h1>
          <p className='text-lg text-muted-foreground text-balance'>
            Manage your profile and Grad Drivers directory presence
          </p>
        </div>

        <Card className='border-border bg-card shadow-sm'>
          <CardHeader>
            <div className='flex items-center gap-4'>
              {userData?.photoURL || form.photoURL ? (
                <img
                  src={form.photoURL || userData?.photoURL || ''}
                  alt={userData?.displayName || 'User'}
                  className='h-16 w-16 rounded-full object-cover border border-border'
                  onError={(e) => {
                    const img = e.currentTarget;
                    const parent = img.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className =
                        'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600';
                      fallback.innerHTML = `<span class="text-white font-semibold text-xl">${getInitial()}</span>`;
                      parent.replaceChild(fallback, img);
                    }
                  }}
                />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600'>
                  <span className='text-white font-semibold text-xl'>{getInitial()}</span>
                </div>
              )}
              <div>
                <CardTitle>Profile & directory</CardTitle>
                <CardDescription>
                  Updates here sync to your{' '}
                  <Link
                    href='/dashboard/grad-drivers'
                    className='font-medium text-accent hover:underline inline-flex items-center gap-1'
                  >
                    <UsersRound className='h-3.5 w-3.5' />
                    Grad Drivers
                  </Link>{' '}
                  card when directory visibility is on.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className='space-y-5'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full name</Label>
                <Input
                  id='name'
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder='Your full name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email address</Label>
                <Input
                  id='email'
                  type='email'
                  value={userData?.email || ''}
                  disabled
                  className='bg-muted cursor-not-allowed'
                />
                <p className='text-xs text-muted-foreground'>Email cannot be changed</p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='secondaryEmail'>Secondary email (optional)</Label>
                <Input
                  id='secondaryEmail'
                  type='email'
                  placeholder='alternate@example.com'
                  value={form.secondaryEmail}
                  onChange={(e) =>
                    setForm({ ...form, secondaryEmail: e.target.value })
                  }
                  autoComplete='email'
                />
                <p className='text-xs text-muted-foreground'>
                  For notifications or a backup contact. Not shown on your public Grad
                  Drivers profile.
                </p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='institution'>College / university</Label>
                  <Input
                    id='institution'
                    value={form.collegeName}
                    onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                    placeholder='University name'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='graduation'>Graduation year</Label>
                  <Input
                    id='graduation'
                    value={form.graduationYear}
                    onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                    placeholder='2025'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='collegeGroup'>College group (optional)</Label>
                <Input
                  id='collegeGroup'
                  value={form.collegeGroup}
                  onChange={(e) => setForm({ ...form, collegeGroup: e.target.value })}
                  placeholder='e.g. Class council, club…'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='major'>Major / field of study</Label>
                <Input
                  id='major'
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                  placeholder='e.g. Computer Science'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder='A short introduction for your public profile'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='interests'>Interests</Label>
                <Textarea
                  id='interests'
                  rows={3}
                  value={form.interests}
                  onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  placeholder='Hobbies, causes, industries…'
                />
              </div>
              <div className='rounded-xl border border-border bg-muted/30 p-4 sm:p-5'>
                {user ? (
                  <ProfileMediaUploads
                    userId={user.uid}
                    avatarUrl={form.photoURL}
                    bannerUrl={form.bannerPhotoURL}
                    onAvatarUrlChange={(url) => setForm((f) => ({ ...f, photoURL: url }))}
                    onBannerUrlChange={(url) =>
                      setForm((f) => ({ ...f, bannerPhotoURL: url }))
                    }
                    showCombinedHeroPreview
                    persistHint='Uploaded files are stored in your account. Click Save changes below to update your Grad Drivers profile.'
                  />
                ) : null}
              </div>
              <div className='flex items-start gap-3 rounded-xl border border-border p-4'>
                <Checkbox
                  id='directoryOptIn'
                  checked={form.directoryOptIn}
                  onCheckedChange={(v) =>
                    setForm({ ...form, directoryOptIn: v === true })
                  }
                  className='mt-1'
                />
                <div className='space-y-1'>
                  <Label htmlFor='directoryOptIn' className='text-base cursor-pointer'>
                    Show me in the Grad Drivers directory
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    Other signed-in members can see your card and profile. Your email is
                    never listed publicly.
                  </p>
                </div>
              </div>
              <Button type='submit' disabled={saving} className='rounded-xl'>
                {saving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='border-border bg-card shadow-sm'>
            <CardHeader>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 mb-2'>
                <Mail className='h-5 w-5 text-white' />
              </div>
              <CardTitle className='text-lg'>Member since</CardTitle>
              <CardDescription>{getMemberSince()}</CardDescription>
            </CardHeader>
          </Card>

          <Card className='border-border bg-card shadow-sm'>
            <CardHeader>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 mb-2'>
                <Calendar className='h-5 w-5 text-white' />
              </div>
              <CardTitle className='text-lg'>Account status</CardTitle>
              <CardDescription>Active member</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className='border-border bg-card shadow-sm'>
          <CardHeader>
            <CardTitle>Access summary</CardTitle>
            <CardDescription>Your available perks and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-accent' />
                <span>Full access to digital asset library</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-accent' />
                <span>E-book downloads available</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-accent' />
                <span>Photographer network access</span>
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-accent' />
                <span>Scholarship program eligibility</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
