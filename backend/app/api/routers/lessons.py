"""Learn 2.0: lesson progress endpoints.

Lesson *content* (steps, worked examples, micro-quizzes) is hand-authored and lives in the
frontend (frontend/src/lib/lessonsData.ts) — deterministic and versioned, never generated at
runtime. This router only tracks a user's progress through a lesson.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.exam_config import normalize_exam_id
from app.db.session import get_db
from app.models.models import LessonProgress, LessonStatus, User
from app.schemas.schemas import LessonProgressOut, LessonProgressUpdate

router = APIRouter(prefix="/lessons", tags=["lessons"])


@router.get("/progress", response_model=list[LessonProgressOut])
def get_lesson_progress(
    exam_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[LessonProgress]:
    query = db.query(LessonProgress).filter(LessonProgress.user_id == current_user.id)
    if exam_type is not None:
        normalized = normalize_exam_id(exam_type)
        if normalized is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")
        query = query.filter(LessonProgress.exam_type == normalized)
    return query.all()


@router.post("/{lesson_id}/progress", response_model=LessonProgressOut)
def upsert_lesson_progress(
    lesson_id: str,
    payload: LessonProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LessonProgress:
    normalized_exam = normalize_exam_id(payload.exam_type)
    if normalized_exam is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")

    item = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == current_user.id, LessonProgress.lesson_id == lesson_id)
        .first()
    )
    now = datetime.now(timezone.utc)
    if item is None:
        item = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            topic=payload.topic,
            exam_type=normalized_exam,
            started_at=now,
        )
        db.add(item)

    item.status = LessonStatus(payload.status)
    item.current_step = payload.current_step
    if payload.mastery_evidence_score is not None:
        item.mastery_evidence_score = payload.mastery_evidence_score
    if payload.status in ("completed", "tested_out") and item.completed_at is None:
        item.completed_at = now

    if payload.micro_quiz_result is not None:
        results = list(item.micro_quiz_results or [])
        result_dict = payload.micro_quiz_result.model_dump()
        results = [r for r in results if r.get("step_number") != result_dict["step_number"]]
        results.append(result_dict)
        item.micro_quiz_results = results

    db.commit()
    db.refresh(item)
    return item
