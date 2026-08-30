"""add optional structured explanation fields

Revision ID: d5e6f7a8b9c0
Revises: c4d5e6f7a8b9
Create Date: 2026-08-24
"""
from alembic import op
import sqlalchemy as sa

revision = "d5e6f7a8b9c0"
down_revision = "c4d5e6f7a8b9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("generated_questions", sa.Column("explanation_concept", sa.String(length=255), nullable=True))
    op.add_column("generated_questions", sa.Column("explanation_steps", sa.JSON(), nullable=True))
    op.add_column("generated_questions", sa.Column("distractor_explanations", sa.JSON(), nullable=True))
    op.add_column("generated_questions", sa.Column("common_mistake", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("generated_questions", "common_mistake")
    op.drop_column("generated_questions", "distractor_explanations")
    op.drop_column("generated_questions", "explanation_steps")
    op.drop_column("generated_questions", "explanation_concept")