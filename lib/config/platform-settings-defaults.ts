/**
 * Fallback values when `platformSettings/main` has not been saved yet.
 * Override in Firestore via Admin → Settings (recommended) or edit these constants.
 */
export const PLATFORM_SETTINGS_DOC_ID = 'main' as const;

/** Inbound: where new passkey requests are notified (Resend “to”). */
export const CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL =
  'admin@example.com';

/**
 * Outbound: Resend “from” (must be a verified sender in Resend for production).
 * `onboarding@resend.dev` works for Resend trial without a custom domain.
 */
export const CODE_DEFAULT_PASSKEY_FROM_EMAIL =
  'Grad Drive <onboarding@resend.dev>';
