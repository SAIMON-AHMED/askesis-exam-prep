"""Authenticated study-time logging and daily-goal endpoints."""
from datetime import datetime, time, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.exam_config import normalize_exam_id
from app.models.models import StudySession, User
from app.schemas.schemas import DailyStudyGoalUpdate, StudyReminderUpdate, StudyTimeLogRequest

router = APIRouter(prefix="/study-time", tags=["study-time"])


def _today_start() -> datetime:
    return datetime.combine(datetime.now(timezone.utc).date(), time.min, tzinfo=timezone.utc)


def _today_sessions(db: Session, user_id: str) -> list[StudySession]:
    return (
        db.query(StudySession)
        .filter(StudySession.user_id == user_id, StudySession.created_at >= _today_start())
        .order_by(StudySession.created_at.desc())
        .all()
    )


def _current_streak(db: Session, user_id: str) -> int:
    timestamps = db.query(StudySession.created_at).filter(StudySession.user_id == user_id).all()
    studied_dates = {row[0].date() for row in timestamps if row[0] is not None}
    cursor = datetime.now(timezone.utc).date()
    if cursor not in studied_dates:
        cursor -= timedelta(days=1)
    streak = 0
    while cursor in studied_dates:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def _summary(db: Session, user: User) -> dict:
    sessions = _today_sessions(db, user.id)
    today_hours = round(sum(item.duration_seconds for item in sessions) / 3600, 2)
    goal_hours = float(user.daily_study_goal_hours or 2.0)
    progress = min(100, round(today_hours / goal_hours * 100)) if goal_hours else 0
    return {
        "today_study_hours": today_hours,
        "daily_study_goal_hours": goal_hours,
        "weekly_target_hours": user.weekly_study_hours or 10,
        "progress_percentage": progress,
        "is_goal_reached": today_hours >= goal_hours,
        "remaining_hours": round(max(0, goal_hours - today_hours), 2),
        "daily_goal_reminder_enabled": user.daily_goal_reminder_enabled is not False,
        "daily_goal_reminder_time": user.daily_goal_reminder_time or "20:00",
        "logs": [
            {
                "id": item.id,
                "duration_minutes": round(item.duration_seconds / 60),
                "topic": item.topic,
                "exam_type": item.exam_type,
                "activity_type": item.activity_type,
                "notes": item.notes,
                "timestamp": item.created_at.isoformat(),
            }
            for item in sessions
        ],
        "current_streak": _current_streak(db, user.id),
    }


@router.get("/today")
def get_today(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> dict:
    return _summary(db, current_user)


@router.post("/log")
def log_study_time(
    payload: StudyTimeLogRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    session = StudySession(
        user_id=current_user.id,
        topic=payload.topic.strip(),
        exam_type=normalize_exam_id(payload.exam_type) or payload.exam_type.lower().strip(),
        duration_seconds=payload.duration_minutes * 60,
        questions_attempted=0,
        questions_correct=0,
        activity_type=payload.activity_type,
        notes=payload.notes,
    )
    current_user.total_study_hours = round(
        float(current_user.total_study_hours or 0) + payload.duration_minutes / 60,
        2,
    )
    db.add(session)
    db.add(current_user)
    db.commit()
    db.refresh(session)
    result = _summary(db, current_user)
    result.update({"success": True, "logged_item": result["logs"][0]})
    return result


@router.put("/goal")
def update_daily_goal(
    payload: DailyStudyGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    current_user.daily_study_goal_hours = round(payload.daily_study_goal_hours, 2)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return {"success": True, **_summary(db, current_user)}


@router.get("/reminder")
def get_reminder(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "daily_goal_reminder_enabled": current_user.daily_goal_reminder_enabled is not False,
        "daily_goal_reminder_time": current_user.daily_goal_reminder_time or "20:00",
    }


@router.put("/reminder")
def update_reminder(
    payload: StudyReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    current_user.daily_goal_reminder_enabled = payload.daily_goal_reminder_enabled
    current_user.daily_goal_reminder_time = payload.daily_goal_reminder_time
    db.add(current_user)
    db.commit()
    return {"success": True, **get_reminder(current_user)}
