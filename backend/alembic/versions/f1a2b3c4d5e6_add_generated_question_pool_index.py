"""add composite index for practice question pools

Revision ID: f1a2b3c4d5e6
Revises: e0f1a2b3c4d5
Create Date: 2026-08-24
"""
from alembic import op

revision = "f1a2b3c4d5e6"
down_revision = "e0f1a2b3c4d5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index(
        "idx_generated_questions_exam_topic",
        "generated_questions",
        ["exam_type", "topic"],
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index("idx_generated_questions_exam_topic", table_name="generated_questions")
