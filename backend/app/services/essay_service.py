"""AI-service-powered essay and written assessment service.

Handles generation of essay prompts and grading of student responses using the AI service API.
"""
import json
from typing import Any

from openai import OpenAI

from app.core.config import get_settings

settings = get_settings()


ESSAY_GENERATION_PROMPT_TEMPLATE = """You are an expert {exam_type} exam essay question writer.
Generate {n} essay/written assessment question(s) on the topic "{topic}" at difficulty level {difficulty} (1=easiest, 5=hardest).

Requirements:
- Match authentic {exam_type} exam style and format.
- Stay strictly within the boundaries of the "{topic}" topic.
- Provide clear, specific prompts that require analytical or argumentative writing.
- Include expected length (number of paragraphs or word count).
- Specify rubric criteria (what makes a strong answer).
- Provide a model answer outline.
{avoid_section}
Respond ONLY with valid JSON matching this schema (a JSON array of objects):
[
  {{
    "prompt": string,
    "expected_length": string,
    "rubric_criteria": [string, ...],
    "model_answer": string,
    "time_limit_minutes": integer
  }}
]
"""

ESSAY_GRADING_PROMPT_TEMPLATE = """You are an expert {exam_type} exam essay grader with experience evaluating written assessments.

Grade the following essay based on the provided rubric and model answer.

ESSAY PROMPT:
{prompt}

RUBRIC CRITERIA:
{rubric_criteria}

MODEL ANSWER (for reference):
{model_answer}

STUDENT ESSAY:
{student_essay}

Provide a detailed evaluation following this JSON schema:
{{
  "score_out_of_100": integer (0-100),
  "rubric_scores": {{
    "criterion_name": score (0-100),
    ...
  }},
  "strengths": [string, ...],
  "areas_for_improvement": [string, ...],
  "feedback": string,
  "grade_letter": string (A+, A, A-, B+, B, B-, C+, C, C-, D, F)
}}

Be rigorous but fair. Focus on:
1. Thesis clarity and strength
2. Evidence/reasoning quality
3. Organization and coherence
4. Writing mechanics and style
5. Overall persuasiveness or analytical depth
"""


def _call_ai_service(prompt: str) -> str:
    """Call the AI service API and return the response text."""
    if not settings.ai_service_api_key:
        raise ValueError("AI_SERVICE_API_KEY is not configured")

    client = OpenAI(api_key=settings.ai_service_api_key)
    response = client.chat.completions.create(
        model=settings.ai_service_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,  # Lower temperature for consistent grading
    )
    return response.choices[0].message.content or ""


def _validate_essay_question(item: dict[str, Any]) -> None:
    """Validate essay question structure."""
    required_fields = ["prompt", "expected_length", "rubric_criteria", "model_answer", "time_limit_minutes"]
    for field in required_fields:
        if not item.get(field):
            raise ValueError(f"Missing required field: {field}")

    if not isinstance(item.get("rubric_criteria"), list):
        raise ValueError("rubric_criteria must be a list")

    if not isinstance(item.get("time_limit_minutes"), int) or item["time_limit_minutes"] <= 0:
        raise ValueError("time_limit_minutes must be a positive integer")


def generate_essay_questions(
    exam_type: str,
    topic: str,
    difficulty: int,
    number_of_questions: int = 1,
    avoid_questions: list[str] | None = None,
) -> list[dict[str, Any]]:
    """Generate essay/written assessment questions using the AI service.

    Args:
        exam_type: Type of exam (e.g., 'SAT', 'ACT', 'GRE')
        topic: Topic for the essay question
        difficulty: Difficulty level (1-5, where 1=easiest, 5=hardest)
        number_of_questions: Number of essay questions to generate
        avoid_questions: List of previously generated prompts to avoid

    Returns:
        List of essay question dictionaries with prompt, rubric, model answer, etc.

    Raises:
        ValueError: If question generation fails or responses are invalid
    """
    avoid_section = ""
    if avoid_questions:
        bullet_list = "\n".join(f"- {text[:200]}" for text in avoid_questions[:10])
        avoid_section = (
            "\nThe student has already seen the following essay prompts. Do NOT repeat them or generate "
            "near-duplicates; write genuinely new prompts instead:\n"
            f"{bullet_list}\n"
        )

    prompt = ESSAY_GENERATION_PROMPT_TEMPLATE.format(
        exam_type=exam_type,
        topic=topic,
        difficulty=difficulty,
        n=number_of_questions,
        avoid_section=avoid_section,
    )

    raw_output = _call_ai_service(prompt)

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ValueError(f"AI service did not return valid JSON: {exc}") from exc

    if not isinstance(parsed, list):
        raise ValueError("Expected a JSON array of essay questions")

    validated_questions: list[dict[str, Any]] = []
    for item in parsed:
        _validate_essay_question(item)
        validated_questions.append(item)

    if not validated_questions:
        raise ValueError("No valid essay questions were generated")

    return validated_questions


def grade_essay(
    prompt: str,
    rubric_criteria: list[str],
    model_answer: str,
    student_essay: str,
    exam_type: str = "General",
) -> dict[str, Any]:
    """Grade a student essay using the AI service.

    Args:
        prompt: The original essay prompt
        rubric_criteria: List of grading criteria
        model_answer: Reference model answer or outline
        student_essay: The student's submitted essay
        exam_type: Type of exam (for context)

    Returns:
        Dictionary containing score, feedback, strengths, and areas for improvement

    Raises:
        ValueError: If grading fails or response is invalid
    """
    rubric_text = "\n".join(f"- {criterion}" for criterion in rubric_criteria)

    grading_prompt = ESSAY_GRADING_PROMPT_TEMPLATE.format(
        exam_type=exam_type,
        prompt=prompt,
        rubric_criteria=rubric_text,
        model_answer=model_answer,
        student_essay=student_essay,
    )

    raw_output = _call_ai_service(grading_prompt)

    try:
        grading_result = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ValueError(f"AI service did not return valid JSON for grading: {exc}") from exc

    # Validate required fields
    required_fields = ["score_out_of_100", "rubric_scores", "strengths", "areas_for_improvement", "feedback", "grade_letter"]
    for field in required_fields:
        if field not in grading_result:
            raise ValueError(f"Missing required field in grading result: {field}")

    # Ensure score is in valid range
    score = grading_result.get("score_out_of_100", 0)
    if not isinstance(score, (int, float)) or score < 0 or score > 100:
        grading_result["score_out_of_100"] = max(0, min(100, int(score or 0)))

    return grading_result


def batch_grade_essays(
    essays: list[dict[str, str]],
    prompt: str,
    rubric_criteria: list[str],
    model_answer: str,
    exam_type: str = "General",
) -> list[dict[str, Any]]:
    """Grade multiple essays (calls grade_essay for each).

    Args:
        essays: List of dicts with 'student_id' and 'essay_text' keys
        prompt: The essay prompt
        rubric_criteria: Grading rubric
        model_answer: Reference answer
        exam_type: Exam type for context

    Returns:
        List of grading results, each with student_id and grading data
    """
    results = []
    for essay_data in essays:
        student_id = essay_data.get("student_id", "unknown")
        essay_text = essay_data.get("essay_text", "")

        try:
            grading = grade_essay(
                prompt=prompt,
                rubric_criteria=rubric_criteria,
                model_answer=model_answer,
                student_essay=essay_text,
                exam_type=exam_type,
            )
            results.append({"student_id": student_id, "grading": grading, "status": "success"})
        except ValueError as e:
            results.append(
                {
                    "student_id": student_id,
                    "status": "error",
                    "error": str(e),
                }
            )

    return results
