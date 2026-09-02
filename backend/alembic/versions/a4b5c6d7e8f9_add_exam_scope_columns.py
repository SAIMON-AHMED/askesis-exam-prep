"""Add exam-scope columns (Phase 1 step 3): exam_type on user_progress/user_attempts,
exam_id on study_plans, exam_subject on exam_sessions. All nullable — see
app/services/exam_backfill.py for the follow-up backfill policy before any NOT NULL
constraint is considered.

Revision ID: a4b5c6d7e8f9
Revises: e6f7a8b9c0d1
"""
from alembic import op
import sqlalchemy as sa

revision = "a4b5c6d7e8f9"
down_revision = "e6f7a8b9c0d1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("user_progress", sa.Column("exam_type", sa.String(50), nullable=True))
    op.create_index("ix_user_progress_exam_type", "user_progress", ["exam_type"], if_not_exists=True)

    op.add_column("user_attempts", sa.Column("exam_type", sa.String(50), nullable=True))
    op.create_index("ix_user_attempts_exam_type", "user_attempts", ["exam_type"], if_not_exists=True)

    op.add_column("study_plans", sa.Column("exam_id", sa.String(50), nullable=True))
    op.create_index("ix_study_plans_exam_id", "study_plans", ["exam_id"], if_not_exists=True)

    op.add_column("exam_sessions", sa.Column("exam_subject", sa.String(50), nullable=True))


def downgrade() -> None:
    op.drop_column("exam_sessions", "exam_subject")
    op.drop_index("ix_study_plans_exam_id", table_name="study_plans")
    op.drop_column("study_plans", "exam_id")
    op.drop_index("ix_user_attempts_exam_type", table_name="user_attempts")
    op.drop_column("user_attempts", "exam_type")
    op.drop_index("ix_user_progress_exam_type", table_name="user_progress")
    op.drop_column("user_progress", "exam_type")
