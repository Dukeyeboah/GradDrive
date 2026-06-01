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
 */
export const CODE_DEFAULT_PASSKEY_FROM_EMAIL =
  'Grad Drive <onboarding@resend.dev>';

/** Member access passkey (code source of truth — not editable in admin UI). */
export const CODE_DEFAULT_USER_PASSKEY = 'ConGr@d$!';

/** Fotomatic partner discount for Grad Drive members. */
export const CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE = 'Gr@d$@ve!';

export const CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT = 10;
