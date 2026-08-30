"""Tests for password reset flow."""
from unittest.mock import MagicMock

from app.api.routers import auth
from app.models.models import User
from app.schemas.schemas import PasswordResetRequest


def test_forgot_password_updates_user_password():
    """A user can reset their password with a valid email (legacy direct reset)."""
    user = User(id="user-999", email="reset@example.com", hashed_password="old-hash")
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = user

    payload = PasswordResetRequest(email="reset@example.com", new_password="newpass123")
    result = auth.forgot_password(payload, db)

    assert result["message"] == "Password reset successful"
    assert user.hashed_password != "old-hash"
    db.commit.assert_called_once()


def test_forgot_password_and_token_reset():
    """Forgot password sends email link and user confirms reset via token."""
    from app.core.security import create_password_reset_token
    from app.schemas.schemas import ForgotPasswordRequest, PasswordResetConfirmRequest

    user = User(id="user-100", email="student@example.com", hashed_password="old-hash-val")
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = user

    # 1. Request forgot password link
    forgot_payload = ForgotPasswordRequest(email="student@example.com")
    result_forgot = auth.forgot_password(forgot_payload, db)
    assert "sent" in result_forgot["message"]

    # 2. Complete reset with valid token
    token = create_password_reset_token("student@example.com")
    confirm_payload = PasswordResetConfirmRequest(token=token, new_password="brandnewpass123")
    result_reset = auth.reset_password(confirm_payload, db)

    assert result_reset["message"] == "Password has been successfully reset. You can now log in."
    assert user.hashed_password != "old-hash-val"

