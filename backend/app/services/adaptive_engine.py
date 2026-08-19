"""Adaptive learning engine: computes next difficulty/topic recommendations
from recent user performance, per the accuracy/time/mastery rules.
"""
from dataclasses import dataclass

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
    topic_mastery_score: float  # 0-100
    current_difficulty: int


@dataclass
class AdaptiveRecommendation:
    next_difficulty: int
    prioritize_speed_practice: bool
    assign_more_weak_topic_questions: bool
    number_of_questions: int


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
