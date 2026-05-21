import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendTravelInterestEmail(params: {
  to: string;
  from: string;
  interestId: string;
  userName: string;
  userEmail: string;
  graduationYear: string;
  school: string;
  interests: string;
  preferredTiming?: string;
  budgetRange?: string;
  travelExperience?: string;
  additionalInfo?: string;
}) {
  const resend = getResend();
  const subject = `HoS Travel Experience — interest from ${params.userName}`;
  const rows: [string, string][] = [
    ['Interest ID', params.interestId],
    ['Name', params.userName],
    ['Email', params.userEmail],
    ['Graduation year', params.graduationYear],
    ['School', params.school],
    ['Interests', params.interests],
  ];
  if (params.preferredTiming)
    rows.push(['Preferred timing', params.preferredTiming]);
  if (params.budgetRange) rows.push(['Budget range', params.budgetRange]);
  if (params.travelExperience)
    rows.push(['Travel experience', params.travelExperience]);
  if (params.additionalInfo)
    rows.push(['Additional info', params.additionalInfo]);

  const html = `
    <p>New HoS Travel Experience interest submitted on Grad Drive.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="vertical-align:top;font-weight:bold;border:1px solid #ddd;">${escapeHtml(k)}</td><td style="border:1px solid #ddd;">${escapeHtml(v)}</td></tr>`,
        )
        .join('')}
    </table>
  `;

  if (!resend) {
    console.warn(
      '[resend] RESEND_API_KEY not set; skipping travel interest email',
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
    console.error('[resend] travel interest email failed', e);
    return { sent: false as const, reason: 'send_failed' as const };
  }
}
