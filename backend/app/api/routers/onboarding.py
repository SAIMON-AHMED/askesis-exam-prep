"""Persisted student onboarding goal endpoints."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import AnalyticsEvent, User
from app.schemas.schemas import OnboardingOut, OnboardingUpdate

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.get("", response_model=OnboardingOut)
def get_onboarding(current_user: User = Depends(get_current_user)) -> OnboardingOut:
    return OnboardingOut(
        primary_exam_id=current_user.primary_exam_id,
        exam_date=current_user.exam_date,
        target_score=current_user.target_score,
        weekly_study_hours=current_user.weekly_study_hours,
        weak_topics=current_user.weak_topics or [],
        completed=current_user.onboarding_completed_at is not None,
    )


@router.put("", response_model=OnboardingOut)
def update_onboarding(
    payload: OnboardingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingOut:
    current_user.primary_exam_id = payload.primary_exam_id
    current_user.exam_date = payload.exam_date
    current_user.target_score = payload.target_score
    current_user.weekly_study_hours = payload.weekly_study_hours
    current_user.weak_topics = payload.weak_topics
    current_user.onboarding_completed_at = datetime.now(timezone.utc)
    db.add(current_user)

    # Track onboarding completion for conversion funnel analytics
    conversion_event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="onboarding_completed",
        event_data={
            "exam_id": payload.primary_exam_id,
            "target_score": payload.target_score,
            "weekly_study_hours": payload.weekly_study_hours,
            "weak_topics": payload.weak_topics or [],
        },
    )
    db.add(conversion_event)
    db.commit()
    db.refresh(current_user)
    return get_onboarding(current_user)
