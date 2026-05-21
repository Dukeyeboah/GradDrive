import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin-server';

export type AdminVerifyResult =
  | { ok: true; uid: string }
  | { ok: false; status: number; message: string };

/**
 * Verifies a Firebase ID token and that the user is admin or super admin in Firestore.
 */
export async function verifyAdminBearer(req: Request): Promise<AdminVerifyResult> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, status: 401, message: 'Missing or invalid Authorization header' };
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    return { ok: false, status: 401, message: 'Missing token' };
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const userSnap = await getAdminDb().collection('users').doc(decoded.uid).get();
    const role = userSnap.data()?.role as string | undefined;
    if (role !== 'admin' && role !== 'super admin') {
      return { ok: false, status: 403, message: 'Admin access required' };
    }
    return { ok: true, uid: decoded.uid };
  } catch {
    return { ok: false, status: 401, message: 'Invalid or expired token' };
  }
}
