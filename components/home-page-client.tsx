'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicNav } from '@/components/public-nav';
import { WelcomeScreen } from '@/components/welcome-screen';
import { LandingAuthProvider } from '@/contexts/LandingAuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultAppHome } from '@/lib/auth/roles';

export function HomePageClient() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only redirect when Firestore has a user profile. Otherwise a Google popup can
  // briefly set `user` before our flow rolls back (no passkey), which used to send
  // people to /dashboard and feel like a long lag before the gate appeared.
  useEffect(() => {
    if (authLoading || !user || !userData) return;
    router.replace(getDefaultAppHome(userData.role));
  }, [user, userData, authLoading, router]);

  if (!mounted || authLoading) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <div className='h-16 md:h-[4.25rem] border-b border-border/60 bg-background animate-pulse' />
        <div className='flex-1 bg-muted/20' />
      </div>
    );
  }

  if (user && userData) {
    return (
      <div className='min-h-screen flex flex-col bg-background'>
        <div className='h-16 md:h-[4.25rem] border-b border-border/60 bg-background' />
        <div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
          Taking you to your dashboard…
        </div>
      </div>
    );
  }

  return (
    <LandingAuthProvider>
      <PublicNav />
      <WelcomeScreen />
    </LandingAuthProvider>
  );
}
