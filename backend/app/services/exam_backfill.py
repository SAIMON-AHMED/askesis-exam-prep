"""Backfill policy for exam-scope columns added in migration a4b5c6d7e8f9 (Phase 1 step 3a).

Existing data predates the exam_type/exam_id columns, so it's already merged across
exams. This script infers exam scope where there's a reliable signal and deliberately
leaves ambiguous rows NULL for later recomputation rather than guessing:

- UserAttempt.exam_type: inferred by joining to GeneratedQuestion.exam_type (reliable —
  every attempt on a generated question knows which exam it was generated for).
- StudyPlan.exam_id: inferred from the owning user's primary_exam_id as a best-effort
  guess (StudyPlan has no other stored exam signal); left NULL if the user has none.
- UserProgress.exam_type: NOT guessed. Aggregate mastery rows have no per-row exam
  signal of their own, so assigning one would fabricate data. These rows are left NULL
  and should be recomputed from (now-backfilled) UserAttempt rows by topic+exam_type
  once that recomputation path exists (Phase 3+).

Run with: python -m app.services.exam_backfill
"""
import logging

from sqlalchemy import update
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.models import GeneratedQuestion, StudyPlan, User, UserAttempt

logger = logging.getLogger(__name__)


def backfill_user_attempts(db: Session) -> int:
    """Set UserAttempt.exam_type from the referenced GeneratedQuestion.exam_type."""
    rows = (
        db.query(UserAttempt.id, GeneratedQuestion.exam_type)
        .join(GeneratedQuestion, UserAttempt.generated_question_id == GeneratedQuestion.id)
        .filter(UserAttempt.exam_type.is_(None), GeneratedQuestion.exam_type.isnot(None))
        .all()
    )
    updated = 0
    for attempt_id, exam_type in rows:
        normalized = (exam_type or "").lower().strip()
        if not normalized:
            continue
        db.execute(update(UserAttempt).where(UserAttempt.id == attempt_id).values(exam_type=normalized))
        updated += 1
    return updated


def backfill_study_plans(db: Session) -> int:
    """Best-effort: assign a plan's exam_id from its owning user's primary_exam_id."""
    plans = (
        db.query(StudyPlan, User.primary_exam_id)
        .join(User, StudyPlan.user_id == User.id)
        .filter(StudyPlan.exam_id.is_(None), User.primary_exam_id.isnot(None))
        .all()
    )
    updated = 0
    for plan, primary_exam_id in plans:
        normalized = (primary_exam_id or "").lower().strip()
        if not normalized:
            continue
        plan.exam_id = normalized
        updated += 1
    return updated


def backfill_exam_scope(db: Session) -> dict[str, int]:
    """Run the full backfill policy. UserProgress is intentionally NOT backfilled."""
    attempts_updated = backfill_user_attempts(db)
    plans_updated = backfill_study_plans(db)
    db.commit()
    return {
        "user_attempts_backfilled": attempts_updated,
        "study_plans_backfilled": plans_updated,
        "user_progress_backfilled": 0,  # by design — see module docstring
    }


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    session = SessionLocal()
    try:
        stats = backfill_exam_scope(session)
        logger.info("Exam scope backfill complete: %s", stats)
    finally:
        session.close()
