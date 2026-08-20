"""Question generation endpoints."""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import GeneratedQuestion, User, UserAttempt
from app.schemas.schemas import GeneratedQuestionOut, QuestionGenerateRequest
from app.services.question_generation import generate_questions
from app.services.question_bank import select_practice_questions
from app.services.subscription import (
    FREE_DAILY_PRACTICE_LIMIT,
    get_practice_quota,
    user_has_exam_access,
    get_current_subscription,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/questions", tags=["questions"])

RECENT_QUESTIONS_TO_AVOID = 30


def _recent_seen_question_texts(db: Session, user_id: str, exam_type: str, topic: str) -> list[str]:
    """Question texts the user has already been shown for this topic, most recent first."""
    rows = (
        db.query(GeneratedQuestion.question_text)
        .join(UserAttempt, UserAttempt.generated_question_id == GeneratedQuestion.id)
        .filter(
            UserAttempt.user_id == user_id,
            GeneratedQuestion.exam_type == exam_type,
            GeneratedQuestion.topic == topic,
        )
        .order_by(UserAttempt.created_at.desc())
        .limit(RECENT_QUESTIONS_TO_AVOID)
        .all()
    )
    return [row[0] for row in rows]


@router.post("/generate", response_model=list[GeneratedQuestionOut], status_code=status.HTTP_201_CREATED)
def generate(
    payload: QuestionGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[GeneratedQuestion]:
    quota = get_practice_quota(current_user.id, db)
    owns_exam = user_has_exam_access(current_user.id, payload.exam_type, db)
    if not quota["is_premium"] and not owns_exam and quota["remaining"] <= 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Daily free practice limit reached ({FREE_DAILY_PRACTICE_LIMIT} questions/day). "
                "Buy this exam or upgrade to a subscription for unlimited practice."
            ),
        )

    # Serve pre-seeded questions first; generation is only needed once these run out.
    from_bank = select_practice_questions(
        db,
        exam_type=payload.exam_type,
        topic=payload.topic,
        difficulty=payload.difficulty,
        count=payload.number_of_questions,
        user_id=current_user.id,
    )
    if from_bank:
        return from_bank

    try:
        avoid_questions = _recent_seen_question_texts(
            db, current_user.id, payload.exam_type, payload.topic
        )
        raw_questions = generate_questions(
            exam_type=payload.exam_type,
            topic=payload.topic,
            difficulty=payload.difficulty,
            question_format=payload.question_format.value,
            number_of_questions=payload.number_of_questions,
            avoid_questions=avoid_questions,
        )
    except ValueError as exc:
        logger.error("Question generation validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Question generation failed validation: {exc}",
        ) from exc
    except Exception as exc:  # LLM/API errors
        logger.error("Question generation error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail="Question generation service unavailable"
        ) from exc

    saved: list[GeneratedQuestion] = []
    for item in raw_questions:
        question = GeneratedQuestion(
            exam_type=payload.exam_type,
            topic=payload.topic,
            difficulty=payload.difficulty,
            question_format=payload.question_format,
            question_text=item["question_text"],
            options=item.get("options"),
            correct_answer=item["correct_answer"],
            explanation=item["explanation"],
            validated=True,
            visual_aid=item.get("visual_aid"),
        )
        db.add(question)
        saved.append(question)

    db.commit()
    for q in saved:
        db.refresh(q)
    return saved


@router.get("/{question_id}", response_model=GeneratedQuestionOut)
def get_question(
    question_id: str,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> GeneratedQuestion:
    question = db.get(GeneratedQuestion, question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return question


@router.post("/unlimited/next", response_model=GeneratedQuestionOut, status_code=status.HTTP_201_CREATED)
def get_unlimited_question(
    payload: QuestionGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GeneratedQuestion:
    """
    Generate unlimited AI questions for premium/pro users.
    Returns a single question with full explanation included.
    No daily limits for subscribed users or exam owners.
    """
    # Check if user has premium access
    subscription = get_current_subscription(current_user.id, db)
    owns_exam = user_has_exam_access(current_user.id, payload.exam_type, db)
    
    # Only allow pro/premium or exam owners
    if subscription.plan_name not in ["pro", "premium"] and not owns_exam:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unlimited questions require Pro/Premium subscription or exam purchase",
        )

    # Serve pre-seeded questions first; generation is only needed once these run out.
    from_bank = select_practice_questions(
        db,
        exam_type=payload.exam_type,
        topic=payload.topic,
        difficulty=payload.difficulty,
        count=1,
        user_id=current_user.id,
    )
    if from_bank:
        return from_bank[0]

    try:
        avoid_questions = _recent_seen_question_texts(
            db, current_user.id, payload.exam_type, payload.topic
        )
        raw_questions = generate_questions(
            exam_type=payload.exam_type,
            topic=payload.topic,
            difficulty=payload.difficulty,
            question_format=payload.question_format.value,
            number_of_questions=1,  # Generate one at a time for streaming
            avoid_questions=avoid_questions,
        )
    except Exception as exc:
        logger.error("Unlimited question generation error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Question generation service unavailable",
        ) from exc

    if not raw_questions:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate question",
        )

    item = raw_questions[0]
    question = GeneratedQuestion(
        exam_type=payload.exam_type,
        topic=payload.topic,
        difficulty=payload.difficulty,
        question_format=payload.question_format,
        question_text=item["question_text"],
        options=item.get("options"),
        correct_answer=item["correct_answer"],
        explanation=item["explanation"],
        validated=True,
        visual_aid=item.get("visual_aid"),
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question
