'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type LaunchpadContextValue = {
  launchpadOpen: boolean;
  setLaunchpadOpen: (open: boolean) => void;
  openLaunchpad: () => void;
  closeLaunchpad: () => void;
  toggleLaunchpad: () => void;
};

const LaunchpadContext = createContext<LaunchpadContextValue | null>(null);

export function LaunchpadProvider({ children }: { children: ReactNode }) {
  const [launchpadOpen, setLaunchpadOpen] = useState(false);

  const openLaunchpad = useCallback(() => setLaunchpadOpen(true), []);
  const closeLaunchpad = useCallback(() => setLaunchpadOpen(false), []);
  const toggleLaunchpad = useCallback(
    () => setLaunchpadOpen((prev) => !prev),
    [],
  );

  const value = useMemo(
    () => ({
      launchpadOpen,
      setLaunchpadOpen,
      openLaunchpad,
      closeLaunchpad,
      toggleLaunchpad,
    }),
    [launchpadOpen, openLaunchpad, closeLaunchpad, toggleLaunchpad],
  );

  return (
    <LaunchpadContext.Provider value={value}>{children}</LaunchpadContext.Provider>
  );
}

export function useLaunchpad() {
  const ctx = useContext(LaunchpadContext);
  if (!ctx) {
    throw new Error('useLaunchpad must be used within LaunchpadProvider');
  }
  return ctx;
}
