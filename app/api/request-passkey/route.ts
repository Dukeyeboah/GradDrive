import { NextResponse } from 'next/server';
import { FieldValue, type DocumentReference } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase/admin-server';
import {
  ensurePlatformSettingsDoc,
  getResolvedEmailSettings,
} from '@/lib/server/platform-settings-load';
import { notifyAdminNewPasskeyRequest } from '@/lib/server/resend-passkey';

const bodySchema = z.object({
  email: z.string().email().max(320),
  displayName: z.string().min(1).max(200).trim(),
  collegeName: z.string().min(1).max(300).trim(),
  graduationYear: z.string().min(2).max(32).trim(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please provide a valid email, name, school, and graduation year.' },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const displayName = parsed.data.displayName.trim();
  const collegeName = parsed.data.collegeName.trim();
  const graduationYear = parsed.data.graduationYear.trim();

  let db;
  try {
    db = getAdminDb();
  } catch {
    return NextResponse.json(
      {
        code: 'FIREBASE_ADMIN_NOT_CONFIGURED',
        error:
          'Passkey requests are not enabled on this server. For local development, set FIREBASE_SERVICE_ACCOUNT_JSON in .env.local (single-line service account JSON — see .env.example). Production needs the same variable in your host (e.g. Vercel) environment.',
      },
      { status: 503 },
    );
  }

  let docRef: DocumentReference;
  try {
    await ensurePlatformSettingsDoc();
    const settings = await getResolvedEmailSettings();

    docRef = await db.collection('passkeyRequests').add({
      email,
      displayName,
      collegeName,
      graduationYear,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const webhook = process.env.PASSKEY_REQUEST_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            displayName,
            collegeName,
            graduationYear,
            requestId: docRef.id,
            source: 'graddrive-passkey-request',
            at: new Date().toISOString(),
          }),
        });
      } catch {
        /* non-fatal */
      }
    }

    await notifyAdminNewPasskeyRequest({
      to: settings.passkeyAdminNotifyEmail,
      from: settings.passkeyFromEmail,
      requesterEmail: email,
      requestId: docRef.id,
      displayName,
      collegeName,
      graduationYear,
    });
  } catch (e) {
    console.error('[request-passkey] Firestore or notify failed', e);
    return NextResponse.json(
      {
        error:
          'We could not save your request right now. Please try again in a few minutes or contact support.',
      },
      { status: 500 },
    );
  }

  console.info('[request-passkey]', email, docRef.id);

  return NextResponse.json({
    ok: true,
    message:
      'Thanks — your request was received. Our team will review it; if you are approved, you will get an email with your access passkey and sign-up instructions.',
  });
}
