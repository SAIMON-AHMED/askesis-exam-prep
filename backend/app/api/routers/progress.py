"""User progress endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import User, UserProgress
from app.schemas.schemas import UserProgressOut

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/{user_id}", response_model=list[UserProgressOut])
def get_progress(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserProgress]:
    if user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access another user's progress")

    return db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
