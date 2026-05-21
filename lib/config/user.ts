/**
 * Main site (Grad Drive) access passkey (included with eligible orders).
 *
 * For emails sent from API routes, set `GRAD_DRIVE_USER_PASSKEY` in the server
 * environment to override this value without changing client code.
 */
export const USER_PASSKEY = 'ConGr@d$!';

/** Persisted after correct passkey — required before email/Google sign-up for new accounts */
export const GRAD_DRIVE_ACCESS_STORAGE_KEY = 'gradDriveAccess';

/** @deprecated use GRAD_DRIVE_ACCESS_STORAGE_KEY + readGradDriveAccessUnlocked */
export const SIGNUP_PASSKEY_SESSION_KEY = 'gradDriveSignupPasskeyOk';

export function readGradDriveAccessUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(GRAD_DRIVE_ACCESS_STORAGE_KEY) === 'true') return true;
  // One-time migration from session-only key
  if (sessionStorage.getItem(SIGNUP_PASSKEY_SESSION_KEY) === 'true') {
    localStorage.setItem(GRAD_DRIVE_ACCESS_STORAGE_KEY, 'true');
    return true;
  }
  return false;
}

export function setGradDriveAccessUnlocked(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GRAD_DRIVE_ACCESS_STORAGE_KEY, 'true');
  sessionStorage.setItem(SIGNUP_PASSKEY_SESSION_KEY, 'true');
}
