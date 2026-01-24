'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Chrome, Loader2, Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PHOTOGRAPHER_PASSKEY } from '@/lib/config/photographer';
import {
  signInEmailPassword,
  signUpEmailPassword,
  signInWithGoogle,
} from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if passkey was verified
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('photographerPasskeyVerified');
      if (verified === 'true') {
        setPasskeyVerified(true);
      }
    }

    // Wait for auth to be ready
    if (user === undefined) {
      return; // Still loading auth state
    }

    setCheckingAuth(false);

    // If user is already logged in and passkey is verified, redirect to dashboard immediately
    if (
      user &&
      typeof window !== 'undefined' &&
      sessionStorage.getItem('photographerPasskeyVerified') === 'true'
    ) {
      router.push('/photographer-admin/dashboard');
    }
  }, [user, userData, router]);

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passkey !== PHOTOGRAPHER_PASSKEY) {
      const errorMessage = 'The passkey you entered is incorrect. Please check and try again, or contact an administrator if you believe this is an error.';
      setPasskeyError(errorMessage);
      toast({
        title: 'Incorrect Passkey',
        description: errorMessage,
        variant: 'destructive',
      });
      setPasskey(''); // Clear the input
      return;
    }

    // Clear error on successful passkey
    setPasskeyError(null);

    // Store passkey verification in sessionStorage
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

    // Validate signup form
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
        if (!formData.name.trim()) {
          setSignupError('Please enter your name');
          setLoading(false);
          return;
        }
        result = await signUpEmailPassword(
          formData.email,
          formData.password,
          formData.name,
          'photographer-admin' as any
        );
      }

      if (result.error) {
        // Check if it's a "user not found" error for login
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
        // For testing: allow access without checking photographer profile
        toast({
          title: 'Success',
          description: isLogin
            ? 'Signed in successfully!'
            : 'Account created successfully!',
        });
        router.push('/photographer-admin/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Ensure passkey verification is stored
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('photographerPasskeyVerified', 'true');
      }
      
      const { user, error } = await signInWithGoogle('photographer-admin');
      
      if (error) {
        // Check for specific permission denied error
        if (error === 'PERMISSION_DENIED_ROLE_UPGRADE') {
          toast({
            title: 'Access Denied',
            description: 'Your account does not have photographer privileges. Please contact an administrator to upgrade your account role, or sign in with a different account that has photographer access.',
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
      
      if (user) {
        toast({
          title: 'Success',
          description: 'Signed in successfully!',
        });
        router.push('/photographer-admin/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show passkey form if not verified
  if (!passkeyVerified) {
    return (
      <main className='flex-col flex justify-center items-center min-h-screen bg-muted/30'>
        <div className='container py-20'>
          <div className='mx-auto max-w-md space-y-6'>
            <div className='text-center space-y-4'>
              <div className='flex items-center justify-center gap-2 mb-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-md bg-primary'>
                  <Camera className='h-6 w-6 text-primary-foreground' />
                </div>
                <span className='font-bold text-2xl text-foreground'>
                  Grad Drive
                </span>
              </div>
              <h1 className='font-bold text-3xl md:text-4xl text-balance text-foreground'>
                HoS GradDrive Photographer Portal
              </h1>
              <p className='text-muted-foreground text-balance'>
                Access your photographer dashboard to manage your profile and
                bookings
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enter Passkey</CardTitle>
                <CardDescription>
                  Please enter the photographer passkey to continue
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
                    <Label htmlFor='passkey'>Photographer Passkey</Label>
                    <Input
                      id='passkey'
                      type='password'
                      placeholder='Enter passkey'
                      value={passkey}
                      onChange={(e) => {
                        setPasskey(e.target.value);
                        // Clear error when user starts typing
                        if (passkeyError) {
                          setPasskeyError(null);
                        }
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

  // Show login/signup form after passkey verification
  return (
    <main className='flex-col flex justify-center items-center min-h-screen bg-muted/30'>
      <div className='container py-20'>
        <div className='mx-auto max-w-md space-y-6'>
          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-md bg-primary'>
                <Camera className='h-6 w-6 text-primary-foreground' />
              </div>
              <span className='font-bold text-2xl text-foreground'>
                Grad Drive
              </span>
            </div>
            <h1 className='font-bold text-3xl md:text-4xl text-balance text-foreground'>
              {isLogin ? 'Photographer Login' : 'Photographer Sign Up'}
            </h1>
            <p className='text-muted-foreground text-balance'>
              {isLogin
                ? 'Sign in to access your photographer dashboard'
                : 'Create an account to access your photographer dashboard'}
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
