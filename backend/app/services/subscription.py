"""Helpers for checking a user's subscription/premium status and practice quota."""
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.models import ExamPurchase, Subscription, SubscriptionStatus, UserAttempt

FREE_DAILY_PRACTICE_LIMIT = 5
_ACTIVE_STATUSES = {SubscriptionStatus.active, SubscriptionStatus.trialing}


def get_current_subscription(user_id: str, db: Session) -> Subscription:
    """Get the user's current subscription, or create a free one if none exists."""
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user_id)
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if subscription is None:
        # Auto-create free subscription for new users
        subscription = Subscription(
            user_id=user_id,
            plan_name="free",
            status=SubscriptionStatus.active,
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
    return subscription


def is_premium_user(user_id: str, db: Session) -> bool:
    subscription = get_current_subscription(user_id, db)
    return subscription.plan_name != "free" and subscription.status in _ACTIVE_STATUSES


def user_has_exam_access(user_id: str, exam_id: str, db: Session) -> bool:
    """True when the user purchased this exam or has an active paid subscription."""
    if is_premium_user(user_id, db):
        return True
    purchase = (
        db.query(ExamPurchase)
        .filter(ExamPurchase.user_id == user_id, ExamPurchase.exam_id == exam_id.lower())
        .first()
    )
    return purchase is not None


def count_practice_attempts_today(user_id: str, db: Session) -> int:
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return (
        db.query(UserAttempt)
        .filter(UserAttempt.user_id == user_id, UserAttempt.created_at >= start_of_day)
        .count()
    )


def get_practice_quota(user_id: str, db: Session) -> dict:
    premium = is_premium_user(user_id, db)
    questions_today = count_practice_attempts_today(user_id, db)
    daily_limit = None if premium else FREE_DAILY_PRACTICE_LIMIT
    remaining = None if premium else max(0, FREE_DAILY_PRACTICE_LIMIT - questions_today)
    return {
        "is_premium": premium,
        "questions_today": questions_today,
        "daily_limit": daily_limit,
        "remaining": remaining,
    }
