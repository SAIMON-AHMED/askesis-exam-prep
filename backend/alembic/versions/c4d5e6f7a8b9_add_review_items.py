"""add spaced repetition review items

Revision ID: c4d5e6f7a8b9
Revises: b3c4d5e6f7a8
Create Date: 2026-08-24
"""
from alembic import op
import sqlalchemy as sa

revision = "c4d5e6f7a8b9"
down_revision = "b3c4d5e6f7a8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "review_items",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("question_key", sa.String(length=255), nullable=False),
        sa.Column("exam_type", sa.String(length=50), nullable=False),
        sa.Column("topic", sa.String(length=255), nullable=False),
        sa.Column("due_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("interval_days", sa.Float(), nullable=False, server_default="0"),
        sa.Column("ease_factor", sa.Float(), nullable=False, server_default="2.5"),
        sa.Column("repetitions", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("lapses", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_is_correct", sa.Boolean(), nullable=True),
        sa.Column("last_reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_review_items_user_due", "review_items", ["user_id", "due_at"])
    op.create_index("idx_review_items_user_question", "review_items", ["user_id", "question_key"], unique=True)


def downgrade() -> None:
    op.drop_index("idx_review_items_user_question", table_name="review_items")
    op.drop_index("idx_review_items_user_due", table_name="review_items")
    op.drop_table("review_items")