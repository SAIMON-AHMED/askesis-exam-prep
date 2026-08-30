"""Admin panel endpoints for user management and content management."""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.models import User, ExamSession, AnalyticsEvent, Subscription
from app.schemas.schemas import UserOut
from app.core.error_handlers import AuthorizationException

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Restrict access to users on the admin allowlist."""
    admin_emails = {"admin@askesis.com", "contact@askesisprep.com"}  # Configurable list
    if current_user.email not in admin_emails:
        raise AuthorizationException("Admin access required")
    return current_user


@router.get("/users", response_model=list[UserOut])
def list_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
    limit: int = 100,
    offset: int = 0,
):
    """List all users (admin only)."""
    users = db.query(User).offset(offset).limit(limit).all()
    return users


@router.get("/users/stats")
def get_users_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get user statistics."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active).scalar() or 0
    
    # Users active in last 7 days
    seven_days_ago = datetime.utcnow() - __import__('datetime').timedelta(days=7)
    active_last_7_days = db.query(func.count(AnalyticsEvent.user_id)).filter(
        AnalyticsEvent.created_at >= seven_days_ago
    ).distinct().scalar() or 0

    # Average study hours
    avg_study_hours = db.query(func.avg(User.total_study_hours)).scalar() or 0

    return {
        "total_users": total_users,
        "active_users": active_users,
        "active_last_7_days": active_last_7_days,
        "average_study_hours": round(avg_study_hours, 1),
    }


@router.get("/users/{user_id}")
def get_user_details(
    user_id: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get detailed user information."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user stats
    exams_completed = db.query(func.count(ExamSession.id)).filter(
        ExamSession.user_id == user_id,
        ExamSession.status == "submitted",
    ).scalar() or 0

    avg_score = db.query(func.avg(ExamSession.raw_score)).filter(
        ExamSession.user_id == user_id,
        ExamSession.status == "submitted",
    ).scalar() or 0

    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).order_by(Subscription.created_at.desc()).first()

    return {
        "user": UserOut.from_orm(user),
        "stats": {
            "exams_completed": exams_completed,
            "average_score": round(avg_score, 1) if avg_score else 0,
            "total_study_hours": user.total_study_hours,
        },
        "subscription": {
            "plan": subscription.plan_name if subscription else "free",
            "status": subscription.status.value if subscription else "none",
        },
    }


@router.post("/users/{user_id}/deactivate")
def deactivate_user(
    user_id: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Deactivate a user (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    db.add(user)
    db.commit()

    return {"message": f"User {user_id} deactivated"}


@router.post("/users/{user_id}/reactivate")
def reactivate_user(
    user_id: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Reactivate a user (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = True
    db.add(user)
    db.commit()

    return {"message": f"User {user_id} reactivated"}


# Content Management System endpoints

@router.get("/content/stats")
def get_content_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get content statistics."""
    from app.models.models import GeneratedQuestion, Question, Topic, ExamType

    total_topics = db.query(func.count(Topic.id)).scalar() or 0
    total_exams = db.query(func.count(ExamType.id)).scalar() or 0
    total_questions = db.query(func.count(Question.id)).scalar() or 0
    total_generated_questions = db.query(func.count(GeneratedQuestion.id)).scalar() or 0
    validated_generated = db.query(func.count(GeneratedQuestion.id)).filter(
        GeneratedQuestion.validated
    ).scalar() or 0

    return {
        "exams": total_exams,
        "topics": total_topics,
        "curated_questions": total_questions,
        "generated_questions": total_generated_questions,
        "validated_generated": validated_generated,
        "validation_rate": (
            round(validated_generated / total_generated_questions * 100, 1)
            if total_generated_questions > 0
            else 0
        ),
    }


@router.get("/content/questions/review")
def get_questions_for_review(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
    limit: int = 20,
):
    """Get unvalidated generated questions for review."""
    from app.models.models import GeneratedQuestion

    questions = db.query(GeneratedQuestion).filter(
        GeneratedQuestion.validated == False
    ).order_by(GeneratedQuestion.created_at.desc()).limit(limit).all()

    return [
        {
            "id": q.id,
            "exam_type": q.exam_type,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "question_text": q.question_text,
            "options": q.options,
            "created_at": q.created_at.isoformat(),
        }
        for q in questions
    ]


@router.post("/content/questions/{question_id}/validate")
def validate_question(
    question_id: str,
    approved: bool,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Approve or reject a generated question."""
    from app.models.models import GeneratedQuestion

    question = db.query(GeneratedQuestion).filter(
        GeneratedQuestion.id == question_id
    ).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    if approved:
        question.validated = True
        db.add(question)
        db.commit()
        return {"message": "Question approved"}
    else:
        db.delete(question)
        db.commit()
        return {"message": "Question rejected and removed"}


@router.get("/analytics/overview")
def get_analytics_overview(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get platform-wide analytics."""
    from app.models.models import AnalyticsEvent, StudySession

    total_events = db.query(func.count(AnalyticsEvent.id)).scalar() or 0
    total_study_hours = db.query(func.sum(StudySession.duration_seconds)).scalar() or 0
    total_study_hours = total_study_hours / 3600 if total_study_hours else 0

    # Event breakdown
    event_counts = db.query(
        AnalyticsEvent.event_type,
        func.count(AnalyticsEvent.id).label("count"),
    ).group_by(AnalyticsEvent.event_type).all()

    return {
        "total_events": total_events,
        "total_study_hours": round(total_study_hours, 1),
        "event_breakdown": [
            {"event_type": e[0], "count": e[1]} for e in event_counts
        ],
    }


@router.get("/analytics/daily-active-users")
def get_daily_active_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
    days: int = 7,
):
    """Get daily active users for the last N days."""
    from app.models.models import AnalyticsEvent
    from datetime import timedelta

    data = []
    for i in range(days, 0, -1):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        active_users = db.query(func.count(AnalyticsEvent.user_id)).filter(
            AnalyticsEvent.created_at >= day_start,
            AnalyticsEvent.created_at < day_end,
        ).distinct().scalar() or 0

        data.append({
            "date": day.strftime("%Y-%m-%d"),
            "active_users": active_users,
        })

    return data


@router.post("/system/cache/clear")
def clear_cache(
    admin: User = Depends(require_admin),
):
    """Clear application cache (admin only)."""
    from app.core.cache import get_cache

    cache = get_cache()
    if cache.enabled:
        cache.client.flushdb()
        return {"message": "Cache cleared"}
    return {"message": "Cache not available"}


@router.post("/system/maintenance-mode")
def toggle_maintenance_mode(
    enabled: bool,
    admin: User = Depends(require_admin),
):
    """Toggle maintenance mode (admin only)."""
    # Store in cache or environment variable
    from app.core.cache import get_cache

    cache = get_cache()
    if cache.enabled:
        cache.set("maintenance_mode", enabled, ttl=86400)
        return {"message": f"Maintenance mode {'enabled' if enabled else 'disabled'}"}
    return {"message": "Could not set maintenance mode"}
