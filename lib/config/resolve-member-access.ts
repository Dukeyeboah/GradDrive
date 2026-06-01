import type { PlatformSettings } from '@/lib/firebase/firestore';
import {
  CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE,
  CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT,
  CODE_DEFAULT_USER_PASSKEY,
} from '@/lib/config/platform-settings-defaults';

export type ResolvedMemberAccessSettings = {
  userPasskey: string;
  fotomaticDiscountCode: string;
  fotomaticDiscountPercent: number;
};

export function resolveMemberAccessSettings(
  settings: PlatformSettings | null | undefined,
): ResolvedMemberAccessSettings {
  const code =
    (typeof settings?.fotomaticDiscountCode === 'string' &&
      settings.fotomaticDiscountCode.trim()) ||
    CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE;

  const rawPercent = settings?.fotomaticDiscountPercent;
  const percent =
    typeof rawPercent === 'number' &&
    Number.isFinite(rawPercent) &&
    rawPercent > 0 &&
    rawPercent <= 100
      ? Math.round(rawPercent)
      : CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT;

  return {
    userPasskey: CODE_DEFAULT_USER_PASSKEY,
    fotomaticDiscountCode: code,
    fotomaticDiscountPercent: percent,
  };
}
