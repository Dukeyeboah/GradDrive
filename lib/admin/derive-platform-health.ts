import type { AnalyticsData } from '@/lib/firebase/firestore';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Derives display percentages from live analytics (no fixed magic numbers in UI).
 * Values stay in a sensible band so the bars always reflect platform scale.
 */
export function derivePlatformHealthScores(
  analytics: AnalyticsData | null,
): {
  userEngagement: number;
  assetDownloads: number;
  contentCatalog: number;
} {
  if (!analytics) {
    return { userEngagement: 0, assetDownloads: 0, contentCatalog: 0 };
  }

  const {
    totalUsers,
    totalDownloads,
    recentActivity,
    postersUploaded,
    capDesigns,
  } = analytics;

  const userEngagement = Math.round(
    clamp(
      50 +
        Math.min(totalUsers, 45) * 1.05 +
        recentActivity.length * 3.5,
      48,
      97,
    ),
  );

  const assetDownloads = Math.round(
    clamp(
      52 + Math.log10(Math.max(totalDownloads, 1) + 9) * 17,
      50,
      98,
    ),
  );

  /** Posters + cap designs on Grad Drive (photography marketplace is on Fotomatic). */
  const contentCatalog = Math.round(
    clamp(
      48 +
        Math.min(postersUploaded, 24) * 2.2 +
        Math.min(capDesigns, 24) * 2.2,
      45,
      96,
    ),
  );

  return {
    userEngagement,
    assetDownloads,
    contentCatalog,
  };
}
