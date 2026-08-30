"""add onboarding goal and exam session type

Revision ID: b3c4d5e6f7a8
Revises: a2b3c4d5e6f7
Create Date: 2026-08-24
"""
from alembic import op
import sqlalchemy as sa

revision = "b3c4d5e6f7a8"
down_revision = "a2b3c4d5e6f7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("primary_exam_id", sa.String(length=50), nullable=True))
    op.add_column("users", sa.Column("exam_date", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("target_score", sa.Integer(), nullable=True))
    op.add_column("users", sa.Column("weekly_study_hours", sa.Float(), nullable=True))
    op.add_column("users", sa.Column("weak_topics", sa.JSON(), nullable=True))
    op.add_column("users", sa.Column("onboarding_completed_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column(
        "exam_sessions",
        sa.Column("session_type", sa.String(length=30), nullable=False, server_default="mock"),
    )


def downgrade() -> None:
    op.drop_column("exam_sessions", "session_type")
    op.drop_column("users", "onboarding_completed_at")
    op.drop_column("users", "weak_topics")
    op.drop_column("users", "weekly_study_hours")
    op.drop_column("users", "target_score")
    op.drop_column("users", "exam_date")
    op.drop_column("users", "primary_exam_id")