import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app: App | null = null;

function getServiceAccountJson(): Record<string, unknown> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
  }
  return JSON.parse(raw) as Record<string, unknown>;
}

/**
 * Initialize Firebase Admin (Firestore + Auth verify). Call once per process.
 * Requires `FIREBASE_SERVICE_ACCOUNT_JSON` (full JSON string of a service account).
 */
export function getAdminApp(): App {
  if (app) return app;
  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }
  app = initializeApp({
    credential: cert(getServiceAccountJson() as Parameters<typeof cert>[0]),
  });
  return app;
}

export function getAdminDb() {
  getAdminApp();
  return getFirestore();
}

export function getAdminAuth() {
  getAdminApp();
  return getAuth();
}
