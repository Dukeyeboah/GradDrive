export type AppViewMode = 'admin' | 'user' | 'photographer-admin';

export function isAdminRole(role?: string | null): boolean {
  return role === 'admin' || role === 'super admin';
}

/** Default landing route after sign-in (admins → admin panel). */
export function getDefaultAppHome(role?: string | null): string {
  if (isAdminRole(role)) {
    return '/admin/dashboard';
  }
  return '/dashboard';
}
