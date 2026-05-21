import { Resend } from 'resend';
import { USER_PASSKEY } from '@/lib/config/user';

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export async function notifyAdminNewPasskeyRequest(params: {
  to: string;
  from: string;
  requesterEmail: string;
  requestId: string;
  displayName: string;
  collegeName: string;
  graduationYear: string;
}) {
  const resend = getResend();
  const subject = `Grad Drive: passkey request from ${params.requesterEmail}`;
  const html = `
    <p>A new Grad Drive access passkey request needs your review.</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(params.displayName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(params.requesterEmail)}</li>
      <li><strong>College / university:</strong> ${escapeHtml(params.collegeName)}</li>
      <li><strong>Graduation year:</strong> ${escapeHtml(params.graduationYear)}</li>
      <li><strong>Request ID:</strong> ${escapeHtml(params.requestId)}</li>
    </ul>
    <p>Open the admin panel → <strong>Notifications</strong> (Grad Drive) to approve or decline and send the appropriate email.</p>
  `;

  if (!resend) {
    console.warn(
      '[resend] RESEND_API_KEY not set; skipping admin notification email',
    );
    return { sent: false as const, reason: 'no_api_key' as const };
  }

  try {
    await resend.emails.send({
      from: params.from,
      to: params.to,
      subject,
      html,
    });
    return { sent: true as const };
  } catch (e) {
    console.error('[resend] notify admin failed', e);
    return { sent: false as const, reason: 'send_failed' as const };
  }
}

/** After admin approves a passkey request — congrats + passkey + sign-up steps */
export async function sendPasskeyApprovalToRequester(params: {
  to: string;
  from: string;
  passkey: string;
  requesterName: string;
}) {
  const resend = getResend();
  const subject = "You're approved — your Grad Drive access passkey";
  const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p><strong>Congratulations!</strong> Your request for Grad Drive access has been approved.</p>
    <p>Your access passkey is below. You will need it when you create your account:</p>
    <p style="font-size:18px;font-weight:bold;letter-spacing:0.05em;margin:16px 0;">${escapeHtml(params.passkey)}</p>
    <p><strong>What to do next</strong></p>
    <ol>
      <li>Go to the Grad Drive website.</li>
      <li>Choose <strong>Get access</strong> (or Sign up) and enter this passkey when asked — that unlocks sign-up on your device.</li>
      <li>Create your account with <strong>email and password</strong> or <strong>Google</strong> (after unlock).</li>
      <li>Keep this passkey somewhere safe; you only need it once per browser until you clear site data.</li>
    </ol>
    <p>If you did not request access, you can ignore this email.</p>
  `;

  if (!resend) {
    console.warn(
      '[resend] RESEND_API_KEY not set; cannot email approval to requester',
    );
    return { sent: false as const, reason: 'no_api_key' as const };
  }

  try {
    await resend.emails.send({
      from: params.from,
      to: params.to,
      subject,
      html,
    });
    return { sent: true as const };
  } catch (e) {
    console.error('[resend] approval email failed', e);
    return { sent: false as const, reason: 'send_failed' as const };
  }
}

export async function sendPasskeyToRequester(params: {
  to: string;
  from: string;
  passkey: string;
}) {
  return sendPasskeyApprovalToRequester({
    to: params.to,
    from: params.from,
    passkey: params.passkey,
    requesterName: 'there',
  });
}

/** After admin declines — personalized message from admin + gentle guidance */
export async function sendPasskeyRejectionToRequester(params: {
  to: string;
  from: string;
  requesterName: string;
  rejectMessage: string;
}) {
  const resend = getResend();
  const subject = 'Update on your Grad Drive access request';
  const bodyHtml = escapeHtml(params.rejectMessage).replace(/\n/g, '<br/>');
  const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p>Thank you for your interest in Grad Drive. Unfortunately we are not able to approve this access request at this time.</p>
    <p><strong>Message from the team:</strong></p>
    <blockquote style="margin:12px 0;padding:12px 16px;border-left:4px solid #ccc;background:#f9f9f9;">
      ${bodyHtml}
    </blockquote>
    <p>If you believe this was a mistake, you may submit a new request with accurate details and a valid email address associated with your eligibility (for example through your House of Stole order).</p>
    <p>We appreciate your understanding.</p>
  `;

  if (!resend) {
    console.warn(
      '[resend] RESEND_API_KEY not set; cannot email rejection to requester',
    );
    return { sent: false as const, reason: 'no_api_key' as const };
  }

  try {
    await resend.emails.send({
      from: params.from,
      to: params.to,
      subject,
      html,
    });
    return { sent: true as const };
  } catch (e) {
    console.error('[resend] rejection email failed', e);
    return { sent: false as const, reason: 'send_failed' as const };
  }
}

/** Server-side passkey for emails (override via env to differ from client bundle). */
export function getPasskeyForEmailBody(): string {
  return process.env.GRAD_DRIVE_USER_PASSKEY?.trim() || USER_PASSKEY;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
