"""Study plan generation endpoints."""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import StudyPlan, User, UserProgress
from app.schemas.schemas import StudyPlanGenerateRequest, StudyPlanOut, StudyPlanTaskProgress
from app.services.study_plan import generate_study_plan

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/study-plan", tags=["study-plan"])


@router.post("/generate", response_model=StudyPlanOut, status_code=status.HTTP_201_CREATED)
def create_study_plan(
    payload: StudyPlanGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudyPlan:
    progress_rows = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    avg_mastery = (
        sum(p.mastery_score for p in progress_rows) / len(progress_rows) if progress_rows else 0.0
    )

    try:
        plan_json = generate_study_plan(
            exam_date=payload.exam_date,
            current_skill_level=avg_mastery,
            target_score=payload.target_score,
            weak_topics=payload.weak_topics,
            weekly_hours=payload.available_weekly_hours,
        )
    except ValueError as exc:
        logger.error("Study plan generation failed validation: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Study plan generation failed: {exc}"
        ) from exc
    except Exception as exc:
        logger.error("Study plan generation error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail="Study plan generation service unavailable"
        ) from exc

    study_plan = StudyPlan(
        user_id=current_user.id,
        exam_date=payload.exam_date,
        target_score=payload.target_score,
        weekly_hours=payload.available_weekly_hours,
        plan_json=plan_json,
    )
    db.add(study_plan)
    db.commit()
    db.refresh(study_plan)
    return study_plan


@router.get("/active", response_model=StudyPlanOut)
def get_active_study_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudyPlan:
    plan = (
        db.query(StudyPlan)
        .filter(StudyPlan.user_id == current_user.id, StudyPlan.is_active.is_(True))
        .order_by(StudyPlan.created_at.desc())
        .first()
    )
    if plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No saved study plan found")
    return plan


def _get_owned_plan(plan_id: str, db: Session, current_user: User) -> StudyPlan:
    plan = db.get(StudyPlan, plan_id)
    if plan is None or plan.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study plan not found")
    return plan


@router.post("/{plan_id}/activate", response_model=StudyPlanOut)
def activate_study_plan(
    plan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudyPlan:
    plan = _get_owned_plan(plan_id, db, current_user)

    db.query(StudyPlan).filter(
        StudyPlan.user_id == current_user.id, StudyPlan.id != plan_id
    ).update({StudyPlan.is_active: False})
    plan.is_active = True
    db.commit()
    db.refresh(plan)
    return plan


@router.patch("/{plan_id}/progress", response_model=StudyPlanOut)
def update_study_plan_progress(
    plan_id: str,
    payload: StudyPlanTaskProgress,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudyPlan:
    plan = _get_owned_plan(plan_id, db, current_user)

    completed_tasks = dict(plan.completed_tasks or {})
    if payload.completed:
        completed_tasks[payload.task_key] = True
    else:
        completed_tasks.pop(payload.task_key, None)
    plan.completed_tasks = completed_tasks
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/{user_id}", response_model=list[StudyPlanOut])
def get_study_plans(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[StudyPlan]:
    if user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another user's study plans")

    return (
        db.query(StudyPlan)
        .filter(StudyPlan.user_id == user_id)
        .order_by(StudyPlan.created_at.desc())
        .all()
    )
