'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicNav } from '@/components/public-nav';
import { WelcomeScreen } from '@/components/welcome-screen';
import { UserPasskeyGate } from '@/components/user-passkey-gate';
import { useAuth } from '@/contexts/AuthContext';

export function HomePageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [passkeyVerified, setPasskeyVerified] = useState(false);

  useEffect(() => {
    setPasskeyVerified(localStorage.getItem('userPasskeyVerified') === 'true');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    router.replace('/dashboard');
  }, [user, authLoading, router]);

  if (!mounted || authLoading) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <div className='h-16 md:h-[4.25rem] border-b border-border/60 bg-background animate-pulse' />
        <div className='flex-1 bg-muted/20' />
      </div>
    );
  }

  if (user) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <div className='h-16 md:h-[4.25rem] border-b border-border/60 bg-background' />
        <div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
          Taking you to your dashboard…
        </div>
      </div>
    );
  }

  if (!passkeyVerified) {
    return <UserPasskeyGate onVerified={() => setPasskeyVerified(true)} />;
  }

  return (
    <>
      <PublicNav />
      <WelcomeScreen />
    </>
  );
}
