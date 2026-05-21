import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase/admin-server';
import { verifyAdminBearer } from '@/lib/server/verify-admin';
import { getResolvedEmailSettings } from '@/lib/server/platform-settings-load';
import {
  getPasskeyForEmailBody,
  sendPasskeyApprovalToRequester,
  sendPasskeyRejectionToRequester,
} from '@/lib/server/resend-passkey';

const bodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('approve'),
    requestId: z.string().min(1),
  }),
  z.object({
    action: z.literal('send'),
    requestId: z.string().min(1),
  }),
  z.object({
    action: z.literal('reject'),
    requestId: z.string().min(1),
    rejectMessage: z.string().min(10).max(4000),
  }),
]);

export async function POST(req: Request) {
  const admin = await verifyAdminBearer(req);
  if (!admin.ok) {
    return NextResponse.json(
      { error: admin.message },
      { status: admin.status },
    );
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
      { error: 'Invalid body. Decline requires a message (at least 10 characters).' },
      { status: 400 },
    );
  }

  let db;
  try {
    db = getAdminDb();
  } catch {
    return NextResponse.json(
      { error: 'Server missing FIREBASE_SERVICE_ACCOUNT_JSON' },
      { status: 503 },
    );
  }

  const payload = parsed.data;
  const requestId = payload.requestId;
  const ref = db.collection('passkeyRequests').doc(requestId);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  const row = snap.data() as {
    email?: string;
    status?: string;
    displayName?: string;
  };
  const requesterEmail = (row.email || '').trim().toLowerCase();
  if (!requesterEmail) {
    return NextResponse.json({ error: 'Invalid request record' }, { status: 400 });
  }

  const requesterName =
    (row.displayName || '').trim() || requesterEmail.split('@')[0] || 'there';

  const settings = await getResolvedEmailSettings();

  if (payload.action === 'reject') {
    const rejectMessage = payload.rejectMessage.trim();

    const sendResult = await sendPasskeyRejectionToRequester({
      to: requesterEmail,
      from: settings.passkeyFromEmail,
      requesterName,
      rejectMessage,
    });

    if (!sendResult.sent) {
      const msg =
        sendResult.reason === 'no_api_key'
          ? 'RESEND_API_KEY is not set. Configure Resend, then try again.'
          : 'Resend could not send the decline email. Check the from-address and Resend dashboard.';
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    await ref.update({
      status: 'rejected',
      updatedAt: FieldValue.serverTimestamp(),
      rejectedAt: FieldValue.serverTimestamp(),
      rejectedByUid: admin.uid,
      rejectMessage,
      rejectionEmailSentAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  }

  // approve or legacy send
  if (row.status === 'sent') {
    return NextResponse.json(
      { error: 'Passkey was already sent for this request.' },
      { status: 400 },
    );
  }

  const passkey = getPasskeyForEmailBody();
  const sendResult = await sendPasskeyApprovalToRequester({
    to: requesterEmail,
    from: settings.passkeyFromEmail,
    passkey,
    requesterName,
  });

  if (!sendResult.sent) {
    const msg =
      sendResult.reason === 'no_api_key'
        ? 'RESEND_API_KEY is not set. Configure Resend, then try again.'
        : 'Resend rejected the email. Check the from-address and Resend dashboard.';
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  await ref.update({
    status: 'sent',
    updatedAt: FieldValue.serverTimestamp(),
    sentAt: FieldValue.serverTimestamp(),
    sentToEmail: requesterEmail,
    fromEmailUsed: settings.passkeyFromEmail,
    adminNotifyEmailSnapshot: settings.passkeyAdminNotifyEmail,
    sentByUid: admin.uid,
    approvalEmailSentAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
