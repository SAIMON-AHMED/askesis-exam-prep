"""User profile and settings endpoints."""
from datetime import datetime
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.security import hash_password
from app.models.models import User
from app.schemas.schemas import UserProfileUpdate, UserProfileOut, PasswordChangeRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me", response_model=UserProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user),
) -> UserProfileOut:
    """Get current user profile."""
    try:
        return UserProfileOut(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            is_active=current_user.is_active,
            total_study_hours=current_user.total_study_hours,
            exams_completed=current_user.exams_completed,
            created_at=current_user.created_at,
        )
    except Exception as exc:
        logger.error("Error fetching profile: %s", exc)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load profile: {str(exc)}"
        ) from exc


@router.patch("/me", response_model=UserProfileOut)
def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileOut:
    """Update user profile."""
    try:
        if profile_data.full_name:
            current_user.full_name = profile_data.full_name

        db.add(current_user)
        db.commit()
        db.refresh(current_user)

        return UserProfileOut(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            is_active=current_user.is_active,
            total_study_hours=current_user.total_study_hours,
            exams_completed=current_user.exams_completed,
            created_at=current_user.created_at,
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile: {str(exc)}"
        ) from exc


@router.post("/change-password")
def change_password(
    request: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Change user password."""
    from app.core.security import verify_password

    # Verify old password
    if not verify_password(request.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid old password")

    # Update password
    current_user.hashed_password = hash_password(request.new_password)
    db.add(current_user)
    db.commit()

    return {"message": "Password changed successfully"}


@router.post("/deactivate")
def deactivate_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Deactivate user account."""
    current_user.is_active = False
    db.add(current_user)
    db.commit()

    return {"message": "Account deactivated"}


@router.post("/preferences")
def update_preferences(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Update user preferences (stored in a future preferences table)."""
    return {
        "message": "Preferences updated",
        "preferences": preferences,
    }


@router.get("/settings")
def get_settings(
    current_user: User = Depends(get_current_user),
) -> dict:
    """Get user settings and preferences."""
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "email_notifications": True,  # Can be extended with actual preference storage
        "difficulty_preference": "adaptive",
        "theme": "light",
        "language": "en",
    }
