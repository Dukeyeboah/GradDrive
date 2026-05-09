'use client';

import { useEffect, useState } from 'react';

/** Optional client-only progress for “Continue where you left off” (e.g. set from eBook UI later). */
export type ContinueReadingState = {
  title: string;
  href: string;
  progressPercent: number;
  progressNote: string;
};

const STORAGE_KEY = 'graddrive_continue_reading';

export function useContinueReading() {
  const [data, setData] = useState<ContinueReadingState | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ContinueReadingState;
      if (
        parsed &&
        typeof parsed.title === 'string' &&
        typeof parsed.href === 'string'
      ) {
        setData({
          title: parsed.title,
          href: parsed.href,
          progressPercent: Math.min(
            100,
            Math.max(0, Number(parsed.progressPercent) || 0),
          ),
          progressNote:
            typeof parsed.progressNote === 'string'
              ? parsed.progressNote
              : '',
        });
      }
    } catch {
      /* ignore invalid JSON */
    }
  }, []);

  return data;
}
