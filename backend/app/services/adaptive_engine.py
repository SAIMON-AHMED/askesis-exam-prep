"""Adaptive learning engine: computes next difficulty/topic recommendations
from recent user performance, per the accuracy/time/mastery rules.
"""
from dataclasses import dataclass
from typing import Iterable

TIME_THRESHOLD_SECONDS = 90.0
LOW_ACCURACY = 0.5
HIGH_ACCURACY = 0.8
LOW_MASTERY = 40.0
MIN_DIFFICULTY = 1
MAX_DIFFICULTY = 5


@dataclass
class AdaptiveInput:
    accuracy_rate: float  # 0.0-1.0, over last 20 questions
    avg_time_per_question: float  # seconds
    topic_mastery_score: float  # 0-100; scoped per exam when derived from UserProgress (Phase 1 step 8)
    current_difficulty: int


@dataclass
class AdaptiveRecommendation:
    next_difficulty: int
    prioritize_speed_practice: bool
    assign_more_weak_topic_questions: bool
    number_of_questions: int


def _mean_accuracy(items: Iterable[dict]) -> float:
    rows = list(items)
    if not rows:
        return 0.0
    return sum(1 for row in rows if row.get("is_correct")) / len(rows)


def choose_next_topic(weak_topics: list[str], topic_attempts: dict[str, list[dict]]) -> str:
    """Prioritize the topic with the poorest recent accuracy, falling back to a weak-topic hint."""
    if weak_topics:
        priority = [topic for topic in weak_topics if topic in topic_attempts]
        if priority:
            ordered = sorted(
                priority,
                key=lambda topic: (_mean_accuracy(topic_attempts.get(topic, [])), topic),
            )
            return ordered[0]

    if not topic_attempts:
        return weak_topics[0] if weak_topics else ""

    ranked = sorted(
        topic_attempts.items(),
        key=lambda item: (_mean_accuracy(item[1]), len(item[1])),
    )
    return ranked[0][0]


def compute_recommendation(data: AdaptiveInput) -> AdaptiveRecommendation:
    difficulty = data.current_difficulty

    if data.accuracy_rate < LOW_ACCURACY:
        difficulty -= 1
    elif data.accuracy_rate <= HIGH_ACCURACY:
        pass  # maintain difficulty
    else:
        difficulty += 1

    difficulty = max(MIN_DIFFICULTY, min(MAX_DIFFICULTY, difficulty))

    prioritize_speed = data.avg_time_per_question > TIME_THRESHOLD_SECONDS
    assign_more_weak = data.topic_mastery_score < LOW_MASTERY

    number_of_questions = 15 if assign_more_weak else 10

    return AdaptiveRecommendation(
        next_difficulty=difficulty,
        prioritize_speed_practice=prioritize_speed,
        assign_more_weak_topic_questions=assign_more_weak,
        number_of_questions=number_of_questions,
    )
