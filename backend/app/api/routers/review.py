"""Due-question review endpoints."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import GeneratedQuestion, ReviewItem, User
from app.schemas.schemas import ReviewAnswerRequest, ReviewItemOut
from app.services.review import schedule_review

router = APIRouter(prefix="/review", tags=["review"])


def _review_response(item: ReviewItem, db: Session) -> dict:
    question = db.get(GeneratedQuestion, item.question_key)
    return {
        "id": item.id,
        "question_key": item.question_key,
        "exam_type": item.exam_type,
        "topic": item.topic,
        "due_at": item.due_at,
        "interval_days": item.interval_days,
        "repetitions": item.repetitions,
        "last_is_correct": item.last_is_correct,
        "question_text": question.question_text if question else None,
        "options": question.options if question else None,
        "correct_answer": question.correct_answer if question else None,
        "explanation": question.explanation if question else None,
    }


@router.get("/due", response_model=list[ReviewItemOut])
def get_due_reviews(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[dict]:
    items = (
        db.query(ReviewItem)
        .filter(ReviewItem.user_id == current_user.id, ReviewItem.due_at <= datetime.now(timezone.utc))
        .order_by(ReviewItem.due_at.asc())
        .limit(50)
        .all()
    )
    return [_review_response(item, db) for item in items]


@router.post("/{item_id}/answer", response_model=ReviewItemOut)
def answer_review(
    item_id: str,
    payload: ReviewAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    item = db.query(ReviewItem).filter(ReviewItem.id == item_id, ReviewItem.user_id == current_user.id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Review item not found")
    item = schedule_review(db, current_user.id, item.question_key, item.exam_type, item.topic, payload.rating, item.last_is_correct)
    db.commit()
    db.refresh(item)
    return _review_response(item, db)