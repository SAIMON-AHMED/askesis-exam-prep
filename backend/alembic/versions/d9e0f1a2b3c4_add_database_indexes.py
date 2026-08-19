"""Add database indexes for performance optimization.

Revision ID: d9e0f1a2b3c4
Revises: c8d9e0f1a2b3
Create Date: 2026-08-06 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd9e0f1a2b3c4'
down_revision = 'c8d9e0f1a2b3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # if_not_exists guards against indexes already present in older databases
    # User indexes
    op.create_index('idx_users_email', 'users', ['email'], if_not_exists=True)
    op.create_index('idx_users_created_at', 'users', ['created_at'], if_not_exists=True)
    
    # UserAttempt indexes
    op.create_index('idx_user_attempts_user_id', 'user_attempts', ['user_id'], if_not_exists=True)
    op.create_index('idx_user_attempts_created_at', 'user_attempts', ['created_at'], if_not_exists=True)
    op.create_index('idx_user_attempts_topic', 'user_attempts', ['topic'], if_not_exists=True)
    op.create_index('idx_user_attempts_user_created', 'user_attempts', ['user_id', 'created_at'], if_not_exists=True)
    
    # UserProgress indexes
    op.create_index('idx_user_progress_user_id', 'user_progress', ['user_id'], if_not_exists=True)
    op.create_index('idx_user_progress_topic', 'user_progress', ['topic'], if_not_exists=True)
    op.create_index('idx_user_progress_user_topic', 'user_progress', ['user_id', 'topic'], unique=True, if_not_exists=True)
    
    # StudyPlan indexes
    op.create_index('idx_study_plans_user_id', 'study_plans', ['user_id'], if_not_exists=True)
    op.create_index('idx_study_plans_is_active', 'study_plans', ['is_active'], if_not_exists=True)
    op.create_index('idx_study_plans_user_active', 'study_plans', ['user_id', 'is_active'], if_not_exists=True)
    
    # ExamSession indexes
    op.create_index('idx_exam_sessions_user_id', 'exam_sessions', ['user_id'], if_not_exists=True)
    op.create_index('idx_exam_sessions_status', 'exam_sessions', ['status'], if_not_exists=True)
    op.create_index('idx_exam_sessions_created_at', 'exam_sessions', ['started_at'], if_not_exists=True)
    op.create_index('idx_exam_sessions_user_status', 'exam_sessions', ['user_id', 'status'], if_not_exists=True)
    
    # Question indexes
    op.create_index('idx_questions_topic_id', 'questions', ['topic_id'], if_not_exists=True)
    op.create_index('idx_questions_exam_type_id', 'questions', ['exam_type_id'], if_not_exists=True)
    op.create_index('idx_questions_difficulty', 'questions', ['difficulty'], if_not_exists=True)
    op.create_index('idx_questions_exam_topic', 'questions', ['exam_type_id', 'topic_id'], if_not_exists=True)
    
    # Topic indexes
    op.create_index('idx_topics_exam_type_id', 'topics', ['exam_type_id'], if_not_exists=True)
    
    # GeneratedQuestion indexes
    op.create_index('idx_generated_questions_exam_type', 'generated_questions', ['exam_type'], if_not_exists=True)
    op.create_index('idx_generated_questions_topic', 'generated_questions', ['topic'], if_not_exists=True)
    op.create_index('idx_generated_questions_created_at', 'generated_questions', ['created_at'], if_not_exists=True)
    op.create_index('idx_generated_questions_validated', 'generated_questions', ['validated'], if_not_exists=True)
    
    # Subscription indexes
    op.create_index('idx_subscriptions_user_id', 'subscriptions', ['user_id'], if_not_exists=True)
    op.create_index('idx_subscriptions_status', 'subscriptions', ['status'], if_not_exists=True)
    op.create_index('idx_subscriptions_created_at', 'subscriptions', ['created_at'], if_not_exists=True)
    
    # StudySession indexes
    op.create_index('idx_study_sessions_user_id', 'study_sessions', ['user_id'], if_not_exists=True)
    op.create_index('idx_study_sessions_created_at', 'study_sessions', ['created_at'], if_not_exists=True)
    op.create_index('idx_study_sessions_exam_type', 'study_sessions', ['exam_type'], if_not_exists=True)
    op.create_index('idx_study_sessions_user_created', 'study_sessions', ['user_id', 'created_at'], if_not_exists=True)
    
    # AnalyticsEvent indexes
    op.create_index('idx_analytics_events_user_id', 'analytics_events', ['user_id'], if_not_exists=True)
    op.create_index('idx_analytics_events_created_at', 'analytics_events', ['created_at'], if_not_exists=True)
    op.create_index('idx_analytics_events_event_type', 'analytics_events', ['event_type'], if_not_exists=True)


def downgrade() -> None:
    # Drop all indexes in reverse order
    op.drop_index('idx_analytics_events_event_type')
    op.drop_index('idx_analytics_events_created_at')
    op.drop_index('idx_analytics_events_user_id')
    
    op.drop_index('idx_study_sessions_user_created')
    op.drop_index('idx_study_sessions_exam_type')
    op.drop_index('idx_study_sessions_created_at')
    op.drop_index('idx_study_sessions_user_id')
    
    op.drop_index('idx_subscriptions_created_at')
    op.drop_index('idx_subscriptions_status')
    op.drop_index('idx_subscriptions_user_id')
    
    op.drop_index('idx_generated_questions_validated')
    op.drop_index('idx_generated_questions_created_at')
    op.drop_index('idx_generated_questions_topic')
    op.drop_index('idx_generated_questions_exam_type')
    
    op.drop_index('idx_topics_exam_type_id')
    
    op.drop_index('idx_questions_exam_topic')
    op.drop_index('idx_questions_difficulty')
    op.drop_index('idx_questions_exam_type_id')
    op.drop_index('idx_questions_topic_id')
    
    op.drop_index('idx_exam_sessions_user_status')
    op.drop_index('idx_exam_sessions_created_at')
    op.drop_index('idx_exam_sessions_status')
    op.drop_index('idx_exam_sessions_user_id')
    
    op.drop_index('idx_study_plans_user_active')
    op.drop_index('idx_study_plans_is_active')
    op.drop_index('idx_study_plans_user_id')
    
    op.drop_index('idx_user_progress_user_topic')
    op.drop_index('idx_user_progress_topic')
    op.drop_index('idx_user_progress_user_id')
    
    op.drop_index('idx_user_attempts_user_created')
    op.drop_index('idx_user_attempts_topic')
    op.drop_index('idx_user_attempts_created_at')
    op.drop_index('idx_user_attempts_user_id')
    
    op.drop_index('idx_users_created_at')
    op.drop_index('idx_users_email')
