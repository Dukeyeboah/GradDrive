'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Document titles for the photographer admin area (Grad Drive).
 */
export function PhotographerAdminTitle() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes('/photographer-admin/dashboard')) {
      document.title = 'Grad Drive - Photographer Dashboard';
    } else if (pathname?.includes('/photographer-admin/bookings')) {
      document.title = 'Grad Drive - Photographer Bookings';
    } else if (pathname?.includes('/photographer-admin/profile')) {
      document.title = 'Grad Drive - Photographer Profile';
    } else if (pathname?.startsWith('/photographer-admin')) {
      document.title = 'Grad Drive - Photographers';
    }
  }, [pathname]);

  return null;
}
