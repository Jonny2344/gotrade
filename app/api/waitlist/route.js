import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const EMAIL_REGEX = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]+$/;

const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function POST(request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail) {
      return Response.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return Response.json({ error: 'Waitlist is not configured yet.' }, { status: 500 });
    }

    const { data: existingRow, error: selectError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (selectError) {
      console.error('Waitlist lookup failed', selectError);
      return Response.json({ error: 'Unable to join waitlist right now. Please try again.' }, { status: 500 });
    }

    if (existingRow) {
      return Response.json({ ok: true, duplicate: true, message: "You're already on the waitlist." });
    }

    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({ email: normalizedEmail });

    if (insertError) {
      // Handle race-condition duplicates if a unique constraint exists.
      if (insertError.code === '23505') {
        return Response.json({ ok: true, duplicate: true, message: "You're already on the waitlist." });
      }

      console.error('Waitlist insert failed', insertError);
      return Response.json({ error: 'Unable to join waitlist right now. Please try again.' }, { status: 500 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: 'Waitlist joined, but confirmation email is not configured.' }, { status: 502 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.WAITLIST_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || 'GoTrade <onboarding@resend.dev>';

    const { error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: [normalizedEmail],
      subject: "You're on the GoTrade waitlist",
      html: '<p>You\'re in. Thanks for joining the GoTrade waitlist. We\'ll keep you updated.</p>'
    });

    if (resendError) {
      console.error('Waitlist confirmation email failed', resendError);
      return Response.json({ error: 'Waitlist joined, but confirmation email failed to send.' }, { status: 502 });
    }

    return Response.json({ ok: true, message: "You're on the waitlist." });
  } catch (error) {
    console.error('Waitlist submission failed', error);
    return Response.json({ error: 'Unable to join waitlist right now. Please try again.' }, { status: 500 });
  }
}
