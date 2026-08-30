"""Short baseline diagnostic sessions."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import ExamSession, ExamSessionStatus, GeneratedQuestion, User, UserAttempt
from app.schemas.schemas import (
    DiagnosticResultOut,
    DiagnosticStartRequest,
    DiagnosticSubmitRequest,
    DiagnosticTopicResult,
    ExamQuestionOut,
    ExamSessionOut,
)
from app.services.exam import build_exam_questions
from app.services.review import schedule_review

router = APIRouter(prefix="/diagnostic", tags=["diagnostic"])


@router.post("/start", response_model=ExamSessionOut, status_code=status.HTTP_201_CREATED)
def start_diagnostic(
    payload: DiagnosticStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExamSessionOut:
    questions = build_exam_questions(
        db, payload.exam_type, payload.topics, payload.number_of_questions, user_id=current_user.id
    )
    if not questions:
        raise HTTPException(status_code=422, detail="No diagnostic questions are available")
    session = ExamSession(
        user_id=current_user.id,
        exam_type=payload.exam_type,
        session_type="diagnostic",
        duration_seconds=0,
        status=ExamSessionStatus.in_progress,
        question_ids=[question.id for question in questions],
        total_questions=len(questions),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return ExamSessionOut(
        id=session.id,
        exam_type=session.exam_type,
        duration_seconds=0,
        status=session.status.value,
        total_questions=session.total_questions,
        started_at=session.started_at,
        questions=[
            ExamQuestionOut(
                id=question.id,
                question_text=question.question_text,
                options=question.options,
                topic=question.topic,
                difficulty=question.difficulty,
                visual_aid=question.visual_aid,
            )
            for question in questions
        ],
    )


@router.post("/{session_id}/submit", response_model=DiagnosticResultOut)
def submit_diagnostic(
    session_id: str,
    payload: DiagnosticSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DiagnosticResultOut:
    session = db.get(ExamSession, session_id)
    if not session or session.user_id != current_user.id or session.session_type != "diagnostic":
        raise HTTPException(status_code=404, detail="Diagnostic session not found")
    if session.status != ExamSessionStatus.in_progress:
        raise HTTPException(status_code=400, detail="Diagnostic already submitted")

    questions = [db.get(GeneratedQuestion, question_id) for question_id in session.question_ids]
    questions = [question for question in questions if question is not None]
    topic_stats: dict[str, dict[str, int]] = {}
    raw_score = 0
    for question in questions:
        submitted_answer = payload.answers.get(question.id, "")
        is_correct = submitted_answer.strip().lower() == question.correct_answer.strip().lower()
        stats = topic_stats.setdefault(question.topic, {"correct": 0, "total": 0})
        stats["total"] += 1
        stats["correct"] += int(is_correct)
        raw_score += int(is_correct)
        db.add(
            UserAttempt(
                user_id=current_user.id,
                generated_question_id=question.id,
                submitted_answer=submitted_answer,
                is_correct=is_correct,
                time_taken_seconds=0,
                difficulty=question.difficulty,
                topic=question.topic,
            )
        )
        schedule_review(
            db,
            current_user.id,
            question.id,
            question.exam_type,
            question.topic,
            "good" if is_correct else "again",
            is_correct,
        )

    session.answers = payload.answers
    session.raw_score = raw_score
    session.status = ExamSessionStatus.submitted
    db.commit()
    topic_results = [
        DiagnosticTopicResult(
            topic=topic,
            correct=stats["correct"],
            total=stats["total"],
            accuracy=stats["correct"] / stats["total"],
        )
        for topic, stats in topic_stats.items()
    ]
    topic_results.sort(key=lambda result: result.accuracy)
    recommended_difficulty = 1 if raw_score / max(len(questions), 1) < 0.5 else 2
    return DiagnosticResultOut(
        session_id=session.id,
        exam_type=session.exam_type,
        raw_score=raw_score,
        total_questions=len(questions),
        recommended_difficulty=recommended_difficulty,
        topic_results=topic_results,
        weak_topics=[result.topic for result in topic_results[:3]],
    )
