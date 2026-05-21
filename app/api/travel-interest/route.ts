import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin-server';
import {
  ensurePlatformSettingsDoc,
  getResolvedEmailSettings,
} from '@/lib/server/platform-settings-load';
import { sendTravelInterestEmail } from '@/lib/server/resend-travel-interest';
import { HOUSE_OF_STOLE_CONTACT_EMAIL } from '@/lib/config/house-of-stole';

const bodySchema = z.object({
  userId: z.string().min(1).max(128),
  userName: z.string().min(1).max(200),
  userEmail: z.string().email().max(320),
  graduationYear: z.string().min(1).max(32),
  school: z.string().min(1).max(300),
  interests: z.string().min(1).max(8000),
  preferredTiming: z.string().max(4000).optional().nullable(),
  budgetRange: z.string().max(500).optional().nullable(),
  travelExperience: z.string().max(8000).optional().nullable(),
  additionalInfo: z.string().max(8000).optional().nullable(),
});

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token =
    authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid submission', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  if (parsed.data.userId !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let db;
  try {
    db = getAdminDb();
  } catch {
    return NextResponse.json(
      {
        error:
          'Server is not configured (missing FIREBASE_SERVICE_ACCOUNT_JSON).',
      },
      { status: 503 },
    );
  }

  await ensurePlatformSettingsDoc();
  const emailSettings = await getResolvedEmailSettings();

  const payload = {
    userId: parsed.data.userId,
    userName: parsed.data.userName.trim(),
    userEmail: parsed.data.userEmail.trim().toLowerCase(),
    graduationYear: parsed.data.graduationYear.trim(),
    school: parsed.data.school.trim(),
    interests: parsed.data.interests.trim(),
    preferredTiming: parsed.data.preferredTiming?.trim() || '',
    budgetRange: parsed.data.budgetRange?.trim() || '',
    travelExperience: parsed.data.travelExperience?.trim() || '',
    additionalInfo: parsed.data.additionalInfo?.trim() || '',
    timestamp: FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection('travelInterests').add(payload);

  const emailResult = await sendTravelInterestEmail({
    to: HOUSE_OF_STOLE_CONTACT_EMAIL,
    from: emailSettings.passkeyFromEmail,
    interestId: docRef.id,
    userName: payload.userName,
    userEmail: payload.userEmail,
    graduationYear: payload.graduationYear,
    school: payload.school,
    interests: payload.interests,
    preferredTiming: payload.preferredTiming || undefined,
    budgetRange: payload.budgetRange || undefined,
    travelExperience: payload.travelExperience || undefined,
    additionalInfo: payload.additionalInfo || undefined,
  });

  console.info('[travel-interest]', docRef.id, payload.userEmail);

  return NextResponse.json({
    ok: true,
    id: docRef.id,
    emailSent: emailResult.sent,
  });
}
