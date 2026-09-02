"""Timed exam endpoints: start a full mock exam, submit answers, get scored results."""
import logging
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.exam_config import normalize_exam_id
from app.db.session import get_db
from app.models.models import ExamSession, ExamSessionStatus, GeneratedQuestion, User
from app.schemas.schemas import (
    ExamQuestionOut,
    ExamResultOut,
    ExamSessionOut,
    ExamSessionSummaryOut,
    ExamStartRequest,
    ExamSubmitRequest,
)
from app.services.exam import build_exam_questions, score_exam

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/exam", tags=["exam"])


@router.post("/start", response_model=ExamSessionOut, status_code=status.HTTP_201_CREATED)
def start_exam(
    payload: ExamStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExamSessionOut:
    exam_type = normalize_exam_id(payload.exam_type) or payload.exam_type.lower().strip()
    started = time.perf_counter()
    try:
        questions = build_exam_questions(
            db, exam_type, payload.topics, payload.number_of_questions, user_id=current_user.id
        )
    except Exception as exc:
        logger.error("Exam question generation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not generate exam questions"
        ) from exc

    generation_seconds = time.perf_counter() - started
    logger.info(
        "exam_start exam_type=%s topics=%d requested=%d generated=%d generation_seconds=%.2f",
        payload.exam_type,
        len(payload.topics or []),
        payload.number_of_questions,
        len(questions),
        generation_seconds,
    )

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No valid questions could be generated"
        )

    session = ExamSession(
        user_id=current_user.id,
        exam_type=exam_type,
        exam_subject=payload.subject,
        duration_seconds=payload.duration_minutes * 60,
        status=ExamSessionStatus.in_progress,
        question_ids=[q.id for q in questions],
        total_questions=len(questions),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return ExamSessionOut(
        id=session.id,
        exam_type=session.exam_type,
        duration_seconds=session.duration_seconds,
        status=session.status.value,
        total_questions=session.total_questions,
        started_at=session.started_at,
        questions=[
            ExamQuestionOut(
                id=q.id, question_text=q.question_text, options=q.options, topic=q.topic, difficulty=q.difficulty,
                visual_aid=q.visual_aid,
            )
            for q in questions
        ],
    )


def _get_owned_session(db: Session, session_id: str, user: User) -> ExamSession:
    session = db.get(ExamSession, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found")
    if session.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another user's exam")
    return session


@router.get("/history/list", response_model=list[ExamSessionSummaryOut])
def exam_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ExamSession]:
    return (
        db.query(ExamSession)
        .filter(ExamSession.user_id == current_user.id)
        .order_by(ExamSession.started_at.desc())
        .all()
    )


@router.get("/{session_id}", response_model=ExamSessionOut)
def get_exam(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExamSessionOut:
    session = _get_owned_session(db, session_id, current_user)
    questions = [db.get(GeneratedQuestion, qid) for qid in session.question_ids]
    questions = [q for q in questions if q is not None]

    return ExamSessionOut(
        id=session.id,
        exam_type=session.exam_type,
        duration_seconds=session.duration_seconds,
        status=session.status.value,
        total_questions=session.total_questions,
        started_at=session.started_at,
        questions=[
            ExamQuestionOut(
                id=q.id, question_text=q.question_text, options=q.options, topic=q.topic, difficulty=q.difficulty,
                visual_aid=q.visual_aid,
            )
            for q in questions
        ],
    )


@router.post("/{session_id}/submit", response_model=ExamResultOut)
def submit_exam(
    session_id: str,
    payload: ExamSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExamResultOut:
    session = _get_owned_session(db, session_id, current_user)

    if session.status != ExamSessionStatus.in_progress:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Exam already submitted")

    elapsed = (datetime.now(timezone.utc) - session.started_at).total_seconds()
    if elapsed > session.duration_seconds + 30:  # small grace period for network latency
        session.status = ExamSessionStatus.expired
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Exam time limit has expired")

    questions = [db.get(GeneratedQuestion, qid) for qid in session.question_ids]
    questions = [q for q in questions if q is not None]

    result = score_exam(questions, payload.answers, exam_type=session.exam_type, subject_id=session.exam_subject)

    session.answers = payload.answers
    session.raw_score = result["raw_score"]
    session.scaled_score_low = result["scaled_score_low"]
    session.scaled_score_high = result["scaled_score_high"]
    session.topic_breakdown = result["topic_breakdown"]
    session.status = ExamSessionStatus.submitted
    session.submitted_at = datetime.now(timezone.utc)
    db.commit()

    return ExamResultOut(
        id=session.id,
        raw_score=session.raw_score,
        total_questions=session.total_questions,
        scaled_score_low=session.scaled_score_low,
        scaled_score_high=session.scaled_score_high,
        score_label=result["score_label"],
        is_readiness_estimate=result["is_readiness_estimate"],
        topic_breakdown=session.topic_breakdown,
        status=session.status.value,
        submitted_at=session.submitted_at,
    )
