/** Characters safe for copy/paste at checkout (no spaces or ambiguous 0/O, 1/l). */
const DISCOUNT_CODE_CHARS =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!&*';

/**
 * Cryptographically random discount code, 7–9 characters (letters, numbers, symbols).
 */
export function generateSecureDiscountCode(): string {
  const length = 7 + (crypto.getRandomValues(new Uint8Array(1))[0] % 3);
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(
    bytes,
    (b) => DISCOUNT_CODE_CHARS[b % DISCOUNT_CODE_CHARS.length],
  ).join('');
}
