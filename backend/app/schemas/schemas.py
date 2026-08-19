"""Pydantic schemas for request/response validation."""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.models import QuestionFormat


# ---------- Auth ----------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Question generation ----------
class QuestionGenerateRequest(BaseModel):
    exam_type: str
    topic: str
    difficulty: int = Field(ge=1, le=5)
    question_format: QuestionFormat
    number_of_questions: int = Field(ge=1, le=20, default=1)


class GeneratedQuestionOut(BaseModel):
    id: str
    exam_type: str
    topic: str
    difficulty: int
    question_format: QuestionFormat
    question_text: str
    options: dict | None = None
    correct_answer: str
    explanation: str
    validated: bool
    visual_aid: dict | None = None

    class Config:
        from_attributes = True


# ---------- Practice ----------
class PracticeSubmitRequest(BaseModel):
    generated_question_id: str | None = None
    question_id: str | None = None
    submitted_answer: str
    time_taken_seconds: float
    difficulty: int
    topic: str


class PracticeSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    next_recommended_difficulty: int


class UserAttemptOut(BaseModel):
    id: str
    submitted_answer: str
    is_correct: bool
    time_taken_seconds: float
    difficulty: int
    topic: str
    question_text: str | None = None
    correct_answer: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class PracticeQuotaOut(BaseModel):
    is_premium: bool
    questions_today: int
    daily_limit: int | None = None
    remaining: int | None = None


# ---------- Progress ----------
class UserProgressOut(BaseModel):
    topic: str
    mastery_score: float
    current_difficulty: int
    accuracy_rate: float
    avg_time_per_question: float
    predicted_score_low: int | None = None
    predicted_score_high: int | None = None

    class Config:
        from_attributes = True


# ---------- Study plan ----------
class StudyPlanGenerateRequest(BaseModel):
    exam_date: datetime | None = None
    target_score: int | None = None
    weak_topics: list[str] = []
    available_weekly_hours: float = 5.0


class StudyPlanOut(BaseModel):
    id: str
    exam_date: datetime | None = None
    target_score: int | None = None
    weekly_hours: float | None = None
    plan_json: dict
    is_active: bool = False
    completed_tasks: dict = {}
    created_at: datetime

    class Config:
        from_attributes = True


class StudyPlanTaskProgress(BaseModel):
    task_key: str
    completed: bool


# ---------- Subscription ----------
class SubscriptionCreateRequest(BaseModel):
    plan_name: str


class SubscriptionOut(BaseModel):
    id: str
    plan_name: str
    status: str

    class Config:
        from_attributes = True


class SubscriptionPlanOut(BaseModel):
    plan_id: str
    name: str
    price: float
    currency: str
    questions_per_day: int
    exams_per_month: int
    features: list[str]


# ---------- Exam purchases ----------
class ExamPurchaseRequest(BaseModel):
    exam_id: str


class ExamPurchaseOut(BaseModel):
    id: str
    exam_id: str
    price_paid: float
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True


class ExamCatalogItem(BaseModel):
    exam_id: str
    name: str
    price: float
    currency: str


class MyExamAccessOut(BaseModel):
    purchased_exam_ids: list[str]
    has_all_access: bool


# ---------- Timed exam ----------
class ExamStartRequest(BaseModel):
    exam_type: str = "SAT"
    topics: list[str] = Field(default_factory=list)  # empty = mixed default topics
    number_of_questions: int = Field(ge=5, le=60, default=20)
    duration_minutes: int = Field(ge=5, le=240, default=35)


class ExamQuestionOut(BaseModel):
    id: str
    question_text: str
    options: dict | None = None
    topic: str
    difficulty: int
    visual_aid: dict | None = None


class ExamSessionOut(BaseModel):
    id: str
    exam_type: str
    duration_seconds: int
    status: str
    total_questions: int
    started_at: datetime
    questions: list[ExamQuestionOut]


class ExamSubmitRequest(BaseModel):
    answers: dict[str, str]  # question_id -> submitted answer


class TopicBreakdown(BaseModel):
    topic: str
    correct: int
    total: int


class ExamResultOut(BaseModel):
    id: str
    raw_score: int
    total_questions: int
    scaled_score_low: int | None = None
    scaled_score_high: int | None = None
    topic_breakdown: list[TopicBreakdown]
    status: str
    submitted_at: datetime | None = None


class ExamSessionSummaryOut(BaseModel):
    id: str
    exam_type: str
    status: str
    raw_score: int | None = None
    total_questions: int
    started_at: datetime
    submitted_at: datetime | None = None

    class Config:
        from_attributes = True


# ---------- Analytics ----------
class AnalyticsOverviewResponse(BaseModel):
    total_study_hours: float
    exams_completed: int
    average_score: float
    last_7_days_study_hours: float


class StudyTimeResponse(BaseModel):
    exam_type: str
    total_hours: float
    session_count: int


class TopicPerformanceResponse(BaseModel):
    topic: str
    mastery_score: float
    accuracy_rate: float
    average_time_per_question: float
    predicted_score_low: int | None = None
    predicted_score_high: int | None = None


# ---------- Profile ----------
class UserProfileUpdate(BaseModel):
    full_name: str | None = None


class UserProfileOut(BaseModel):
    id: str
    email: str
    full_name: str | None = None
    is_active: bool
    total_study_hours: float
    exams_completed: int
    created_at: datetime

    class Config:
        from_attributes = True


class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str = Field(min_length=8)
