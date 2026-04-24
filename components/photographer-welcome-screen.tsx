'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Chrome, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PHOTOGRAPHER_PASSKEY } from '@/lib/config/photographer';
import {
  signInEmailPassword,
  signUpEmailPassword,
  signInWithGoogle,
} from '@/lib/firebase/auth';
import { getUserRole } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const PHOTOGRAPHER_BASE = '/photographer-admin';

export function PhotographerWelcomeScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const [passkey, setPasskey] = useState('');
  const [passkeyVerified, setPasskeyVerified] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [signupError, setSignupError] = useState<string | null>(null);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('photographerPasskeyVerified') === 'true') {
        setPasskeyVerified(true);
      }
    }

    if (user === undefined) return;

    if (
      user &&
      typeof window !== 'undefined' &&
      sessionStorage.getItem('photographerPasskeyVerified') === 'true'
    ) {
      router.push(`${PHOTOGRAPHER_BASE}/dashboard`);
    }
  }, [user, userData, router]);

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passkey !== PHOTOGRAPHER_PASSKEY) {
      const errorMessage =
        'The passkey you entered is incorrect. Please check and try again, or contact an administrator if you believe this is an error.';
      setPasskeyError(errorMessage);
      toast({
        title: 'Incorrect Passkey',
        description: errorMessage,
        variant: 'destructive',
      });
      setPasskey('');
      return;
    }

    setPasskeyError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('photographerPasskeyVerified', 'true');
    }
    setPasskeyVerified(true);
    toast({
      title: 'Passkey Verified',
      description: 'You can now proceed to sign in or create an account.',
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSignupError(null);

    if (!isLogin && !formData.name.trim()) {
      setSignupError('Name is required for sign up');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await signInEmailPassword(formData.email, formData.password);
      } else {
        result = await signUpEmailPassword(
          formData.email,
          formData.password,
          formData.name,
          'photographer-admin' as const,
        );
      }

      if (result.error) {
        const isUserNotFound =
          result.error.includes('user-not-found') ||
          result.error.includes('User not found') ||
          result.error.includes('auth/user-not-found');

        if (isLogin && isUserNotFound) {
          toast({
            title: 'Account Not Found',
            description:
              'No account found with this email. Please sign up first.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: isLogin ? 'Sign In Error' : 'Sign Up Error',
            description: result.error,
            variant: 'destructive',
          });
        }
        setLoading(false);
        return;
      }

      if (result.user) {
        const role = await getUserRole(result.user.uid);
        if (role !== 'photographer-admin') {
          toast({
            title: 'Wrong account type',
            description:
              'This login is not a photographer account. Use the main site to sign in as a member.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        toast({
          title: 'Success',
          description: isLogin
            ? 'Signed in successfully!'
            : 'Account created successfully!',
        });
        router.push(`${PHOTOGRAPHER_BASE}/dashboard`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('photographerPasskeyVerified', 'true');
      }

      const { user: gUser, error } = await signInWithGoogle('photographer-admin');

      if (error) {
        if (error === 'PERMISSION_DENIED_ROLE_UPGRADE') {
          toast({
            title: 'Access Denied',
            description:
              'Your account does not have photographer privileges. Please contact an administrator.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        }
        setLoading(false);
        return;
      }

      if (gUser) {
        const role = await getUserRole(gUser.uid);
        if (role !== 'photographer-admin') {
          toast({
            title: 'Wrong account type',
            description:
              'This Google account is not registered as a photographer here.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        toast({
          title: 'Success',
          description: 'Signed in successfully!',
        });
        router.push(`${PHOTOGRAPHER_BASE}/dashboard`);
        router.refresh();
      }
    } catch (error: unknown) {
      console.error('Google auth error:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!passkeyVerified) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-muted/30'>
        <div className='container py-20'>
          <div className='mx-auto max-w-md space-y-6'>
            <div className='space-y-4 text-center'>
              <div className='mb-4 flex items-center justify-center gap-2 sm:gap-3'>
                <Image
                  src='/images/logo.png'
                  alt=''
                  width={44}
                  height={44}
                  className='h-9 w-9 sm:h-10 sm:w-10 object-contain'
                  priority
                />
                <Image
                  src='/images/graddrive.png'
                  alt='Grad Drive'
                  width={160}
                  height={40}
                  className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
                  priority
                />
              </div>
              <h1 className='text-balance text-3xl font-bold text-foreground md:text-4xl'>
                Photographer access
              </h1>
              <p className='text-balance text-muted-foreground'>
                Enter your photographer passkey to manage your profile and
                bookings on Grad Drive.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enter Passkey</CardTitle>
                <CardDescription>
                  Please enter your passkey to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasskeySubmit} className='space-y-4'>
                  {passkeyError && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Incorrect Passkey</AlertTitle>
                      <AlertDescription>{passkeyError}</AlertDescription>
                    </Alert>
                  )}
                  <div className='space-y-2'>
                    <Label htmlFor='passkey'>Passkey</Label>
                    <Input
                      id='passkey'
                      type='password'
                      placeholder='Enter passkey'
                      value={passkey}
                      onChange={(e) => {
                        setPasskey(e.target.value);
                        if (passkeyError) setPasskeyError(null);
                      }}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type='submit' className='w-full'>
                    Verify Passkey
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-muted/30'>
      <div className='container py-20'>
        <div className='mx-auto max-w-md space-y-6'>
          <div className='space-y-4 text-center'>
            <div className='mb-4 flex items-center justify-center gap-2 sm:gap-3'>
              <Image
                src='/images/logo.png'
                alt=''
                width={44}
                height={44}
                className='h-9 w-9 sm:h-10 sm:w-10 object-contain'
                priority
              />
              <Image
                src='/images/graddrive.png'
                alt='Grad Drive'
                width={160}
                height={40}
                className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
                priority
              />
            </div>
            <h1 className='text-balance text-3xl font-bold text-foreground md:text-4xl'>
              {isLogin ? 'Photographer Login' : 'Photographer Sign Up'}
            </h1>
            <p className='text-balance text-muted-foreground'>
              {isLogin
                ? 'Sign in to access your photographer dashboard'
                : 'Create an account to access the photographer portal'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
              <CardDescription>
                {isLogin
                  ? 'Enter your credentials to access your dashboard'
                  : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailAuth} className='space-y-4'>
                {!isLogin && (
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name *</Label>
                    <Input
                      id='name'
                      type='text'
                      placeholder='John Doe'
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setSignupError(null);
                      }}
                      required
                    />
                    {signupError && (
                      <p className='text-sm text-destructive'>{signupError}</p>
                    )}
                  </div>
                )}
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : isLogin ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <Chrome className='mr-2 h-4 w-4' />
                Google
              </Button>
            </CardContent>
            <CardFooter className='flex flex-col space-y-4'>
              <Button
                variant='link'
                className='w-full'
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Button>
              <Link
                href='/'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                ← Back to home
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
