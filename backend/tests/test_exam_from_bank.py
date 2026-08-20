"""Mock tests must assemble from the seeded bank with no model calls and no latency."""
import time

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.models import Base, GeneratedQuestion, User, UserAttempt
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


def test_concurrent_workers_do_not_double_seed(db, monkeypatch):
    """Several web workers boot at once; only one may insert.

    Regression: on the first production deploy all 4 workers seeded simultaneously
    because each saw an empty table, inserting the bank four times over.
    """
    sample = [
        {
            "exam_type": "SAT",
            "topic": "Algebra",
            "difficulty": 3,
            "question_text": f"Question {i}",
            "options": {"A": "1", "B": "2", "C": "3", "D": "4"},
            "correct_answer": "A",
            "explanation": "A sufficiently long explanation for validation.",
            "source_id": f"q-{i}",
        }
        for i in range(10)
    ]
    monkeypatch.setattr(question_bank, "load_bank", lambda: sample)

    lock_held = {"value": False}

    def try_lock(_db):
        if lock_held["value"]:
            return False
        lock_held["value"] = True
        return True

    monkeypatch.setattr(question_bank, "_try_acquire_seed_lock", try_lock)
    monkeypatch.setattr(question_bank, "_release_seed_lock", lambda _db: None)

    results = [question_bank.seed_question_bank(db) for _ in range(4)]

    assert sum(r["inserted"] for r in results) == 10
    assert question_bank.bank_question_count(db, "SAT") == 10


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


def test_every_exam_has_practice_questions_ready():
    """Every non-essay curriculum topic must be servable without calling a model."""
    by_exam: dict[str, set[str]] = {}
    for item in question_bank.load_bank():
        by_exam.setdefault(item["exam_type"], set()).add(item["topic"])

    assert set(by_exam) == {"SAT", "ACT", "GRE", "GMAT", "SHSAT", "Regents"}
    for exam, topics in by_exam.items():
        assert len(topics) >= 6, f"{exam} only has {len(topics)} topics in the bank"


def _seed_practice(db, topic="Algebra", n=10, difficulty=3):
    for i in range(n):
        db.add(
            GeneratedQuestion(
                exam_type="SAT",
                topic=topic,
                difficulty=difficulty,
                question_format="multiple_choice",
                question_text=f"{topic} practice {i}",
                options={"A": "1", "B": "2", "C": "3", "D": "4"},
                correct_answer="A",
                explanation="A sufficiently long explanation for validation.",
                validated=True,
            )
        )
    db.commit()


def test_practice_is_served_from_the_bank(db):
    _seed_practice(db)
    picked = question_bank.select_practice_questions(
        db, exam_type="SAT", topic="Algebra", difficulty=3, count=5
    )
    assert len(picked) == 5
    assert len({q.id for q in picked}) == 5


def test_practice_skips_questions_the_student_already_answered(db):
    _seed_practice(db, n=4)
    user = User(email="s@example.com", hashed_password="x")
    db.add(user)
    db.commit()

    first = question_bank.select_practice_questions(
        db, exam_type="SAT", topic="Algebra", difficulty=3, count=2, user_id=user.id
    )
    for q in first:
        db.add(
            UserAttempt(
                user_id=user.id,
                generated_question_id=q.id,
                submitted_answer="A",
                is_correct=True,
                time_taken_seconds=5.0,
                difficulty=3,
                topic="Algebra",
            )
        )
    db.commit()

    second = question_bank.select_practice_questions(
        db, exam_type="SAT", topic="Algebra", difficulty=3, count=4, user_id=user.id
    )
    assert {q.id for q in first}.isdisjoint({q.id for q in second})


def test_practice_falls_back_to_generation_once_topic_is_exhausted(db):
    _seed_practice(db, n=2)
    user = User(email="done@example.com", hashed_password="x")
    db.add(user)
    db.commit()

    everything = question_bank.select_practice_questions(
        db, exam_type="SAT", topic="Algebra", difficulty=3, count=10, user_id=user.id
    )
    for q in everything:
        db.add(
            UserAttempt(
                user_id=user.id,
                generated_question_id=q.id,
                submitted_answer="A",
                is_correct=True,
                time_taken_seconds=5.0,
                difficulty=3,
                topic="Algebra",
            )
        )
    db.commit()

    # Empty result signals the endpoint to generate genuinely new questions.
    assert (
        question_bank.select_practice_questions(
            db, exam_type="SAT", topic="Algebra", difficulty=3, count=5, user_id=user.id
        )
        == []
    )


def test_practice_uses_nearest_difficulty_when_exact_level_is_absent(db):
    """The bank only spans 2-4, so a level 5 request must still return something."""
    _seed_practice(db, n=3, difficulty=4)
    _seed_practice(db, topic="Algebra", n=3, difficulty=2)

    picked = question_bank.select_practice_questions(
        db, exam_type="SAT", topic="Algebra", difficulty=5, count=3
    )
    assert len(picked) == 3
    assert all(q.difficulty == 4 for q in picked), [q.difficulty for q in picked]
