"""Timed exam session service: builds an exam from generated questions and scores submissions."""
import logging
from typing import Any
from concurrent.futures import ThreadPoolExecutor, as_completed

from sqlalchemy.orm import Session

from app.models.models import GeneratedQuestion, QuestionFormat, UserAttempt
from app.services.question_generation import generate_questions
from app.services.question_bank import select_exam_questions
from app.services.scoring_strategies import estimate_scaled_score

logger = logging.getLogger(__name__)

DEFAULT_SAT_MATH_TOPICS = ["Algebra", "Geometry", "Data Analysis", "Advanced Math"]
RECENT_QUESTIONS_TO_AVOID = 30
MAX_WORKERS = 5  # Parallel question generation limit


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


def build_exam_questions(
    db: Session, exam_type: str, topics: list[str], number_of_questions: int, user_id: str | None = None
) -> list[GeneratedQuestion]:
    """Assemble an exam from the pre-seeded question bank, with no model calls.

    Mock tests must start instantly, so this is a plain database read. Live generation is
    only used if the bank has nothing stored for this exam yet.
    """
    topic_list = topics or DEFAULT_SAT_MATH_TOPICS

    selected = select_exam_questions(db, exam_type, topic_list, number_of_questions, user_id)
    if selected:
        return selected

    logger.warning(
        "Question bank empty for %s; falling back to live generation. "
        "Run `python -m app.services.question_bank` to seed.",
        exam_type,
    )
    return _generate_exam_questions(db, exam_type, topic_list, number_of_questions, user_id)


def _generate_exam_questions(
    db: Session, exam_type: str, topics: list[str], number_of_questions: int, user_id: str | None = None
) -> list[GeneratedQuestion]:
    """Fallback path: generate questions with the model, in parallel across topics."""
    topic_list = topics
    questions: list[GeneratedQuestion] = []

    per_topic = max(1, number_of_questions // len(topic_list))
    remaining = number_of_questions

    # Build list of topic generation tasks
    tasks = []
    for i, topic in enumerate(topic_list):
        count = per_topic if i < len(topic_list) - 1 else remaining
        count = min(count, remaining)
        if count <= 0:
            break
        difficulty = 2 + (i % 3)  # spread difficulty 2-4 across topics
        avoid_questions = (
            _recent_seen_question_texts(db, user_id, exam_type, topic) if user_id else None
        )
        tasks.append((exam_type, topic, difficulty, count, avoid_questions))
        remaining -= count

    # Generate questions in parallel
    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(
                generate_questions,
                exam_type=task[0],
                topic=task[1],
                difficulty=task[2],
                question_format=QuestionFormat.multiple_choice.value,
                number_of_questions=task[3],
                avoid_questions=task[4],
            ): task[1]  # task[1] is topic name
            for task in tasks
        }

        for future in as_completed(futures):
            topic_name = futures[future]
            try:
                raw_items = future.result()
                results.append((topic_name, raw_items))
            except ValueError:
                # Topic failed to generate questions, skip it
                continue

    # Persist results to database
    for topic_name, raw_items in results:
        for item in raw_items:
            # Find the difficulty level for this topic
            topic_idx = next((i for i, t in enumerate(topic_list) if t == topic_name), 0)
            difficulty = 2 + (topic_idx % 3)

            q = GeneratedQuestion(
                exam_type=exam_type,
                topic=topic_name,
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

    db.flush()
    for q in questions:
        db.refresh(q)
    return questions


def score_exam(
    questions: list[GeneratedQuestion], answers: dict[str, str], exam_type: str = "sat", subject_id: str | None = None
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
    estimate = estimate_scaled_score(exam_type, raw_score, total, subject_id=subject_id)
    topic_breakdown = [
        {"topic": topic, "correct": s["correct"], "total": s["total"]} for topic, s in topic_stats.items()
    ]

    return {
        "raw_score": raw_score,
        "total_questions": total,
        "scaled_score_low": estimate.scaled_score_low,
        "scaled_score_high": estimate.scaled_score_high,
        "score_label": estimate.label,
        "is_readiness_estimate": estimate.is_readiness_estimate,
        "topic_breakdown": topic_breakdown,
    }
