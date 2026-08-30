import { NextResponse } from 'next/server';
import { mockBackend } from '@/lib/mockBackendStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ detail: 'A valid email address is required' }, { status: 400 });
    }

    // Generate random secure token
    const token = 'rst_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour expiration

    mockBackend.passwordResetTokens.set(token, {
      email: email.trim().toLowerCase(),
      expiresAt,
    });

    const origin = new URL(request.url).origin;
    const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'contact@askesisprep.com';

    let emailSent = false;
    let serviceUsed = 'simulation';

    // 1. Send via Resend if configured
    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: 'Reset your Askesis Exam Prep password',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Reset Your Password</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                  You requested to reset your password for your <strong>Askesis Exam Prep</strong> account. Click the button below to set a new password:
                </p>
                <div style="margin: 28px 0; text-align: center;">
                  <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px;">
                    Reset Password
                  </a>
                </div>
                <p style="font-size: 13px; line-height: 1.6; color: #64748b;">
                  Or open this link directly:<br>
                  <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
                  This link expires in 1 hour. If you did not make this request, you can safely disregard this message.
                </p>
              </div>
            `,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
          serviceUsed = 'Resend';
        } else {
          const errData = await resendRes.json().catch(() => ({}));
          console.warn('Resend email failed:', errData);
        }
      } catch (err) {
        console.warn('Resend error:', err);
      }
    }

    // 2. Send via SendGrid if configured and not sent yet
    if (!emailSent && sendgridApiKey) {
      try {
        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: fromEmail, name: 'Askesis Exam Prep' },
            subject: 'Reset your Askesis Exam Prep password',
            content: [
              {
                type: 'text/html',
                value: `
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Reset Your Password</h2>
                    <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                      Click the button below to choose a new password for your <strong>Askesis Exam Prep</strong> account:
                    </p>
                    <div style="margin: 28px 0; text-align: center;">
                      <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px;">
                        Reset Password
                      </a>
                    </div>
                    <p style="font-size: 13px; line-height: 1.6; color: #64748b;">
                      Or paste this URL into your browser:<br>
                      <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
                      This link expires in 1 hour.
                    </p>
                  </div>
                `,
              },
            ],
          }),
        });

        if (sgRes.ok) {
          emailSent = true;
          serviceUsed = 'SendGrid';
        } else {
          const errData = await sgRes.json().catch(() => ({}));
          console.warn('SendGrid email failed:', errData);
        }
      } catch (err) {
        console.warn('SendGrid error:', err);
      }
    }

    return NextResponse.json({
      message: 'If an account exists for that email, a password reset link has been sent.',
      emailSent,
      serviceUsed,
      // Provide preview link for seamless development testing
      reset_link: resetLink,
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || 'Failed to process request' }, { status: 500 });
  }
}
