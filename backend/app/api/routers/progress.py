"""User progress endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.exam_config import normalize_exam_id
from app.db.session import get_db
from app.models.models import User, UserProgress
from app.schemas.schemas import UserProgressOut

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/{user_id}", response_model=list[UserProgressOut])
def get_progress(
    user_id: str,
    exam_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserProgress]:
    if user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another user's progress")

    query = db.query(UserProgress).filter(UserProgress.user_id == user_id)
    if exam_type is not None:
        normalized = normalize_exam_id(exam_type)
        if normalized is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unknown exam_type")
        query = query.filter(UserProgress.exam_type == normalized)
    return query.all()
