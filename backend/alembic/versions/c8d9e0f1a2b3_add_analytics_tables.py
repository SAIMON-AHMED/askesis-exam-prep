"""Add analytics tables for exam sessions tracking.

Revision ID: c8d9e0f1a2b3
Revises: b2c3d4e5f6a7
Create Date: 2026-08-06 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'c8d9e0f1a2b3'
down_revision = 'b2c3d4e5f6a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to users table for tracking
    op.add_column('users', sa.Column('total_study_hours', sa.Float(), server_default='0', nullable=False))
    op.add_column('users', sa.Column('exams_completed', sa.Integer(), server_default='0', nullable=False))
    
    # Add new columns to exam_sessions for analytics
    op.add_column('exam_sessions', sa.Column('time_taken_seconds', sa.Integer(), nullable=True))
    op.add_column('exam_sessions', sa.Column('accuracy_percentage', sa.Float(), nullable=True))
    op.add_column('exam_sessions', sa.Column('percentile_rank', sa.Integer(), nullable=True))
    
    # Create analytics_events table for tracking user actions
    op.create_table(
        'analytics_events',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('event_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.Index('idx_analytics_events_user_id', 'user_id'),
        sa.Index('idx_analytics_events_created_at', 'created_at')
    )
    
    # Create study_session table to track time spent
    op.create_table(
        'study_sessions',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('topic', sa.String(255), nullable=False),
        sa.Column('exam_type', sa.String(50), nullable=False),
        sa.Column('duration_seconds', sa.Integer(), nullable=False),
        sa.Column('questions_attempted', sa.Integer(), nullable=False),
        sa.Column('questions_correct', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.Index('idx_study_sessions_user_id', 'user_id'),
        sa.Index('idx_study_sessions_created_at', 'created_at')
    )


def downgrade() -> None:
    op.drop_table('study_sessions')
    op.drop_table('analytics_events')
    op.drop_column('exam_sessions', 'percentile_rank')
    op.drop_column('exam_sessions', 'accuracy_percentage')
    op.drop_column('exam_sessions', 'time_taken_seconds')
    op.drop_column('users', 'exams_completed')
    op.drop_column('users', 'total_study_hours')
