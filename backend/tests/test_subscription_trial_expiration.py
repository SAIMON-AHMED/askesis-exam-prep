from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

from app.models.models import Subscription, SubscriptionStatus
from app.services.subscription import expire_expired_trials, expire_trial_if_needed


def test_expire_trial_if_needed_marks_expired_trial_as_canceled():
    subscription = Subscription(
        user_id="user-123",
        plan_name="pro",
        status=SubscriptionStatus.trialing,
        trial_ends_at=datetime.now(timezone.utc) - timedelta(days=1),
    )
    db = MagicMock()

    result = expire_trial_if_needed(subscription, db)

    assert result.status == SubscriptionStatus.canceled
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(subscription)


def test_expire_expired_trials_cancels_every_expired_trial():
    expired_1 = Subscription(
        user_id="user-1",
        plan_name="pro",
        status=SubscriptionStatus.trialing,
        trial_ends_at=datetime.now(timezone.utc) - timedelta(days=2),
    )
    expired_2 = Subscription(
        user_id="user-2",
        plan_name="premium",
        status=SubscriptionStatus.trialing,
        trial_ends_at=datetime.now(timezone.utc) - timedelta(days=1),
    )
    db = MagicMock()
    db.query.return_value.filter.return_value.all.return_value = [expired_1, expired_2]

    count = expire_expired_trials(db)

    assert count == 2
    assert expired_1.status == SubscriptionStatus.canceled
    assert expired_2.status == SubscriptionStatus.canceled
    db.commit.assert_called_once()
