/**
 * Next.js Middleware — runs on the edge before every request.
 *
 * WHAT IS MIDDLEWARE? (simple terms)
 * Think of it like a receptionist at the front door of your app. Every time someone
 * requests a page (e.g. fotmatic.app/bookings), the request hits the receptionist first.
 * The receptionist can:
 *   - Let them through unchanged (request goes to the normal page).
 *   - Send them to a different room without changing the address on their badge (rewrite:
 *     internally serve another URL but the browser still shows fotmatic.app/bookings).
 *   - Tell them "please go to this other address" (redirect: browser URL changes).
 *
 * We use it so that fotmatic.app and fotmatic.app/bookings actually serve the
 * photographer-admin app (which lives at /photographer-admin and /photographer-admin/bookings
 * in the codebase) while the URL bar still shows fotmatic.app and fotmatic.app/bookings.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isFotmaticHost } from '@/lib/config/domains';

const PHOTOGRAPHER_PREFIX = '/photographer-admin';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Only apply fotmatic logic when the request is for fotmatic.app (or www.fotmatic.app)
  if (!isFotmaticHost(host)) {
    return NextResponse.next();
  }

  // --- On fotmatic.app ---

  // If user requested the "long" URL (e.g. fotmatic.app/photographer-admin/dashboard),
  // redirect to the clean URL (fotmatic.app/dashboard) so the bar shows the short path.
  if (pathname.startsWith(PHOTOGRAPHER_PREFIX)) {
    const rest = pathname.slice(PHOTOGRAPHER_PREFIX.length) || '/';
    const cleanPath = rest === '/' ? '' : rest;
    url.pathname = cleanPath || '/';
    return NextResponse.redirect(url);
  }

  // Rewrite: fotmatic.app/... → serve /photographer-admin/... internally.
  // The browser URL stays fotmatic.app/... (no redirect).
  if (pathname === '/') {
    url.pathname = PHOTOGRAPHER_PREFIX;
    return NextResponse.rewrite(url);
  }

  // e.g. /dashboard → /photographer-admin/dashboard, /bookings → /photographer-admin/bookings
  url.pathname = PHOTOGRAPHER_PREFIX + pathname;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run middleware on all page requests (excluding static files and API).
  // We only rewrite when host is fotmatic/fotomatic; other hosts pass through.
  matcher: [
    /*
     * Match all pathnames except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
