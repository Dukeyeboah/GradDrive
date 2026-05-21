'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { SignupPasskeyModal } from '@/components/signup-passkey-modal';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

/**
 * Blocks the dashboard shell until the user is signed in.
 * Offers passkey unlock (saved in localStorage) before sign-up on the home page.
 */
export function GradDriveAccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [passkeyOpen, setPasskeyOpen] = useState(false);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/35'>
        <Loader2 className='h-8 w-8 animate-spin text-accent' aria-label='Loading' />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className='flex min-h-screen items-center justify-center bg-muted/35 px-4 py-12'>
          <Card className='w-full max-w-md border-border shadow-lg rounded-2xl'>
            <CardHeader className='text-center space-y-4'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent'>
                <Lock className='h-7 w-7' strokeWidth={1.75} />
              </div>
              <CardTitle className='text-2xl'>Grad Drive is for members</CardTitle>
              <CardDescription className='text-base leading-relaxed'>
                Sign in if you already have an account. New here? Unlock access with your
                passkey on this device, then create your account from the home page.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              <Button
                asChild
                className='w-full rounded-xl h-11 font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
              >
                <Link href='/'>Go to home — Log in or sign up</Link>
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='w-full rounded-xl h-11 font-semibold'
                onClick={() => setPasskeyOpen(true)}
              >
                I have a passkey — Unlock this device
              </Button>
            </CardContent>
          </Card>
        </div>
        <SignupPasskeyModal
          open={passkeyOpen}
          onOpenChange={setPasskeyOpen}
          onVerified={() => {
            setPasskeyOpen(false);
            toast({
              title: 'Access unlocked on this device',
              description:
                'Return to the home page and choose Sign up to create your account.',
            });
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}
