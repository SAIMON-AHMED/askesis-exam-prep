"""Email service supporting Resend, SendGrid, and development fallback."""
import logging
import urllib.error
import urllib.request
import json
from app.core.config import get_settings

logger = logging.getLogger(__name__)


def send_password_reset_email(to_email: str, reset_link: str) -> bool:
    """Send a password reset email via Resend or SendGrid with graceful logging fallback."""
    settings = get_settings()
    subject = "Reset your Askesis Exam Prep password"
    html_content = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Reset Your Password</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        You recently requested to reset your password for your <strong>Askesis Exam Prep</strong> account. Click the button below to choose a new password.
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="{reset_link}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
          Reset Password
        </a>
      </div>
      <p style="font-size: 13px; line-height: 1.6; color: #64748b;">
        Or copy and paste this link into your browser:<br>
        <a href="{reset_link}" style="color: #2563eb; word-break: break-all;">{reset_link}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
        This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
    """

    from_email = settings.email_from or "contact@askesisprep.com"

    # 1. Try Resend if configured
    if settings.resend_api_key:
        try:
            req_data = json.dumps({
                "from": from_email,
                "to": [to_email],
                "subject": subject,
                "html": html_content,
            }).encode("utf-8")

            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "AskesisExamPrep/1.0",
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in (200, 201):
                    logger.info("Password reset email sent via Resend to %s", to_email)
                    return True
        except Exception as e:
            logger.error("Failed to send email via Resend to %s: %s", to_email, e)

    # 2. Try SendGrid if configured
    if settings.sendgrid_api_key:
        try:
            req_data = json.dumps({
                "personalizations": [{"to": [{"email": to_email}]}],
                "from": {"email": from_email, "name": "Askesis Exam Prep"},
                "subject": subject,
                "content": [{"type": "text/html", "value": html_content}],
            }).encode("utf-8")

            req = urllib.request.Request(
                "https://api.sendgrid.com/v3/mail/send",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {settings.sendgrid_api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "AskesisExamPrep/1.0",
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in (200, 202):
                    logger.info("Password reset email sent via SendGrid to %s", to_email)
                    return True
        except Exception as e:
            logger.error("Failed to send email via SendGrid to %s: %s", to_email, e)

    # Fallback log in dev/preview environment
    logger.info("[EMAIL PREVIEW] Password reset email for %s: %s", to_email, reset_link)
    return True
