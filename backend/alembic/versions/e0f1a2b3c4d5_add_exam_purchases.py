"""add exam purchases

Revision ID: e0f1a2b3c4d5
Revises: d9e0f1a2b3c4
Create Date: 2026-08-13
"""
from alembic import op
import sqlalchemy as sa

revision = 'e0f1a2b3c4d5'
down_revision = 'd9e0f1a2b3c4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'exam_purchases',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('exam_id', sa.String(length=50), nullable=False),
        sa.Column('price_paid', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=10), nullable=False),
        sa.Column('payment_provider', sa.String(length=50), nullable=False),
        sa.Column('payment_reference', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_exam_purchases_user_id'), 'exam_purchases', ['user_id'], unique=False)
    op.create_index('ix_exam_purchases_user_exam', 'exam_purchases', ['user_id', 'exam_id'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_exam_purchases_user_exam', table_name='exam_purchases')
    op.drop_index(op.f('ix_exam_purchases_user_id'), table_name='exam_purchases')
    op.drop_table('exam_purchases')
