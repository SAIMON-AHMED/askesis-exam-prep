"""add study plan tracking (is_active, completed_tasks)

Revision ID: a1b2c3d4e5f6
Revises: 0dc1c0d8fc4b
Create Date: 2026-08-03 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '0dc1c0d8fc4b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'study_plans',
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column(
        'study_plans',
        sa.Column('completed_tasks', sa.JSON(), nullable=False, server_default='{}'),
    )


def downgrade() -> None:
    op.drop_column('study_plans', 'completed_tasks')
    op.drop_column('study_plans', 'is_active')
