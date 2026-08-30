"""Explainable next-study recommendations."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import ReviewItem, User, UserAttempt
from app.schemas.schemas import RecommendationOut

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/next", response_model=RecommendationOut | None)
def get_next_recommendation(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> RecommendationOut | None:
    due = (
        db.query(ReviewItem)
        .filter(ReviewItem.user_id == current_user.id, ReviewItem.due_at <= datetime.now(timezone.utc))
        .order_by(ReviewItem.due_at.asc())
        .first()
    )
    if due:
        return RecommendationOut(
            exam_type=due.exam_type,
            topic=due.topic,
            action="review",
            reason="You have a review due for this topic.",
            target_difficulty=2,
            estimated_minutes=10,
            destination="/review",
        )

    attempts = db.query(UserAttempt).filter(UserAttempt.user_id == current_user.id).all()
    if not attempts:
        exam_type = current_user.primary_exam_id or "sat"
        return RecommendationOut(
            exam_type=exam_type,
            topic="",
            action="diagnostic",
            reason="Take a quick diagnostic to personalize your starting point.",
            target_difficulty=2,
            estimated_minutes=10,
            destination="/diagnostic",
        )

    grouped: dict[str, list[UserAttempt]] = {}
    for attempt in attempts:
        grouped.setdefault(attempt.topic, []).append(attempt)
    topic, topic_attempts = min(
        grouped.items(), key=lambda entry: sum(int(a.is_correct) for a in entry[1]) / len(entry[1])
    )
    exam_type = getattr(topic_attempts[-1].generated_question, "exam_type", current_user.primary_exam_id or "sat")
    accuracy = sum(int(a.is_correct) for a in topic_attempts) / len(topic_attempts)
    return RecommendationOut(
        exam_type=exam_type,
        topic=topic,
        action="practice",
        reason=f"Your recent accuracy in {topic} is {accuracy:.0%}.",
        target_difficulty=1 if accuracy < 0.5 else 2,
        estimated_minutes=15,
        destination="/practice",
    )