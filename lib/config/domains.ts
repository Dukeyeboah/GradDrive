/**
 * Domain configuration for multi-domain routing.
 * Fotomatic (fotomatic.app, fotmatic.app) serves the photographer-admin app as its own site (same codebase, same Firebase).
 */

export const FOTMATIC_HOSTS = [
  'fotmatic.app',
  'www.fotmatic.app',
  'fotomatic.app',
  'www.fotomatic.app',
] as const;

export function isFotmaticHost(host: string | null): boolean {
  if (!host) return false;
  const hostname = host.split(':')[0].toLowerCase();
  return FOTMATIC_HOSTS.some(
    (h) => hostname === h || hostname.endsWith('.' + h)
  );
}
