from datetime import datetime, timezone
from unittest.mock import MagicMock

from app.api.routers import profile
from app.models.models import User
from app.schemas.schemas import UserSettingsUpdate


def test_profile_settings_persist_exam_and_date():
    user = User(id="user-settings", email="settings@example.com", hashed_password="hash")
    db = MagicMock()
    db.refresh.side_effect = lambda _: None
    exam_date = datetime(2026, 10, 24, tzinfo=timezone.utc)

    result = profile.update_settings(
        UserSettingsUpdate(target_exam="ACT", exam_date=exam_date, target_score=32),
        user,
        db,
    )

    assert user.primary_exam_id == "act"
    assert user.exam_date == exam_date
    assert user.target_score == 32
    assert result["target_exam"] == "act"
    assert result["exam_date"] == exam_date.isoformat()
    db.commit.assert_called_once()


def test_profile_settings_get_returns_persisted_exam_fields():
    exam_date = datetime(2026, 12, 5, tzinfo=timezone.utc)
    user = User(
        id="user-settings-get",
        email="settings-get@example.com",
        hashed_password="hash",
        primary_exam_id="gre",
        exam_date=exam_date,
        target_score=325,
    )

    result = profile.get_settings(user)

    assert result["target_exam"] == "gre"
    assert result["exam_date"] == exam_date.isoformat()
    assert result["target_score"] == 325
