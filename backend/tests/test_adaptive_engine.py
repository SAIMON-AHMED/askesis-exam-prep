"""Unit tests for the adaptive learning engine."""
from app.services.adaptive_engine import AdaptiveInput, choose_next_topic, compute_recommendation


def test_low_accuracy_decreases_difficulty():
    result = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.3, avg_time_per_question=60, topic_mastery_score=50, current_difficulty=3)
    )
    assert result.next_difficulty == 2


def test_mid_accuracy_maintains_difficulty():
    result = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.65, avg_time_per_question=60, topic_mastery_score=50, current_difficulty=3)
    )
    assert result.next_difficulty == 3


def test_high_accuracy_increases_difficulty():
    result = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.9, avg_time_per_question=60, topic_mastery_score=50, current_difficulty=3)
    )
    assert result.next_difficulty == 4


def test_difficulty_clamped_to_bounds():
    low = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.1, avg_time_per_question=60, topic_mastery_score=50, current_difficulty=1)
    )
    assert low.next_difficulty == 1

    high = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.95, avg_time_per_question=60, topic_mastery_score=50, current_difficulty=5)
    )
    assert high.next_difficulty == 5


def test_slow_time_prioritizes_speed_practice():
    result = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.65, avg_time_per_question=120, topic_mastery_score=50, current_difficulty=3)
    )
    assert result.prioritize_speed_practice is True


def test_low_mastery_assigns_more_weak_topic_questions():
    result = compute_recommendation(
        AdaptiveInput(accuracy_rate=0.65, avg_time_per_question=60, topic_mastery_score=30, current_difficulty=3)
    )
    assert result.assign_more_weak_topic_questions is True
    assert result.number_of_questions == 15


def test_choose_next_topic_prioritizes_user_weak_topics():
    topic = choose_next_topic(
        ["algebra", "geometry"],
        {
            "algebra": [{"is_correct": True}, {"is_correct": False}],
            "geometry": [{"is_correct": True}, {"is_correct": True}],
        },
    )
    assert topic == "algebra"


def test_choose_next_topic_falls_back_to_lowest_accuracy_subject():
    topic = choose_next_topic(
        [],
        {
            "reading": [{"is_correct": True}, {"is_correct": True}],
            "algebra": [{"is_correct": False}, {"is_correct": False}, {"is_correct": True}],
        },
    )
    assert topic == "algebra"
