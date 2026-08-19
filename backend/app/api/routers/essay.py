"""Essay evaluation endpoints with AI-service-based marking and generation."""
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.services.essay_service import generate_essay_questions, grade_essay

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/essay", tags=["essay"])


class EssayGenerationRequest(BaseModel):
    """Request model for essay question generation."""

    exam_type: str
    topic: str
    difficulty: int = 3
    number_of_questions: int = 1


class EssayGenerationResponse(BaseModel):
    """Response model for generated essay questions."""

    prompt: str
    expected_length: str
    rubric_criteria: list[str]
    model_answer: str
    time_limit_minutes: int


class EssayEvaluationRequest(BaseModel):
    """Request model for essay evaluation."""

    question: str
    essay_response: str
    rubric_criteria: list[str] = []
    model_answer: str = ""
    exam_type: str = "General"
    difficulty: str = "Medium"


class EssayFeedback:
    """Response model for essay feedback."""

    def __init__(self, score: int, strengths: list[str], weaknesses: list[str], suggestions: list[str]):
        self.score = score
        self.strengths = strengths
        self.weaknesses = weaknesses
        self.suggestions = suggestions


@router.post("/generate", response_model=list[EssayGenerationResponse])
async def generate_essay_questions_endpoint(request: EssayGenerationRequest) -> list[dict]:
    """
    Generate essay/written assessment questions using the AI service.

    Args:
        request: Essay generation request with exam_type, topic, difficulty, and number_of_questions

    Returns:
        List of generated essay questions with prompts, rubrics, and model answers
    """
    if not request.exam_type or not request.topic:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="exam_type and topic are required",
        )

    if request.difficulty < 1 or request.difficulty > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="difficulty must be between 1 and 5",
        )

    if request.number_of_questions < 1 or request.number_of_questions > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="number_of_questions must be between 1 and 5",
        )

    try:
        questions = generate_essay_questions(
            exam_type=request.exam_type,
            topic=request.topic,
            difficulty=request.difficulty,
            number_of_questions=request.number_of_questions,
        )
        return questions
    except ValueError as e:
        logger.error(f"Essay generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Essay generation failed: {str(e)}",
        )


@router.post("/evaluate")
async def evaluate_essay(request: EssayEvaluationRequest) -> dict:
    """
    Evaluate an essay response using AI-service-based marking.

    Args:
        request: Essay evaluation request with question, response, rubric, and model answer

    Returns:
        Feedback dictionary with score, strengths, weaknesses, and suggestions
    """
    if not request.essay_response or not request.essay_response.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Essay response cannot be empty",
        )

    if len(request.essay_response.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Essay response is too short (minimum 50 characters)",
        )

    try:
        # Use default rubric if not provided
        rubric = request.rubric_criteria or [
            "Thesis clarity and strength",
            "Evidence quality and relevance",
            "Organization and coherence",
            "Writing mechanics and style",
            "Analytical depth",
        ]

        feedback = grade_essay(
            prompt=request.question,
            rubric_criteria=rubric,
            model_answer=request.model_answer or "No reference provided",
            student_essay=request.essay_response,
            exam_type=request.exam_type,
        )

        return {
            "score": feedback.get("score_out_of_100", 0),
            "score_out_of_100": feedback.get("score_out_of_100", 0),
            "grade_letter": feedback.get("grade_letter", "F"),
            "strengths": feedback.get("strengths", []),
            "areas_for_improvement": feedback.get("areas_for_improvement", []),
            "rubric_scores": feedback.get("rubric_scores", {}),
            "feedback": feedback.get("feedback", ""),
            "detailed_feedback": feedback.get("feedback", ""),
        }
    except ValueError as e:
        logger.error(f"Essay evaluation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Essay evaluation failed: {str(e)}",
        )
