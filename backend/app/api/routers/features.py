"""Premium feature usage tracking for business analytics."""
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import AnalyticsEvent, User
from app.services.subscription import is_premium_user

router = APIRouter(prefix="/features", tags=["features"])
logger = logging.getLogger(__name__)


# Premium features that require subscription
PREMIUM_FEATURES = {
    "unlimited_practice": {
        "name": "Unlimited Daily Practice",
        "plan": "pro",
        "category": "practice",
        "value": "high",
    },
    "personalized_recommendations": {
        "name": "Personalized Study Recommendations",
        "plan": "pro",
        "category": "learning",
        "value": "high",
    },
    "analytics_dashboard": {
        "name": "Advanced Analytics Dashboard",
        "plan": "pro",
        "category": "insights",
        "value": "medium",
    },
    "tutoring_sessions": {
        "name": "1-on-1 Tutoring Sessions",
        "plan": "premium",
        "category": "support",
        "value": "very_high",
    },
    "custom_study_paths": {
        "name": "Custom Learning Paths",
        "plan": "premium",
        "category": "learning",
        "value": "high",
    },
    "offline_access": {
        "name": "Offline Question Access",
        "plan": "premium",
        "category": "convenience",
        "value": "medium",
    },
}


@router.post("/track")
def track_feature_usage(
    feature_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Track when a premium feature is used."""
    if feature_name not in PREMIUM_FEATURES:
        return {"status": "unknown_feature", "feature": feature_name}

    feature = PREMIUM_FEATURES[feature_name]
    is_premium = is_premium_user(current_user.id, db)

    # Log the feature usage
    event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="premium_feature_used",
        event_data={
            "feature": feature_name,
            "feature_plan": feature["plan"],
            "category": feature["category"],
            "value": feature["value"],
            "user_is_premium": is_premium,
        },
    )
    db.add(event)
    db.commit()

    return {
        "status": "tracked",
        "feature": feature_name,
        "user_is_premium": is_premium,
    }


@router.get("/list")
def list_premium_features() -> dict:
    """Get all available premium features and their tiers."""
    return {
        "features": PREMIUM_FEATURES,
        "total_features": len(PREMIUM_FEATURES),
        "categories": list(set(f["category"] for f in PREMIUM_FEATURES.values())),
    }
