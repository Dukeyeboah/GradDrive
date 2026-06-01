import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase/admin-server';
import {
  CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
  CODE_DEFAULT_PASSKEY_FROM_EMAIL,
  CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE,
  CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT,
  CODE_DEFAULT_USER_PASSKEY,
  PLATFORM_SETTINGS_DOC_ID,
} from '@/lib/config/platform-settings-defaults';

export type ResolvedEmailSettings = {
  passkeyAdminNotifyEmail: string;
  passkeyFromEmail: string;
};

/**
 * Reads `platformSettings/main` and merges with code/env defaults.
 */
export async function getResolvedEmailSettings(): Promise<ResolvedEmailSettings> {
  const db = getAdminDb();
  const ref = db.collection('platformSettings').doc(PLATFORM_SETTINGS_DOC_ID);
  const snap = await ref.get();

  const envAdmin = process.env.PASSKEY_ADMIN_NOTIFY_EMAIL?.trim();
  const envFrom = process.env.PASSKEY_FROM_EMAIL?.trim();

  if (!snap.exists) {
    return {
      passkeyAdminNotifyEmail:
        envAdmin || CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
      passkeyFromEmail: envFrom || CODE_DEFAULT_PASSKEY_FROM_EMAIL,
    };
  }

  const data = snap.data() as Record<string, unknown> | undefined;
  const admin =
    (typeof data?.passkeyAdminNotifyEmail === 'string' &&
      data.passkeyAdminNotifyEmail.trim()) ||
    envAdmin ||
    CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL;
  const from =
    (typeof data?.passkeyFromEmail === 'string' &&
      data.passkeyFromEmail.trim()) ||
    envFrom ||
    CODE_DEFAULT_PASSKEY_FROM_EMAIL;

  return { passkeyAdminNotifyEmail: admin, passkeyFromEmail: from };
}

/**
 * Ensures `platformSettings/main` exists with sensible defaults (Admin SDK).
 */
export async function ensurePlatformSettingsDoc(): Promise<void> {
  const db = getAdminDb();
  const ref = db.collection('platformSettings').doc(PLATFORM_SETTINGS_DOC_ID);
  const snap = await ref.get();
  if (snap.exists) return;

  const envAdmin = process.env.PASSKEY_ADMIN_NOTIFY_EMAIL?.trim();
  const envFrom = process.env.PASSKEY_FROM_EMAIL?.trim();

  await ref.set({
    passkeyAdminNotifyEmail:
      envAdmin || CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
    passkeyFromEmail: envFrom || CODE_DEFAULT_PASSKEY_FROM_EMAIL,
    userPasskeyReference: CODE_DEFAULT_USER_PASSKEY,
    fotomaticDiscountCode: CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE,
    fotomaticDiscountPercent: CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
