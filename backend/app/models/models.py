"""SQLAlchemy ORM models for all core tables."""
import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class QuestionFormat(str, enum.Enum):
    multiple_choice = "multiple_choice"
    numeric = "numeric"


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    canceled = "canceled"
    past_due = "past_due"
    trialing = "trialing"


class ExamSessionStatus(str, enum.Enum):
    in_progress = "in_progress"
    submitted = "submitted"
    expired = "expired"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    total_study_hours: Mapped[float] = mapped_column(Float, default=0.0)
    exams_completed: Mapped[int] = mapped_column(Integer, default=0)
    primary_exam_id: Mapped[str | None] = mapped_column(String(50), nullable=True)
    exam_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    target_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    weekly_study_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    daily_study_goal_hours: Mapped[float] = mapped_column(Float, default=2.0)
    daily_goal_reminder_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    daily_goal_reminder_time: Mapped[str] = mapped_column(String(5), default="20:00")
    weak_topics: Mapped[list | None] = mapped_column(JSON, nullable=True)
    onboarding_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    attempts: Mapped[list["UserAttempt"]] = relationship(back_populates="user")
    progress: Mapped[list["UserProgress"]] = relationship(back_populates="user")
    study_plans: Mapped[list["StudyPlan"]] = relationship(back_populates="user")
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="user")
    analytics_events: Mapped[list["AnalyticsEvent"]] = relationship(back_populates="user")
    study_sessions: Mapped[list["StudySession"]] = relationship(back_populates="user")


