'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AuthModals } from '@/components/auth-modals';
import { SignupPasskeyModal } from '@/components/signup-passkey-modal';
import {
  readGradDriveAccessUnlocked,
} from '@/lib/config/user';

type LandingAuthContextValue = {
  openLogin: () => void;
  openSignup: () => void;
};

const defaultValue: LandingAuthContextValue = {
  openLogin: () => {},
  openSignup: () => {},
};

const LandingAuthContext =
  createContext<LandingAuthContextValue>(defaultValue);

export function LandingAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [passkeyOpen, setPasskeyOpen] = useState(false);

  const openLogin = useCallback(() => {
    setPasskeyOpen(false);
    setAuthMode('login');
    setAuthOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    if (readGradDriveAccessUnlocked()) {
      setAuthMode('signup');
      setAuthOpen(true);
    } else {
      setAuthOpen(false);
      setPasskeyOpen(true);
    }
  }, []);

  const handleAuthModeChange = useCallback((mode: 'login' | 'signup') => {
    if (mode === 'signup' && !readGradDriveAccessUnlocked()) {
      setAuthOpen(false);
      setPasskeyOpen(true);
      return;
    }
    setAuthMode(mode);
  }, []);

  const handlePasskeyVerified = useCallback(() => {
    setPasskeyOpen(false);
    setAuthMode('signup');
    setAuthOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openLogin, openSignup }),
    [openLogin, openSignup],
  );

  return (
    <LandingAuthContext.Provider value={value}>
      {children}
      <SignupPasskeyModal
        open={passkeyOpen}
        onOpenChange={setPasskeyOpen}
        onVerified={handlePasskeyVerified}
        onRequestLogin={() => {
          setPasskeyOpen(false);
          setAuthMode('login');
          setAuthOpen(true);
        }}
      />
      <AuthModals
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={handleAuthModeChange}
        onSignupBlockedWithoutPasskey={() => {
          setAuthOpen(false);
          setPasskeyOpen(true);
        }}
      />
    </LandingAuthContext.Provider>
  );
}

export function useLandingAuth() {
  return useContext(LandingAuthContext);
}
