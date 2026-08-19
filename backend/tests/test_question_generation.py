"""Unit tests for question generation validation logic."""
import pytest

from app.services.question_generation import _validate_question


def test_valid_multiple_choice_question_passes():
    item = {
        "question_text": "What is 2 + 2?",
        "options": {"A": "3", "B": "4", "C": "5", "D": "6"},
        "correct_answer": "B",
        "explanation": "Adding 2 and 2 gives 4, which corresponds to option B.",
    }
    _validate_question(item, "multiple_choice")  # should not raise


def test_missing_field_raises():
    item = {"question_text": "What is 2 + 2?", "correct_answer": "4"}
    with pytest.raises(ValueError):
        _validate_question(item, "numeric")


def test_multiple_choice_missing_options_raises():
    item = {
        "question_text": "What is 2 + 2?",
        "correct_answer": "4",
        "explanation": "Because 2 plus 2 equals four in basic arithmetic.",
    }
    with pytest.raises(ValueError):
        _validate_question(item, "multiple_choice")


def test_numeric_with_options_raises():
    item = {
        "question_text": "What is 2 + 2?",
        "options": {"A": "3", "B": "4"},
        "correct_answer": "4",
        "explanation": "Because 2 plus 2 equals four in basic arithmetic.",
    }
    with pytest.raises(ValueError):
        _validate_question(item, "numeric")


def test_short_explanation_raises():
    item = {"question_text": "What is 2 + 2?", "correct_answer": "4", "explanation": "Because."}
    with pytest.raises(ValueError):
        _validate_question(item, "numeric")
