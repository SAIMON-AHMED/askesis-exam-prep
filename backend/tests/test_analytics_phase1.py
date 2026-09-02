"""Tests for Phase 1 step 6: restructured analytics endpoints with global/exam split."""
import pytest
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.routers.analytics import get_analytics_overview, get_weekly_stats
from app.db.session import Base
from app.models.models import ExamSession, ExamSessionStatus, StudySession, User
from app.schemas.schemas import AnalyticsMetrics, DayStudyStats


def _session_and_user():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    user = User(email="analytics@example.com", hashed_password="hash")
    session.add(user)
    session.commit()
    session.refresh(user)
    return session, user


def test_overview_global_metrics_sum_all_exams():
    db, user = _session_and_user()
    now = datetime.now(timezone.utc)
    
    # Add study sessions for different exams
    for exam_type, hours in [("sat", 2), ("act", 1.5)]:
        db.add(StudySession(
            user_id=user.id, exam_type=exam_type, topic="Algebra", duration_seconds=int(hours * 3600),
            questions_attempted=0, questions_correct=0, activity_type=None,
        ))
    
    # Add exam sessions
    for exam_type, score in [("sat", 18), ("act", 16)]:
        db.add(ExamSession(
            user_id=user.id, exam_type=exam_type, status=ExamSessionStatus.submitted,
            duration_seconds=3600, question_ids=[], total_questions=20,
            raw_score=score, started_at=now,
        ))
    db.commit()
    
    result = get_analytics_overview(exam_type=None, current_user=user, db=db)
    
    # Global should sum both SAT and ACT
    assert result.global_metrics.total_study_hours == 3.5
    assert result.global_metrics.exams_completed == 2
    # Average of (18, 16) = 17
    assert result.global_metrics.average_score == 17.0
    
    # No exam specified, so exam_metrics should be None
    assert result.exam_metrics is None


def test_overview_exam_metrics_filtered_to_one_exam():
    db, user = _session_and_user()
    now = datetime.now(timezone.utc)
    
    # Add study sessions for different exams
    db.add(StudySession(
        user_id=user.id, exam_type="sat", topic="Algebra", duration_seconds=int(2 * 3600),
        questions_attempted=0, questions_correct=0,
    ))
    db.add(StudySession(
        user_id=user.id, exam_type="act", topic="Algebra", duration_seconds=int(1 * 3600),
        questions_attempted=0, questions_correct=0,
    ))
    
    # Add exam sessions
    db.add(ExamSession(
        user_id=user.id, exam_type="sat", status=ExamSessionStatus.submitted,
        duration_seconds=3600, question_ids=[], total_questions=20,
        raw_score=18, started_at=now,
    ))
    db.add(ExamSession(
        user_id=user.id, exam_type="act", status=ExamSessionStatus.submitted,
        duration_seconds=3600, question_ids=[], total_questions=20,
        raw_score=16, started_at=now,
    ))
    db.commit()
    
    result = get_analytics_overview(exam_type="sat", current_user=user, db=db)
    
    # Global still sums both
    assert result.global_metrics.total_study_hours == 3.0
    assert result.global_metrics.exams_completed == 2
    
    # Exam metrics filtered to SAT only
    assert result.exam_metrics is not None
    assert result.exam_metrics.total_study_hours == 2.0
    assert result.exam_metrics.exams_completed == 1
    assert result.exam_metrics.average_score == 18.0


def test_weekly_stats_global_vs_exam_breakdown():
    db, user = _session_and_user()
    
    # Add study sessions for today (day 0) and yesterday (day -1)
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = today - timedelta(days=1)
    
    # SAT: 1 hour today, 0.5 hours yesterday
    db.add(StudySession(
        user_id=user.id, exam_type="sat", topic="Algebra", duration_seconds=3600,
        questions_attempted=0, questions_correct=0, created_at=today + timedelta(hours=10),
    ))
    db.add(StudySession(
        user_id=user.id, exam_type="sat", topic="Geometry", duration_seconds=1800,
        questions_attempted=0, questions_correct=0, created_at=yesterday + timedelta(hours=10),
    ))
    
    # ACT: 0.5 hours today, 1 hour yesterday
    db.add(StudySession(
        user_id=user.id, exam_type="act", topic="English", duration_seconds=1800,
        questions_attempted=0, questions_correct=0, created_at=today + timedelta(hours=12),
    ))
    db.add(StudySession(
        user_id=user.id, exam_type="act", topic="Math", duration_seconds=3600,
        questions_attempted=0, questions_correct=0, created_at=yesterday + timedelta(hours=14),
    ))
    db.commit()
    
    result = get_weekly_stats(exam_type="sat", current_user=user, db=db)
    
    # Global daily should have both exams (1.5 today, 1.5 yesterday)
    today_global = result.global_daily[-1]
    yesterday_global = result.global_daily[-2]
    assert today_global.study_hours == 1.5
    assert yesterday_global.study_hours == 1.5
    
    # SAT-filtered daily should have only SAT (1 today, 0.5 yesterday)
    assert result.exam_daily is not None
    today_sat = result.exam_daily[-1]
    yesterday_sat = result.exam_daily[-2]
    assert today_sat.study_hours == 1.0
    assert yesterday_sat.study_hours == 0.5


def test_overview_unknown_exam_type_rejected_with_422():
    db, user = _session_and_user()
    from fastapi import HTTPException
    
    with pytest.raises(HTTPException) as exc_info:
        get_analytics_overview(exam_type="not-a-real-exam", current_user=user, db=db)
    assert exc_info.value.status_code == 422


def test_weekly_stats_unknown_exam_type_rejected_with_422():
    db, user = _session_and_user()
    from fastapi import HTTPException
    
    with pytest.raises(HTTPException) as exc_info:
        get_weekly_stats(exam_type="not-a-real-exam", current_user=user, db=db)
    assert exc_info.value.status_code == 422
