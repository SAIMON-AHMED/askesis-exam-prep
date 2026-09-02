"""Analytics and insights endpoints."""
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.exam_config import normalize_exam_id
from app.models.models import (
    AnalyticsEvent,
    ExamSession,
    StudySession,
    User,
    UserProgress,
)
from app.schemas.schemas import (
    AnalyticsOverviewResponse,
    StudyTimeResponse,
    TopicPerformanceResponse,
    WeeklyStatsResponse,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/event")
def log_event(
    event_type: str,
    event_data: Optional[dict] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Log an analytics event."""
    event = AnalyticsEvent(
        user_id=current_user.id,
        event_type=event_type,
        event_data=event_data,
    )
    db.add(event)
    db.commit()
    return {"status": "logged"}


def _compute_metrics(db: Session, user_id: str, exam_type: str | None = None) -> dict:
    """Compute analytics metrics, optionally scoped to one exam."""
    # Total study hours
    study_query = db.query(func.sum(StudySession.duration_seconds)).filter(
        StudySession.user_id == user_id
    )
    if exam_type is not None:
        study_query = study_query.filter(StudySession.exam_type == exam_type)
    total_study_hours = (study_query.scalar() or 0) / 3600

    # Exams completed
    exam_query = db.query(func.count(ExamSession.id)).filter(
        ExamSession.user_id == user_id,
        ExamSession.status == "submitted",
    )
    if exam_type is not None:
        exam_query = exam_query.filter(ExamSession.exam_type == exam_type)
    exams_completed = exam_query.scalar() or 0

    # Average score
    avg_query = db.query(func.avg(ExamSession.raw_score)).filter(
        ExamSession.user_id == user_id,
        ExamSession.status == "submitted",
    )
    if exam_type is not None:
        avg_query = avg_query.filter(ExamSession.exam_type == exam_type)
    avg_score = avg_query.scalar() or 0

    # Last 7 days activity
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    last_7_query = db.query(func.sum(StudySession.duration_seconds)).filter(
        StudySession.user_id == user_id,
        StudySession.created_at >= seven_days_ago,
    )
    if exam_type is not None:
        last_7_query = last_7_query.filter(StudySession.exam_type == exam_type)
    last_7_days_study = (last_7_query.scalar() or 0) / 3600

    return {
        "total_study_hours": round(total_study_hours, 1),
        "exams_completed": exams_completed,
        "average_score": round(avg_score, 1),
        "last_7_days_study_hours": round(last_7_days_study, 1),
    }


@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(
    exam_type: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalyticsOverviewResponse:
    """Get user analytics overview, optionally scoped to one exam. Returns separate global/exam sections."""
    from app.schemas.schemas import AnalyticsMetrics
    
    normalized_exam_type = None
    if exam_type is not None:
        normalized_exam_type = normalize_exam_id(exam_type)
        if normalized_exam_type is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")

    global_metrics = _compute_metrics(db, current_user.id, exam_type=None)
    exam_metrics = _compute_metrics(db, current_user.id, exam_type=normalized_exam_type) if normalized_exam_type else None

    return AnalyticsOverviewResponse(
        global_metrics=AnalyticsMetrics(**global_metrics),
        exam_metrics=AnalyticsMetrics(**exam_metrics) if exam_metrics else None,
    )


@router.get("/study-time", response_model=list[StudyTimeResponse])
def get_study_time_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[StudyTimeResponse]:
    """Get study time breakdown by exam type."""
    results = db.query(
        StudySession.exam_type,
        func.sum(StudySession.duration_seconds).label("total_seconds"),
        func.count(StudySession.id).label("session_count"),
    ).filter(
        StudySession.user_id == current_user.id
    ).group_by(StudySession.exam_type).all()

    return [
        StudyTimeResponse(
            exam_type=r[0],
            total_hours=round(r[1] / 3600, 1),
            session_count=r[2],
        )
        for r in results
    ]


@router.get("/topic-performance", response_model=list[TopicPerformanceResponse])
def get_topic_performance(
    exam_type: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TopicPerformanceResponse]:
    """Get performance metrics by topic, optionally filtered to one exam."""
    query = db.query(UserProgress).filter(UserProgress.user_id == current_user.id)
    if exam_type is not None:
        normalized = normalize_exam_id(exam_type)
        if normalized is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")
        query = query.filter(UserProgress.exam_type == normalized)
    progress_records = query.all()

    return [
        TopicPerformanceResponse(
            topic=p.topic,
            exam_type=p.exam_type,
            mastery_score=round(p.mastery_score, 1),
            accuracy_rate=round(p.accuracy_rate, 1),
            average_time_per_question=round(p.avg_time_per_question, 1),
            predicted_score_low=p.predicted_score_low,
            predicted_score_high=p.predicted_score_high,
        )
        for p in progress_records
    ]


@router.get("/exam-history")
def get_exam_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10,
    exam_type: str | None = None,
):
    """Get recent exam attempts, optionally filtered to one exam."""
    query = db.query(ExamSession).filter(
        ExamSession.user_id == current_user.id,
        ExamSession.status == "submitted",
    )
    if exam_type is not None:
        normalized = normalize_exam_id(exam_type)
        if normalized is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")
        query = query.filter(ExamSession.exam_type == normalized)
    exams = query.order_by(ExamSession.submitted_at.desc()).limit(limit).all()

    return [
        {
            "id": e.id,
            "exam_type": e.exam_type,
            "raw_score": e.raw_score,
            "total_questions": e.total_questions,
            "accuracy_percentage": e.accuracy_percentage,
            "scaled_score_low": e.scaled_score_low,
            "scaled_score_high": e.scaled_score_high,
            "time_taken_minutes": e.time_taken_seconds // 60 if e.time_taken_seconds else None,
            "submitted_at": e.submitted_at.isoformat() if e.submitted_at else None,
        }
        for e in exams
    ]


def _compute_weekly_breakdown(db: Session, user_id: str, exam_type: str | None = None) -> list[dict]:
    """Compute daily study hours for the past 7 days, optionally scoped to one exam."""
    days_data = []
    for i in range(6, -1, -1):  # 6 days ago to today
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        query = db.query(func.sum(StudySession.duration_seconds)).filter(
            StudySession.user_id == user_id,
            StudySession.created_at >= day_start,
            StudySession.created_at < day_end,
        )
        if exam_type is not None:
            query = query.filter(StudySession.exam_type == exam_type)
        study_time = query.scalar() or 0

        days_data.append({
            "date": day.strftime("%Y-%m-%d"),
            "study_hours": round(study_time / 3600, 1),
        })

    return days_data


@router.get("/weekly-stats", response_model=WeeklyStatsResponse)
def get_weekly_stats(
    exam_type: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get weekly study statistics (last 7 days, by day). Returns separate global/exam sections when exam_type is provided."""
    from app.schemas.schemas import DayStudyStats, WeeklyStatsResponse
    
    normalized_exam_type = None
    if exam_type is not None:
        normalized_exam_type = normalize_exam_id(exam_type)
        if normalized_exam_type is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")

    global_daily = _compute_weekly_breakdown(db, current_user.id, exam_type=None)
    exam_daily = _compute_weekly_breakdown(db, current_user.id, exam_type=normalized_exam_type) if normalized_exam_type else None

    return WeeklyStatsResponse(
        global_daily=[DayStudyStats(**d) for d in global_daily],
        exam_daily=[DayStudyStats(**d) for d in exam_daily] if exam_daily else None,
    )


@router.get("/streak")
def get_study_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current study streak (consecutive days with >0 study time)."""
    streak = 0
    current_day = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    for i in range(365):  # Check up to 365 days back
        day_start = current_day - timedelta(days=i)
        day_end = day_start + timedelta(days=1)

        study_time = db.query(func.sum(StudySession.duration_seconds)).filter(
            StudySession.user_id == current_user.id,
            StudySession.created_at >= day_start,
            StudySession.created_at < day_end,
        ).scalar() or 0

        if study_time > 0:
            streak += 1
        else:
            break

    return {"current_streak": streak, "streak_unit": "days"}
