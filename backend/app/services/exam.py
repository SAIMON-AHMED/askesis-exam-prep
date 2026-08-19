"""Timed exam session service: builds an exam from generated questions and scores submissions."""
from typing import Any

from sqlalchemy.orm import Session

from app.models.models import GeneratedQuestion, QuestionFormat, UserAttempt
from app.services.question_generation import generate_questions

DEFAULT_SAT_MATH_TOPICS = ["Algebra", "Geometry", "Data Analysis", "Advanced Math"]
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

# Simple raw-score -> scaled-score band lookup for SAT Math (out of 800), approximate.
def _estimate_scaled_score(raw_score: int, total_questions: int) -> tuple[int, int]:
    if total_questions == 0:
        return (200, 200)
    pct = raw_score / total_questions
    center = int(200 + pct * 600)  # 200-800 range
    low = max(200, center - 40)
    high = min(800, center + 40)
    return (low, high)


def build_exam_questions(
    db: Session, exam_type: str, topics: list[str], number_of_questions: int, user_id: str | None = None
) -> list[GeneratedQuestion]:
    """Generates and persists a fresh set of questions spread across topics/difficulties for an exam."""
    topic_list = topics or DEFAULT_SAT_MATH_TOPICS
    questions: list[GeneratedQuestion] = []

    per_topic = max(1, number_of_questions // len(topic_list))
    remaining = number_of_questions

    for i, topic in enumerate(topic_list):
        count = per_topic if i < len(topic_list) - 1 else remaining
        count = min(count, remaining)
        if count <= 0:
            break
        difficulty = 2 + (i % 3)  # spread difficulty 2-4 across topics
        avoid_questions = (
            _recent_seen_question_texts(db, user_id, exam_type, topic) if user_id else None
        )
        try:
            raw_items = generate_questions(
                exam_type=exam_type,
                topic=topic,
                difficulty=difficulty,
                question_format=QuestionFormat.multiple_choice.value,
                number_of_questions=count,
                avoid_questions=avoid_questions,
            )
        except ValueError:
            continue

        for item in raw_items:
            q = GeneratedQuestion(
                exam_type=exam_type,
                topic=topic,
                difficulty=difficulty,
                question_format=QuestionFormat.multiple_choice,
                question_text=item["question_text"],
                options=item.get("options"),
                correct_answer=item["correct_answer"],
                explanation=item["explanation"],
                validated=True,
                visual_aid=item.get("visual_aid"),
            )
            db.add(q)
            questions.append(q)
        remaining -= len(raw_items)

    db.flush()
    for q in questions:
        db.refresh(q)
    return questions


def score_exam(
    questions: list[GeneratedQuestion], answers: dict[str, str]
) -> dict[str, Any]:
    raw_score = 0
    topic_stats: dict[str, dict[str, int]] = {}

    for q in questions:
        stats = topic_stats.setdefault(q.topic, {"correct": 0, "total": 0})
        stats["total"] += 1
        submitted = (answers.get(q.id) or "").strip().lower()
        if submitted == q.correct_answer.strip().lower():
            raw_score += 1
            stats["correct"] += 1

    total = len(questions)
    scaled_low, scaled_high = _estimate_scaled_score(raw_score, total)
    topic_breakdown = [
        {"topic": topic, "correct": s["correct"], "total": s["total"]} for topic, s in topic_stats.items()
    ]

    return {
        "raw_score": raw_score,
        "total_questions": total,
        "scaled_score_low": scaled_low,
        "scaled_score_high": scaled_high,
        "topic_breakdown": topic_breakdown,
    }
