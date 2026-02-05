/**
 * Domain configuration for multi-domain routing.
 * fotmatic.app serves the photographer-admin app as its own site (same codebase, same Firebase).
 */

export const FOTMATIC_HOSTS = ['fotmatic.app', 'www.fotmatic.app'] as const;

export function isFotmaticHost(host: string | null): boolean {
  if (!host) return false;
  return FOTMATIC_HOSTS.some((h) => host === h || host.endsWith('.' + h));
}
