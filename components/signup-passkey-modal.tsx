'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { USER_PASSKEY, setGradDriveAccessUnlocked } from '@/lib/config/user';
import { useToast } from '@/hooks/use-toast';
import { notifyGradDriveAccessChanged } from '@/hooks/use-grad-drive-access';

type Screen = 'hub' | 'passkey' | 'request' | 'request-success';

export type SignupPasskeyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  /** From hub: user already has an account */
  onRequestLogin?: () => void;
};

export function SignupPasskeyModal({
  open,
  onOpenChange,
  onVerified,
  onRequestLogin,
}: SignupPasskeyModalProps) {
  const { toast } = useToast();
  const [screen, setScreen] = useState<Screen>('hub');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [requestEmail, setRequestEmail] = useState('');
  const [requestDisplayName, setRequestDisplayName] = useState('');
  const [requestCollege, setRequestCollege] = useState('');
  const [requestGradYear, setRequestGradYear] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccessEmail, setRequestSuccessEmail] = useState('');

  useEffect(() => {
    if (!open) return;
    setScreen('hub');
    setPasskey('');
    setError(null);
    setRequestEmail('');
    setRequestDisplayName('');
    setRequestCollege('');
    setRequestGradYear('');
    setRequestSuccessEmail('');
  }, [open]);

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passkey !== USER_PASSKEY) {
      setError(
        'That passkey is incorrect. Use the passkey from your House of Stole order, or request one below.',
      );
      setPasskey('');
      return;
    }

    setPasskey('');
    setGradDriveAccessUnlocked();
    notifyGradDriveAccessChanged();
    onVerified();
  };

  const handleRequestPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = requestEmail.trim().toLowerCase();
    const displayName = requestDisplayName.trim();
    const collegeName = requestCollege.trim();
    const graduationYear = requestGradYear.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Enter a valid email address so we can reply.',
        variant: 'destructive',
      });
      return;
    }
    if (!displayName || !collegeName || !graduationYear) {
      toast({
        title: 'Missing information',
        description: 'Please fill in your name, school, and graduation year.',
        variant: 'destructive',
      });
      return;
    }

    setRequestLoading(true);
    try {
      const res = await fetch('/api/request-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          displayName,
          collegeName,
          graduationYear,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const description =
          typeof data?.error === 'string'
            ? data.error
            : 'Something went wrong. Try again later.';
        toast({
          title:
            res.status === 503 &&
            data?.code === 'FIREBASE_ADMIN_NOT_CONFIGURED'
              ? 'Server not set up for requests'
              : 'Request failed',
          description,
          variant: 'destructive',
          duration: res.status === 503 ? 16_000 : 8_000,
        });
        return;
      }
      setRequestSuccessEmail(email);
      setRequestEmail('');
      setRequestDisplayName('');
      setRequestCollege('');
      setRequestGradYear('');
      setScreen('request-success');
    } catch {
      toast({
        title: 'Network error',
        description: 'Could not send your request. Check your connection.',
        variant: 'destructive',
      });
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-auto'>
        {screen === 'hub' && (
          <>
            <DialogHeader>
              <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent'>
                <Lock className='h-6 w-6' strokeWidth={1.75} />
              </div>
              <DialogTitle className='text-center text-xl'>
                To access Grad Drive, you need an account
              </DialogTitle>
              <DialogDescription className='text-center text-base leading-relaxed'>
                Eligible graduates unlock sign-up with an access passkey from House of
                Stole. Already joined? Sign in—no passkey required.
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-3 pt-2'>
              {onRequestLogin ? (
                <Button
                  type='button'
                  variant='secondary'
                  className='w-full rounded-xl h-11 font-semibold'
                  onClick={() => {
                    onOpenChange(false);
                    onRequestLogin();
                  }}
                >
                  I have an account → Log in
                </Button>
              ) : null}
              <Button
                type='button'
                className='w-full rounded-xl h-11 font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
                onClick={() => setScreen('passkey')}
              >
                Get access → Enter passkey
              </Button>
              <Button
                type='button'
                variant='ghost'
                className='w-full rounded-xl text-muted-foreground'
                onClick={() => setScreen('request')}
              >
                No passkey? Request by email
              </Button>
            </div>
          </>
        )}

        {screen === 'passkey' && (
          <>
            <DialogHeader>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='w-fit -ml-2 gap-1 text-muted-foreground mb-1'
                onClick={() => {
                  setError(null);
                  setScreen('hub');
                }}
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
              <DialogTitle>Enter passkey</DialogTitle>
              <DialogDescription>
                Unlock access to create your Grad Drive account. Your unlock is saved on
                this device until you clear site data.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePasskeySubmit} className='space-y-4'>
              {error ? (
                <Alert variant='destructive' className='rounded-xl'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Incorrect passkey</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className='space-y-2'>
                <Label htmlFor='signup-passkey'>Passkey</Label>
                <Input
                  id='signup-passkey'
                  type='password'
                  placeholder='Enter your passkey'
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    setError(null);
                  }}
                  required
                  autoComplete='off'
                  className='rounded-xl'
                />
              </div>
              <Button
                type='submit'
                className='w-full rounded-xl font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
              >
                Unlock access
              </Button>
            </form>
          </>
        )}

        {screen === 'request-success' && (
          <>
            <DialogHeader className='text-center sm:text-center'>
              <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'>
                <CheckCircle2 className='h-9 w-9' strokeWidth={1.75} />
              </div>
              <DialogTitle className='text-xl'>Request submitted</DialogTitle>
              <DialogDescription className='text-base leading-relaxed'>
                Thank you! Your passkey request has been sent for review. If you
                are approved, we will email you at{' '}
                <span className='font-medium text-foreground'>
                  {requestSuccessEmail}
                </span>{' '}
                with your access passkey and sign-up instructions. Please check
                your inbox and spam folder in the next few days.
              </DialogDescription>
            </DialogHeader>
            <Button
              type='button'
              className='w-full rounded-xl font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </>
        )}

        {screen === 'request' && (
          <>
            <DialogHeader>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='w-fit -ml-2 gap-1 text-muted-foreground mb-1'
                onClick={() => setScreen('hub')}
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
              <DialogTitle>Request a passkey</DialogTitle>
              <DialogDescription>
                Tell us who you are and where you study. We&apos;ll notify Grad Drive
                admins and email you if your request is approved.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRequestPasskey} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='passkey-request-name'>Full name</Label>
                <Input
                  id='passkey-request-name'
                  type='text'
                  placeholder='Your full name'
                  value={requestDisplayName}
                  onChange={(e) => setRequestDisplayName(e.target.value)}
                  required
                  className='rounded-xl'
                  autoComplete='name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='passkey-request-email'>Email</Label>
                <Input
                  id='passkey-request-email'
                  type='email'
                  placeholder='you@example.com'
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  required
                  className='rounded-xl'
                  autoComplete='email'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='passkey-request-college'>College / university</Label>
                <Input
                  id='passkey-request-college'
                  type='text'
                  placeholder='e.g. University of Ghana'
                  value={requestCollege}
                  onChange={(e) => setRequestCollege(e.target.value)}
                  required
                  className='rounded-xl'
                  autoComplete='organization'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='passkey-request-year'>Graduation year</Label>
                <Input
                  id='passkey-request-year'
                  type='text'
                  inputMode='numeric'
                  placeholder='e.g. 2025'
                  value={requestGradYear}
                  onChange={(e) => setRequestGradYear(e.target.value)}
                  required
                  className='rounded-xl'
                />
              </div>
              <Button
                type='submit'
                variant='secondary'
                className='w-full rounded-xl gap-2 font-semibold'
                disabled={requestLoading}
              >
                {requestLoading ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail className='h-4 w-4' />
                    Request passkey
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
