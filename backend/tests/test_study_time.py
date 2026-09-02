"""Tests for persisted study-time logging and daily goals."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.routers.study_time import get_today, log_study_time, update_daily_goal
from app.db.session import Base
from app.models.models import User
from app.schemas.schemas import DailyStudyGoalUpdate, StudyTimeLogRequest


def _session_and_user():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    user = User(email="study@example.com", hashed_password="hash")
    session.add(user)
    session.commit()
    session.refresh(user)
    return session, user


def test_log_study_time_persists_session_and_updates_summary():
    db, user = _session_and_user()

    result = log_study_time(
        StudyTimeLogRequest(
            duration_minutes=30,
            topic="Algebra",
            exam_type="act",
            activity_type="Practice drills",
            notes="Linear equations",
        ),
        db,
        user,
    )

    assert result["success"] is True
    assert result["today_study_hours"] == 0.5
    assert result["logged_item"]["exam_type"] == "act"
    assert result["logged_item"]["notes"] == "Linear equations"
    assert get_today(db, user)["logs"][0]["duration_minutes"] == 30


def test_update_daily_goal_persists_for_subsequent_reads():
    db, user = _session_and_user()

    result = update_daily_goal(DailyStudyGoalUpdate(daily_study_goal_hours=2.5), db, user)

    assert result["daily_study_goal_hours"] == 2.5
    assert get_today(db, user)["daily_study_goal_hours"] == 2.5
