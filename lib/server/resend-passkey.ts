import { Resend } from 'resend';
import { USER_PASSKEY } from '@/lib/config/user';

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

type SendResult =
  | { sent: true; id: string }
  | {
      sent: false;
      reason: 'no_api_key' | 'send_failed';
      message?: string;
    };

async function sendResendEmail(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
  logLabel: string;
}): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    return { sent: false, reason: 'no_api_key' };
  }

  const { data, error } = await resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error(`[resend] ${params.logLabel} failed`, error);
    return {
      sent: false,
      reason: 'send_failed',
      message: error.message,
    };
  }

  if (!data?.id) {
    console.error(`[resend] ${params.logLabel} returned no id`, data);
    return {
      sent: false,
      reason: 'send_failed',
      message: 'Resend did not return a message id.',
    };
  }

  console.info(`[resend] ${params.logLabel} sent`, data.id, 'to', params.to);
  return { sent: true, id: data.id };
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
    <p>Open the Grad Drive <strong>admin panel → Notifications</strong> (sidebar or bell icon) to approve or decline and email the requester automatically.</p>
  `;

  const result = await sendResendEmail({
    from: params.from,
    to: params.to,
    subject,
    html,
    logLabel: 'notify admin passkey request',
  });
  if (!result.sent) {
    console.warn('[resend] admin notify skipped or failed', result);
  }
  return result;
}

/** After admin approves a passkey request — congrats + passkey + sign-up steps */
export async function sendPasskeyApprovalToRequester(params: {
  to: string;
  from: string;
  passkey: string;
  requesterName: string;
}) {
  const subject = "You're approved — your Grad Drive access passkey";
  const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p><strong>Congratulations!</strong> Your request for Grad Drive access has been approved.</p>
    <p>Your access passkey is below. You will need it when you create your account:</p>
    <p style="font-size:18px;font-weight:bold;letter-spacing:0.05em;margin:16px 0;padding:12px 16px;background:#f5f5f5;border-radius:8px;">${escapeHtml(params.passkey)}</p>
    <p><strong>What to do next</strong></p>
    <ol>
      <li>Go to the Grad Drive website.</li>
      <li>Choose <strong>Get access</strong> (or Sign up) and enter this passkey when asked — that unlocks sign-up on your device.</li>
      <li>Create your account with <strong>email and password</strong> or <strong>Google</strong> (after unlock).</li>
      <li>Keep this passkey somewhere safe; you only need it once per browser until you clear site data.</li>
    </ol>
    <p><strong>What you get with Grad Drive</strong></p>
    <ul>
      <li>Exclusive graduation posters, cap designs, and digital keepsakes</li>
      <li>Member discounts (including Fotomatic photography with your community code)</li>
      <li>The Grad Community directory — connect with other graduates</li>
      <li>Scholarship opportunities, e-books, and House of Stole perks</li>
    </ul>
    <p>Welcome to the community — we are glad to have you.</p>
    <p>If you did not request access, you can ignore this email.</p>
  `;

  return sendResendEmail({
    from: params.from,
    to: params.to,
    subject,
    html,
    logLabel: 'passkey approval',
  });
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
  const subject = 'Update on your Grad Drive access request';
  const bodyHtml = escapeHtml(params.rejectMessage).replace(/\n/g, '<br/>');
  const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p>Thank you for your interest in Grad Drive. Unfortunately we are not able to approve this access request at this time.</p>
    <p><strong>Message from the team:</strong></p>
    <blockquote style="margin:12px 0;padding:12px 16px;border-left:4px solid #ccc;background:#f9f9f9;">
      ${bodyHtml}
    </blockquote>
    <p>Common reasons we cannot approve a request include:</p>
    <ul>
      <li>The email does not match our eligible customer or order records</li>
      <li>Information provided could not be verified (name, school, or graduation year)</li>
      <li>A duplicate or incomplete submission</li>
    </ul>
    <p>If you believe this was a mistake, submit a new request with accurate details and an email address tied to your eligibility (for example, the email used for your House of Stole order). You may also contact us at contact@houseofstole.com.</p>
    <p>We appreciate your understanding.</p>
  `;

  return sendResendEmail({
    from: params.from,
    to: params.to,
    subject,
    html,
    logLabel: 'passkey rejection',
  });
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
