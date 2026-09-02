"""Tests for exam-scope filtering + backfill (Phase 1 steps 3a/6, plan verification items 1/3)."""
import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.routers.analytics import get_topic_performance
from app.api.routers.progress import get_progress
from app.db.session import Base
from app.models.models import GeneratedQuestion, QuestionFormat, User, UserAttempt, UserProgress
from app.services.exam_backfill import backfill_user_attempts


def _session_and_user():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    user = User(email="scope@example.com", hashed_password="hash")
    session.add(user)
    session.commit()
    session.refresh(user)
    return session, user


def test_two_exams_same_topic_stay_separate_after_backfill():
    db, user = _session_and_user()
    q_sat = GeneratedQuestion(
        exam_type="sat", topic="Algebra", difficulty=2, question_format=QuestionFormat.multiple_choice,
        question_text="q1", correct_answer="A", explanation="e",
    )
    q_act = GeneratedQuestion(
        exam_type="act", topic="Algebra", difficulty=2, question_format=QuestionFormat.multiple_choice,
        question_text="q2", correct_answer="A", explanation="e",
    )
    db.add_all([q_sat, q_act])
    db.commit()
    db.refresh(q_sat)
    db.refresh(q_act)

    db.add_all([
        UserAttempt(user_id=user.id, generated_question_id=q_sat.id, submitted_answer="A", is_correct=True,
                    time_taken_seconds=10, difficulty=2, topic="Algebra"),
        UserAttempt(user_id=user.id, generated_question_id=q_act.id, submitted_answer="B", is_correct=False,
                    time_taken_seconds=10, difficulty=2, topic="Algebra"),
    ])
    db.add_all([
        UserProgress(user_id=user.id, topic="Algebra", exam_type="sat", mastery_score=90),
        UserProgress(user_id=user.id, topic="Algebra", exam_type="act", mastery_score=40),
    ])
    db.commit()

    backfilled = backfill_user_attempts(db)
    db.commit()
    assert backfilled == 2

    attempts = db.query(UserAttempt).filter(UserAttempt.user_id == user.id).all()
    assert {a.exam_type for a in attempts} == {"sat", "act"}

    sat_progress = get_topic_performance(exam_type="sat", current_user=user, db=db)
    act_progress = get_topic_performance(exam_type="act", current_user=user, db=db)
    assert sat_progress[0].mastery_score == 90.0
    assert act_progress[0].mastery_score == 40.0


def test_missing_exam_type_returns_all_scoped_rows():
    db, user = _session_and_user()
    db.add(UserProgress(user_id=user.id, topic="Algebra", exam_type="sat", mastery_score=90))
    db.commit()

    all_rows = get_topic_performance(exam_type=None, current_user=user, db=db)
    assert len(all_rows) == 1


def test_invalid_exam_type_rejected_with_422_not_silent_default():
    db, user = _session_and_user()
    with pytest.raises(HTTPException) as exc_info:
        get_topic_performance(exam_type="not-a-real-exam", current_user=user, db=db)
    assert exc_info.value.status_code == 422

    with pytest.raises(HTTPException) as exc_info:
        get_progress(user_id=user.id, exam_type="not-a-real-exam", db=db, current_user=user)
    assert exc_info.value.status_code == 422
