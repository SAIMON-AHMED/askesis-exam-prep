"""Production reliability and health check endpoints."""
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.models import User

router = APIRouter(prefix="/health", tags=["health"])
logger = logging.getLogger(__name__)


class HealthStatus:
    """Application health status tracker."""

    OK = "ok"
    DEGRADED = "degraded"
    ERROR = "error"


@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)) -> dict:
    """Readiness probe: all critical systems operational."""
    checks = {}

    # Database connectivity
    try:
        db.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        checks["database"] = "error"

    # Overall status
    overall = HealthStatus.OK if all(v == "ok" for v in checks.values()) else HealthStatus.ERROR

    return {
        "status": overall,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "checks": checks,
    }


@router.get("/live")
def liveness_check() -> dict:
    """Liveness probe: application is running."""
    return {
        "status": HealthStatus.OK,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/status")
def get_status(
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Get detailed application status (requires auth)."""
    status_info = {
        "application": "ExamPrepAI",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": "production",
    }

    if current_user and current_user.is_active:
        status_info["authenticated_user"] = current_user.id

    # Database pool status
    try:
        pool = db.get_bind().pool
        status_info["database_pool"] = {
            "size": pool.size(),
            "checked_out": pool.checkedout(),
        }
    except Exception as e:
        logger.error(f"Failed to get database pool status: {e}")
        status_info["database_pool"] = {"error": str(e)}

    return status_info
