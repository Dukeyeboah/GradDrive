'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isFotmaticHost } from '@/lib/config/domains';

/**
 * Sets document.title for the photographer-admin app so the browser tab shows:
 * - On fotomatic.app: "Fotomatic", "Fotomatic - Dashboard", "Fotomatic - Bookings", "Fotomatic - Profile"
 * - On graddrive.com: "Grad Drive - Photographer", "Grad Drive - Photographer Dashboard", etc.
 */
export function PhotographerAdminTitle() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    const isFotomatic = isFotmaticHost(host);

    if (isFotomatic) {
      if (pathname === '/' || pathname === '') {
        document.title = 'Fotomatic';
      } else if (pathname === '/dashboard') {
        document.title = 'Fotomatic - Dashboard';
      } else if (pathname === '/bookings') {
        document.title = 'Fotomatic - Bookings';
      } else if (pathname === '/profile') {
        document.title = 'Fotomatic - Profile';
      } else {
        document.title = 'Fotomatic';
      }
    } else {
      if (
        pathname === '/photographer-admin' ||
        pathname === '/photographer-admin/'
      ) {
        document.title = 'Grad Drive - Photographer';
      } else if (pathname === '/photographer-admin/dashboard') {
        document.title = 'Grad Drive - Photographer Dashboard';
      } else if (pathname === '/photographer-admin/bookings') {
        document.title = 'Grad Drive - Photographer Bookings';
      } else if (pathname === '/photographer-admin/profile') {
        document.title = 'Grad Drive - Photographer Profile';
      } else {
        document.title = 'Grad Drive - Photographer';
      }
    }
  }, [pathname]);

  return null;
}