class ExamType(Base):
    __tablename__ = "exam_types"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)  # SAT, ACT, GRE...
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    topics: Mapped[list["Topic"]] = relationship(back_populates="exam_type")


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    exam_type_id: Mapped[str] = mapped_column(ForeignKey("exam_types.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)  # Algebra, Geometry...
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    exam_type: Mapped["ExamType"] = relationship(back_populates="topics")
    questions: Mapped[list["Question"]] = relationship(back_populates="topic")


class Question(Base):
    """Curated/static question bank (human-authored or vetted)."""

    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    topic_id: Mapped[str] = mapped_column(ForeignKey("topics.id"), nullable=False)
    exam_type_id: Mapped[str] = mapped_column(ForeignKey("exam_types.id"), nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    question_format: Mapped[QuestionFormat] = mapped_column(Enum(QuestionFormat), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    correct_answer: Mapped[str] = mapped_column(String(500), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    topic: Mapped["Topic"] = relationship(back_populates="questions")


class GeneratedQuestion(Base):
    """AI-generated questions produced by the question generation pipeline."""

    __tablename__ = "generated_questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    exam_type: Mapped[str] = mapped_column(String(50), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False)
    question_format: Mapped[QuestionFormat] = mapped_column(Enum(QuestionFormat), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    correct_answer: Mapped[str] = mapped_column(String(500), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    explanation_concept: Mapped[str | None] = mapped_column(String(255), nullable=True)
    explanation_steps: Mapped[list | None] = mapped_column(JSON, nullable=True)
    distractor_explanations: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    common_mistake: Mapped[str | None] = mapped_column(Text, nullable=True)
    validated: Mapped[bool] = mapped_column(Boolean, default=False)
    generation_metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    visual_aid: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    attempts: Mapped[list["UserAttempt"]] = relationship(back_populates="generated_question")


class UserAttempt(Base):
    __tablename__ = "user_attempts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    generated_question_id: Mapped[str | None] = mapped_column(
        ForeignKey("generated_questions.id"), nullable=True
    )
    question_id: Mapped[str | None] = mapped_column(ForeignKey("questions.id"), nullable=True)
    submitted_answer: Mapped[str] = mapped_column(String(500), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    time_taken_seconds: Mapped[float] = mapped_column(Float, nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    # Lowercase canonical exam id ("sat", "act", ...); nullable until backfilled, see exam_backfill.py.
    exam_type: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="attempts")
    generated_question: Mapped["GeneratedQuestion | None"] = relationship(back_populates="attempts")


class ReviewItem(Base):
    __tablename__ = "review_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    question_key: Mapped[str] = mapped_column(String(255), nullable=False)
    exam_type: Mapped[str] = mapped_column(String(50), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    interval_days: Mapped[float] = mapped_column(Float, default=0.0)
    ease_factor: Mapped[float] = mapped_column(Float, default=2.5)
    repetitions: Mapped[int] = mapped_column(Integer, default=0)
    lapses: Mapped[int] = mapped_column(Integer, default=0)
    last_is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    last_reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship()


class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    # Lowercase canonical exam id; nullable until backfilled (ambiguous rows are left
    # null for recomputation rather than guessed — see exam_backfill.py).
    exam_type: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    mastery_score: Mapped[float] = mapped_column(Float, default=0.0)  # 0-100
    current_difficulty: Mapped[int] = mapped_column(Integer, default=1)
    accuracy_rate: Mapped[float] = mapped_column(Float, default=0.0)
    avg_time_per_question: Mapped[float] = mapped_column(Float, default=0.0)
    predicted_score_low: Mapped[int | None] = mapped_column(Integer, nullable=True)
    predicted_score_high: Mapped[int | None] = mapped_column(Integer, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="progress")


class LessonStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"
    tested_out = "tested_out"


class LessonProgress(Base):
    """Learn 2.0: per-user progress through a hand-authored TopicLesson (frontend lessonsData.ts)."""

    __tablename__ = "lesson_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    lesson_id: Mapped[str] = mapped_column(String(100), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    exam_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[LessonStatus] = mapped_column(Enum(LessonStatus), default=LessonStatus.not_started)
    current_step: Mapped[int] = mapped_column(Integer, default=0)
    micro_quiz_results: Mapped[list] = mapped_column(JSON, default=list)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    mastery_evidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship()


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    # Lowercase canonical exam id; nullable until backfilled, see exam_backfill.py.
    exam_id: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    exam_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    target_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    weekly_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    plan_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_tasks: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="study_plans")


class ExamPurchase(Base):
    """One-time purchase granting a user access to a specific exam."""

    __tablename__ = "exam_purchases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    exam_id: Mapped[str] = mapped_column(String(50), nullable=False)  # sat, act, gre...
    price_paid: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="usd")
    payment_provider: Mapped[str] = mapped_column(String(50), nullable=False, default="manual")
    payment_reference: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship()


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    plan_name: Mapped[str] = mapped_column(String(100), nullable=False, default="free")
    status: Mapped[SubscriptionStatus] = mapped_column(
        Enum(SubscriptionStatus), default=SubscriptionStatus.active
    )
    trial_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="subscriptions")


class ExamSession(Base):
    """A full timed mock exam attempt: a fixed set of questions taken under a time limit."""

    __tablename__ = "exam_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    exam_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # Regents subject id (e.g. "algebra-i"); only meaningful when exam_type == "regents".
    exam_subject: Mapped[str | None] = mapped_column(String(50), nullable=True)
    session_type: Mapped[str] = mapped_column(String(30), nullable=False, default="mock")
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[ExamSessionStatus] = mapped_column(
        Enum(ExamSessionStatus), default=ExamSessionStatus.in_progress
    )
    # Ordered list of generated_question ids that make up this exam.
    question_ids: Mapped[list] = mapped_column(JSON, nullable=False)
    # Map of question_id -> submitted answer, filled in on submit.
    answers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    raw_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    scaled_score_low: Mapped[int | None] = mapped_column(Integer, nullable=True)
    scaled_score_high: Mapped[int | None] = mapped_column(Integer, nullable=True)
    topic_breakdown: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    time_taken_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    accuracy_percentage: Mapped[float | None] = mapped_column(Float, nullable=True)
    percentile_rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship()


class AnalyticsEvent(Base):
    """Track user interactions for analytics."""

    __tablename__ = "analytics_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)  # exam_started, exam_completed, topic_viewed
    event_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # additional context
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    user: Mapped["User"] = relationship(back_populates="analytics_events")


class StudySession(Base):
    """Track individual study sessions for time tracking."""

    __tablename__ = "study_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    exam_type: Mapped[str] = mapped_column(String(50), nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    questions_attempted: Mapped[int] = mapped_column(Integer, nullable=False)
    questions_correct: Mapped[int] = mapped_column(Integer, nullable=False)
    activity_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    user: Mapped["User"] = relationship(back_populates="study_sessions")

