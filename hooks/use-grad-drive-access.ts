'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  GRAD_DRIVE_ACCESS_STORAGE_KEY,
  readGradDriveAccessUnlocked,
  setGradDriveAccessUnlocked,
} from '@/lib/config/user';

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('gradDriveAccessChange', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('gradDriveAccessChange', onStoreChange);
  };
}

function getSnapshot() {
  return readGradDriveAccessUnlocked();
}

function getServerSnapshot() {
  return false;
}

export function notifyGradDriveAccessChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gradDriveAccessChange'));
  }
}

/**
 * Client-side passkey gate for sign-up / first-time Google (persisted in localStorage).
 */
export function useGradDriveAccess() {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const unlock = useCallback(() => {
    setGradDriveAccessUnlocked();
    notifyGradDriveAccessChanged();
  }, []);

  return useMemo(
    () => ({
      isUnlocked: unlocked,
      unlock,
      /** Prefer hook snapshot; use for non-React checks in same tick after unlock. */
      readUnlocked: readGradDriveAccessUnlocked,
    }),
    [unlocked, unlock],
  );
}
