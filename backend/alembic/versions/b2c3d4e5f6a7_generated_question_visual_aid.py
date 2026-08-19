"""add visual_aid column to generated_questions

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-08-03 23:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'generated_questions',
        sa.Column('visual_aid', sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column('generated_questions', 'visual_aid')
