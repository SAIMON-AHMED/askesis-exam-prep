"""Tests for password reset flow."""
from unittest.mock import MagicMock

from app.api.routers import auth
from app.models.models import User
from app.schemas.schemas import PasswordResetRequest


def test_forgot_password_updates_user_password():
    """A user can reset their password with a valid email."""
    user = User(id="user-999", email="reset@example.com", hashed_password="old-hash")
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = user

    payload = PasswordResetRequest(email="reset@example.com", new_password="newpass123")
    result = auth.forgot_password(payload, db)

    assert result["message"] == "Password reset successful"
    assert user.hashed_password != "old-hash"
    db.commit.assert_called_once()
