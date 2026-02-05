'use client';

import { useState, useEffect } from 'react';
import { isFotmaticHost } from '@/lib/config/domains';

/**
 * Base path for photographer-admin links so URLs work on both domains:
 * - On fotmatic.app: base is '' so links are /dashboard, /bookings (clean URLs).
 * - On graddrive.com (and localhost): base is '/photographer-admin'.
 */
const PHOTOGRAPHER_PREFIX = '/photographer-admin';

export function usePhotographerBasePath(): string {
  const [basePath, setBasePath] = useState(PHOTOGRAPHER_PREFIX);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    setBasePath(isFotmaticHost(host) ? '' : PHOTOGRAPHER_PREFIX);
  }, []);

  return basePath;
}
