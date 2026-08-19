"""Practice submission and history endpoints."""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import GeneratedQuestion, Question, User, UserAttempt, UserProgress
from app.schemas.schemas import PracticeQuotaOut, PracticeSubmitRequest, PracticeSubmitResponse, UserAttemptOut
from app.services.adaptive_engine import AdaptiveInput, compute_recommendation
from app.services.subscription import get_practice_quota

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/practice", tags=["practice"])


@router.get("/quota", response_model=PracticeQuotaOut)
def get_quota(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    return get_practice_quota(current_user.id, db)


@router.post("/submit", response_model=PracticeSubmitResponse)
def submit_attempt(
    payload: PracticeSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PracticeSubmitResponse:
    correct_answer: str
    explanation: str

    if payload.generated_question_id:
        question = db.get(GeneratedQuestion, payload.generated_question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
        correct_answer, explanation = question.correct_answer, question.explanation
    elif payload.question_id:
        question = db.get(Question, payload.question_id)
        if not question:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
        correct_answer, explanation = question.correct_answer, question.explanation
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either generated_question_id or question_id must be provided",
        )

    is_correct = payload.submitted_answer.strip().lower() == correct_answer.strip().lower()

    attempt = UserAttempt(
        user_id=current_user.id,
        generated_question_id=payload.generated_question_id,
        question_id=payload.question_id,
        submitted_answer=payload.submitted_answer,
        is_correct=is_correct,
        time_taken_seconds=payload.time_taken_seconds,
        difficulty=payload.difficulty,
        topic=payload.topic,
    )
    db.add(attempt)
    db.commit()

    # Recompute progress for this topic from last 20 attempts.
    recent_attempts = (
        db.query(UserAttempt)
        .filter(UserAttempt.user_id == current_user.id, UserAttempt.topic == payload.topic)
        .order_by(UserAttempt.created_at.desc())
        .limit(20)
        .all()
    )
    accuracy_rate = (
        sum(1 for a in recent_attempts if a.is_correct) / len(recent_attempts) if recent_attempts else 0.0
    )
    avg_time = (
        sum(a.time_taken_seconds for a in recent_attempts) / len(recent_attempts) if recent_attempts else 0.0
    )

    progress = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == current_user.id, UserProgress.topic == payload.topic)
        .first()
    )
    if not progress:
        progress = UserProgress(user_id=current_user.id, topic=payload.topic, current_difficulty=payload.difficulty)
        db.add(progress)

    progress.accuracy_rate = accuracy_rate
    progress.avg_time_per_question = avg_time
    progress.mastery_score = accuracy_rate * 100

    recommendation = compute_recommendation(
        AdaptiveInput(
            accuracy_rate=accuracy_rate,
            avg_time_per_question=avg_time,
            topic_mastery_score=progress.mastery_score,
            current_difficulty=progress.current_difficulty,
        )
    )
    progress.current_difficulty = recommendation.next_difficulty
    db.commit()

    return PracticeSubmitResponse(
        is_correct=is_correct,
        correct_answer=correct_answer,
        explanation=explanation,
        next_recommended_difficulty=recommendation.next_difficulty,
    )


@router.get("/history", response_model=list[UserAttemptOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserAttemptOut]:
    attempts = (
        db.query(UserAttempt)
        .filter(UserAttempt.user_id == current_user.id)
        .order_by(UserAttempt.created_at.desc())
        .all()
    )

    results: list[UserAttemptOut] = []
    for attempt in attempts:
        question_text: str | None = None
        correct_answer: str | None = None
        if attempt.generated_question_id:
            q = db.get(GeneratedQuestion, attempt.generated_question_id)
            if q:
                question_text, correct_answer = q.question_text, q.correct_answer
        elif attempt.question_id:
            q = db.get(Question, attempt.question_id)
            if q:
                question_text, correct_answer = q.question_text, q.correct_answer

        results.append(
            UserAttemptOut(
                id=attempt.id,
                submitted_answer=attempt.submitted_answer,
                is_correct=attempt.is_correct,
                time_taken_seconds=attempt.time_taken_seconds,
                difficulty=attempt.difficulty,
                topic=attempt.topic,
                question_text=question_text,
                correct_answer=correct_answer,
                created_at=attempt.created_at,
            )
        )
    return results
