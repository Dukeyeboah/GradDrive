'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { USER_PASSKEY } from '@/lib/config/user';

interface UserPasskeyGateProps {
  onVerified: () => void;
}

export function UserPasskeyGate({ onVerified }: UserPasskeyGateProps) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passkey !== USER_PASSKEY) {
      setError(
        'That passkey is incorrect. Please enter the passkey you were given with your House of Stole order to access Grad Drive.',
      );
      setPasskey('');
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userPasskeyVerified', 'true');
      localStorage.setItem('userPasskeyVerified', 'true');
    }
    setPasskey('');
    onVerified();
  };

  return (
    <main className='min-h-screen flex flex-col bg-background'>
      <header className='border-b border-border/60 bg-background'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-[4.25rem] flex items-center'>
          <Link
            href='/'
            className='flex items-center gap-2 sm:gap-3 shrink-0'
            aria-label='Grad Drive home'
          >
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
          </Link>
        </div>
      </header>

      <div className='flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16 border-b border-border/60 bg-muted/30'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-3'>
            <div className='inline-flex items-center rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-sm font-medium text-secondary-foreground'>
              🔐 Graduate access
            </div>
            <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance'>
              Enter your passkey
            </h1>
            <p className='text-muted-foreground text-pretty leading-relaxed'>
              Grad Drive is for our House of Stole graduate clients. Enter the
              passkey you received with your stole purchase to access everything
              included on Grad Drive—tools, downloads, and opportunities for your
              journey beyond graduation.
            </p>
          </div>

          <Card className='border-border/80 shadow-md rounded-2xl'>
            <CardContent className='pt-6'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                {error ? (
                  <Alert variant='destructive' className='rounded-xl'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Incorrect passkey</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}
                <div className='space-y-2'>
                  <Label htmlFor='gate-passkey'>Passkey</Label>
                  <Input
                    id='gate-passkey'
                    type='password'
                    placeholder='Enter passkey'
                    value={passkey}
                    onChange={(e) => {
                      setPasskey(e.target.value);
                      setError(null);
                    }}
                    required
                    autoComplete='off'
                    autoFocus
                    className='rounded-xl'
                  />
                </div>
                <Button
                  type='submit'
                  className='w-full rounded-xl py-6 text-base font-semibold bg-accent text-accent-foreground shadow-sm hover:bg-accent/90'
                >
                  Access Grad Drive
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
