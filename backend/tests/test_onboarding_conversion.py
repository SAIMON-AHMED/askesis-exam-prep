"""Tests for onboarding-to-practice conversion funnel."""
from datetime import datetime, timezone
from unittest.mock import MagicMock

from app.api.routers import onboarding
from app.models.models import AnalyticsEvent, User
from app.schemas.schemas import OnboardingUpdate


def test_onboarding_completion_logs_conversion_event(monkeypatch):
    """Verify onboarding completion triggers a funnel-tracking event."""
    user = User(id="user-123", email="test@example.com", hashed_password="hash")
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = user

    payload = OnboardingUpdate(
        primary_exam_id="sat",
        exam_date=datetime.now(timezone.utc),
        target_score=1500,
        weekly_study_hours=5.0,
        weak_topics=["reading"],
    )

    # Mock the response to check that analytics event was added
    analytics_event = None

    def mock_add(obj):
        nonlocal analytics_event
        if isinstance(obj, AnalyticsEvent):
            analytics_event = obj

    db.add.side_effect = mock_add

    onboarding.update_onboarding(payload, db, user)

    assert analytics_event is not None
    assert analytics_event.event_type == "onboarding_completed"
    assert analytics_event.event_data["exam_id"] == "sat"
    assert analytics_event.event_data["weekly_study_hours"] == 5.0
    db.commit.assert_called()


def test_onboarding_completion_marks_timestamp():
    """Verify that onboarding completion sets the timestamp."""
    user = User(id="user-456", email="test2@example.com", hashed_password="hash")
    assert user.onboarding_completed_at is None

    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = user

    payload = OnboardingUpdate(
        primary_exam_id="act",
        exam_date=None,
        target_score=30,
        weekly_study_hours=3.0,
        weak_topics=["math"],
    )

    result = onboarding.update_onboarding(payload, db, user)

    assert result.completed is True
