"""Proves the fallback exam generator runs concurrently rather than one topic at a time.

The OpenAI call is replaced with a fixed-delay stub, so wall-clock time distinguishes
the two designs: sequential would cost len(topics) * DELAY, parallel costs about DELAY.
Mock tests normally read from the seeded bank instead (see test_exam_from_bank.py); this
covers the path used when the bank is empty.
"""
import time
from unittest.mock import patch

import pytest

from app.services import exam as exam_service

DELAY = 0.4
TOPICS = ["Algebra", "Geometry", "Data Analysis", "Advanced Math", "Trigonometry"]


def _slow_generate(**kwargs):
    """Stand-in for the LLM call: sleeps, then returns one valid question."""
    time.sleep(DELAY)
    return [
        {
            "question_text": f"Sample question for {kwargs['topic']}",
            "options": {"A": "1", "B": "2", "C": "3", "D": "4"},
            "correct_answer": "A",
            "explanation": "A long enough explanation to satisfy validation rules.",
            "visual_aid": None,
        }
    ]


class _FakeSession:
    """Minimal SQLAlchemy Session stand-in; generation only adds/flushes/refreshes."""

    def add(self, _obj):
        pass

    def flush(self):
        pass

    def refresh(self, _obj):
        pass


def test_exam_questions_are_generated_concurrently():
    with patch.object(exam_service, "generate_questions", side_effect=_slow_generate):
        started = time.perf_counter()
        questions = exam_service._generate_exam_questions(
            _FakeSession(), "SAT", TOPICS, number_of_questions=len(TOPICS)
        )
        elapsed = time.perf_counter() - started

    assert len(questions) == len(TOPICS)

    sequential_cost = DELAY * len(TOPICS)
    # Concurrency should keep this near a single call's cost, far below the sequential total.
    assert elapsed < sequential_cost / 2, (
        f"expected concurrent generation (~{DELAY:.1f}s), "
        f"took {elapsed:.2f}s vs sequential {sequential_cost:.1f}s"
    )


def test_worker_pool_bounds_concurrency():
    """More topics than workers must still finish in ceil(topics/workers) waves, not serially."""
    topics = [f"Topic {i}" for i in range(exam_service.MAX_WORKERS * 2)]

    with patch.object(exam_service, "generate_questions", side_effect=_slow_generate):
        started = time.perf_counter()
        exam_service._generate_exam_questions(
            _FakeSession(), "SAT", topics, number_of_questions=len(topics)
        )
        elapsed = time.perf_counter() - started

    sequential_cost = DELAY * len(topics)
    assert elapsed < sequential_cost / 2
