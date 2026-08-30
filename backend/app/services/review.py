"""Deterministic spaced-repetition scheduling helpers."""
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.models import ReviewItem


def schedule_review(
    db: Session,
    user_id: str,
    question_key: str,
    exam_type: str,
    topic: str,
    rating: str,
    is_correct: bool | None = None,
) -> ReviewItem:
    item = (
        db.query(ReviewItem)
        .filter(ReviewItem.user_id == user_id, ReviewItem.question_key == question_key)
        .first()
    )
    if item is None:
        item = ReviewItem(user_id=user_id, question_key=question_key, exam_type=exam_type, topic=topic)
        db.add(item)

    now = datetime.now(timezone.utc)
    if rating == "again":
        item.interval_days = 0.25
        item.repetitions = 0
        item.lapses += 1
    elif rating == "hard":
        item.interval_days = max(1.0, item.interval_days * 1.2)
        item.repetitions += 1
    elif rating == "easy":
        item.interval_days = max(2.0, item.interval_days * item.ease_factor * 1.3)
        item.ease_factor = min(3.0, item.ease_factor + 0.15)
        item.repetitions += 1
    else:
        item.interval_days = 1.0 if item.repetitions == 0 else max(1.0, item.interval_days * item.ease_factor)
        item.repetitions += 1

    item.last_reviewed_at = now
    item.last_is_correct = is_correct
    item.due_at = now + timedelta(days=item.interval_days)
    return item


def create_review_item_from_attempt(db: Session, attempt) -> ReviewItem:
    return schedule_review(
        db,
        user_id=attempt.user_id,
        question_key=attempt.generated_question_id or f"topic:{attempt.topic}",
        exam_type=getattr(attempt.generated_question, "exam_type", "unknown"),
        topic=attempt.topic,
        rating="good" if attempt.is_correct else "again",
        is_correct=attempt.is_correct,
    )