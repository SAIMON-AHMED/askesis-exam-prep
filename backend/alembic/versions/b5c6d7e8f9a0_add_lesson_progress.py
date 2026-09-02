"""add lesson_progress table (Learn 2.0 pilot)

Revision ID: b5c6d7e8f9a0
Revises: a4b5c6d7e8f9
Create Date: 2026-09-02
"""
from alembic import op
import sqlalchemy as sa

revision = "b5c6d7e8f9a0"
down_revision = "a4b5c6d7e8f9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "lesson_progress",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("lesson_id", sa.String(length=100), nullable=False),
        sa.Column("topic", sa.String(length=255), nullable=False),
        sa.Column("exam_type", sa.String(length=50), nullable=False),
        sa.Column(
            "status",
            sa.Enum("not_started", "in_progress", "completed", "tested_out", name="lessonstatus"),
            nullable=False,
            server_default="not_started",
        ),
        sa.Column("current_step", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("micro_quiz_results", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("mastery_evidence_score", sa.Float(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "idx_lesson_progress_user_lesson", "lesson_progress", ["user_id", "lesson_id"], unique=True
    )


def downgrade() -> None:
    op.drop_index("idx_lesson_progress_user_lesson", table_name="lesson_progress")
    op.drop_table("lesson_progress")
    sa.Enum(name="lessonstatus").drop(op.get_bind(), checkfirst=True)
