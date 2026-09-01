"""Add persisted study-time goals and session details.

Revision ID: e6f7a8b9c0d1
Revises: d5e6f7a8b9c0
"""
from alembic import op
import sqlalchemy as sa

revision = "e6f7a8b9c0d1"
down_revision = "d5e6f7a8b9c0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("daily_study_goal_hours", sa.Float(), server_default="2.0", nullable=False))
    op.add_column("users", sa.Column("daily_goal_reminder_enabled", sa.Boolean(), server_default=sa.true(), nullable=False))
    op.add_column("users", sa.Column("daily_goal_reminder_time", sa.String(5), server_default="20:00", nullable=False))
    op.add_column("study_sessions", sa.Column("activity_type", sa.String(100), nullable=True))
    op.add_column("study_sessions", sa.Column("notes", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("study_sessions", "notes")
    op.drop_column("study_sessions", "activity_type")
    op.drop_column("users", "daily_goal_reminder_time")
    op.drop_column("users", "daily_goal_reminder_enabled")
    op.drop_column("users", "daily_study_goal_hours")
