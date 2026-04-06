import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.CONTACT_TO_EMAIL || 'hello@gotradeapp.co.uk';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'GoTrade <onboarding@resend.dev>';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map();

const isValidEmail = value => /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]+$/.test(value);

const getClientIp = request => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
};

const isRateLimited = key => {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
};

const buildMailtoFallback = ({ name, email, message }) => {
  const subject = encodeURIComponent(`GoTrade Enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  return `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
};

const escapeHtml = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildAutoReplyHtml = name => {
  const safeName = escapeHtml(name || 'there');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GoTrade</title>
</head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0F172A;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;max-width:600px;margin:0 auto;background-color:#1E293B;border-radius:12px;padding:36px;">
          <tr>
            <td style="color:#FFFFFF;font-size:22px;font-weight:600;">GoTrade</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding-top:4px;padding-bottom:20px;">Scan. Find. Save. Fast.</td>
          </tr>

          <tr>
            <td style="border-top:1px solid #334155;padding-top:20px;"></td>
          </tr>

          <tr>
            <td style="color:#FFFFFF;font-size:16px;padding-top:10px;">Hi ${safeName},</td>
          </tr>

          <tr>
            <td style="color:#CBD5E1;font-size:15px;padding-top:15px;line-height:1.6;">
              Thanks for reaching out to GoTrade. We&#39;ve received your message and will get back to you as soon as possible, usually within 24 hours.
            </td>
          </tr>

          <tr>
            <td style="padding-top:25px;">
              <strong style="color:#FFFFFF;">What happens next:</strong>
              <ul style="color:#CBD5E1;font-size:14px;line-height:1.6;padding-left:20px;margin:10px 0 0;">
                <li style="margin-bottom:6px;">Our team reviews your message</li>
                <li style="margin-bottom:6px;">We reply with answers or next steps</li>
                <li style="margin-bottom:6px;">We can help you get early access if needed</li>
              </ul>
            </td>
          </tr>

          <tr>
            <td style="color:#CBD5E1;font-size:15px;padding-top:15px;line-height:1.6;">
              GoTrade is currently in beta. We are building a faster way for tradespeople to find products, compare nearby suppliers, and save time on every job.
            </td>
          </tr>

          <tr>
            <td style="color:#CBD5E1;font-size:15px;padding-top:14px;line-height:1.6;">
              We&#39;ll keep you updated as new features and suppliers go live.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:24px;padding-bottom:24px;">
              <a href="https://gotradeapp.co.uk" style="background:linear-gradient(135deg, #FF8A00, #FFA733);color:#FFFFFF;text-decoration:none;padding:14px 26px;border-radius:10px;font-size:15px;font-weight:600;display:inline-block;box-shadow:0 6px 18px rgba(255, 138, 0, 0.4);">
                Join Waitlist
              </a>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #2A3648;padding-top:20px;"></td>
          </tr>

          <tr>
            <td style="color:#CBD5E1;font-size:14px;padding-top:20px;line-height:1.6;">If your message is urgent, you can reply directly to this email.</td>
          </tr>

          <tr>
            <td style="color:#CBD5E1;font-size:14px;padding-top:10px;line-height:1.6;">Thanks again,<br />GoTrade Team</td>
          </tr>

          <tr>
            <td style="color:#A1AFC3;font-size:12px;line-height:1.5;padding-top:10px;text-align:center;">
              You&#39;re receiving this because you contacted GoTrade. If this wasn&#39;t you, you can ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export async function POST(request) {
  try {
    const { name, email, message, website } = await request.json();

    if (typeof website === 'string' && website.trim()) {
      return Response.json({ ok: true });
    }

    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return Response.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 }
      );
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return Response.json({ error: 'Please provide name, email, and message.' }, { status: 400 });
    }

    if (!isValidEmail(trimmedEmail)) {
      return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        {
          error: 'Email service is not configured on this environment yet.',
          fallback: 'mailto',
          fallbackMailto: buildMailtoFallback({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage
          })
        },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const adminEmailPromise = resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: trimmedEmail,
      subject: `New GoTrade contact enquiry from ${trimmedName}`,
      text: [
        'You received a new contact enquiry from the website.',
        '',
        `Name: ${trimmedName}`,
        `Email: ${trimmedEmail}`,
        '',
        'Message:',
        trimmedMessage
      ].join('\n')
    });

    const autoReplyPromise = resend.emails.send({
      from: FROM_EMAIL,
      to: [trimmedEmail],
      subject: "We've received your message",
      html: buildAutoReplyHtml(trimmedName),
      text: [
        `Hi ${trimmedName},`,
        '',
        "Thanks for reaching out to GoTrade. We've received your message and will get back to you as soon as possible, usually within 24 hours.",
        '',
        'What happens next:',
        '- Our team will review your message',
        "- We'll reply directly with answers or next steps",
        "- If needed, we'll help you get early access",
        '',
        'About GoTrade:',
        'GoTrade is currently in beta. We are building a faster way for tradespeople to find products, compare nearby suppliers, and save time on every job.',
        '',
        "We'll keep you updated as new features and suppliers go live.",
        '',
        'If your message is urgent, you can reply directly to this email.',
        '',
        'Thanks again,',
        'GoTrade Team',
        '',
        "You're receiving this because you contacted GoTrade. If this wasn't you, you can ignore this email."
      ].join('\n')
    });

    const [adminResult, autoReplyResult] = await Promise.all([adminEmailPromise, autoReplyPromise]);

    if (adminResult?.error || autoReplyResult?.error) {
      console.error('Resend delivery error', {
        adminError: adminResult?.error,
        autoReplyError: autoReplyResult?.error
      });

      return Response.json(
        {
          error: 'Email delivery failed. Please retry shortly.',
          details:
            process.env.NODE_ENV === 'production'
              ? undefined
              : {
                  adminError: adminResult?.error?.message,
                  autoReplyError: autoReplyResult?.error?.message
                }
        },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, mode: 'resend' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return Response.json({ error: 'Unable to send your message right now. Please try again shortly.' }, { status: 500 });
  }
}
