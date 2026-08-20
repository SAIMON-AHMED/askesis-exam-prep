"""Mock tests must assemble from the seeded bank with no model calls and no latency."""
import time

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.models import Base, GeneratedQuestion, User
from app.services import exam as exam_service
from app.services import question_bank


@pytest.fixture()
def db():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    try:
        yield session
    finally:
        session.close()


TOPICS = ["Vocabulary", "Algebra", "Geometry"]


def _seed(db, per_topic=20):
    for topic in TOPICS:
        for i in range(per_topic):
            db.add(
                GeneratedQuestion(
                    exam_type="SAT",
                    topic=topic,
                    difficulty=3,
                    question_format="multiple_choice",
                    question_text=f"{topic} question {i}",
                    options={"A": "1", "B": "2", "C": "3", "D": "4"},
                    correct_answer="A",
                    explanation="A sufficiently long explanation for validation.",
                    validated=True,
                    generation_metadata={"source": "bank"},
                )
            )
    db.commit()


def test_exam_is_built_without_calling_the_model(db, monkeypatch):
    _seed(db)

    def explode(*args, **kwargs):
        raise AssertionError("mock test must not call the question generator")

    monkeypatch.setattr(exam_service, "generate_questions", explode)

    started = time.perf_counter()
    questions = exam_service.build_exam_questions(db, "SAT", TOPICS, 25)
    elapsed = time.perf_counter() - started

    assert len(questions) == 25
    # A plain database read; anything near model latency means the bank was bypassed.
    assert elapsed < 0.5, f"took {elapsed:.2f}s"


def test_questions_are_spread_across_topics(db):
    _seed(db)
    questions = exam_service.build_exam_questions(db, "SAT", TOPICS, 24)

    per_topic: dict[str, int] = {}
    for q in questions:
        per_topic[q.topic] = per_topic.get(q.topic, 0) + 1

    assert set(per_topic) == set(TOPICS)
    assert all(count == 8 for count in per_topic.values()), per_topic


def test_no_duplicate_questions_in_one_exam(db):
    _seed(db)
    questions = exam_service.build_exam_questions(db, "SAT", TOPICS, 30)
    assert len({q.id for q in questions}) == len(questions)


def test_requesting_more_than_available_returns_what_exists(db):
    _seed(db, per_topic=3)
    questions = exam_service.build_exam_questions(db, "SAT", TOPICS, 60)
    assert len(questions) == 9


def test_falls_back_to_generation_only_when_bank_is_empty(db, monkeypatch):
    calls: list[str] = []

    def fake_generate(**kwargs):
        calls.append(kwargs["topic"])
        return [
            {
                "question_text": f"generated {kwargs['topic']}",
                "options": {"A": "1", "B": "2", "C": "3", "D": "4"},
                "correct_answer": "A",
                "explanation": "A sufficiently long explanation for validation.",
                "visual_aid": None,
            }
        ]

    monkeypatch.setattr(exam_service, "generate_questions", fake_generate)
    questions = exam_service.build_exam_questions(db, "SAT", TOPICS, 3)

    assert calls, "empty bank should fall back to generation"
    assert len(questions) == len(TOPICS)


def test_seeding_is_idempotent(db, monkeypatch):
    sample = [
        {
            "exam_type": "SAT",
            "topic": "Algebra",
            "difficulty": 3,
            "question_text": "Solve for x: 2x = 8",
            "options": {"A": "4", "B": "2", "C": "8", "D": "16"},
            "correct_answer": "A",
            "explanation": "Divide both sides by two to get x = 4.",
            "source_id": "algebra-test-1",
        }
    ]
    monkeypatch.setattr(question_bank, "load_bank", lambda: sample)

    first = question_bank.seed_question_bank(db)
    second = question_bank.seed_question_bank(db)

    assert first["inserted"] == 1
    assert second["inserted"] == 0
    assert question_bank.bank_question_count(db, "SAT") == 1


def test_exported_bank_file_is_valid():
    """The shipped JSON must be loadable and internally consistent."""
    items = question_bank.load_bank()
    assert len(items) > 2000, f"expected the full bank, got {len(items)}"

    for item in items:
        assert item["options"], item["source_id"]
        assert item["correct_answer"] in item["options"], item["source_id"]
        assert item["question_text"].strip()
        assert item["explanation"].strip()
        assert 1 <= item["difficulty"] <= 5
