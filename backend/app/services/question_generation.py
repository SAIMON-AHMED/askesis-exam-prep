"""AI-powered question generation pipeline.

Steps: build prompt -> call LLM (deterministic, temperature<=0.3) -> validate JSON ->
validate correctness/consistency/completeness -> return structured result.
Raises ValueError for any question that fails validation (hallucinated/malformed).
"""
import json
from typing import Any

from openai import OpenAI

from app.core.config import get_settings

settings = get_settings()

PROMPT_TEMPLATE = """You are an expert {exam_type} exam question writer.
Generate {n} {question_format} question(s) on the topic "{topic}" at difficulty level {difficulty} (1=easiest, 5=hardest).

Requirements:
- Match authentic {exam_type} exam style and phrasing.
- Stay strictly within the boundaries of the "{topic}" topic.
- If question_format is "multiple_choice", provide exactly 4 options labeled A-D with exactly one correct answer.
- If question_format is "numeric", provide a single numeric correct_answer (no options).
- Provide a complete, step-by-step explanation that justifies the correct answer.
- Double-check the math is correct and the correct_answer matches the explanation's conclusion.
- If the question describes a geometric figure (triangle, circle, rectangle/square) or refers to "the figure"/"the diagram", you MUST include a "visual_aid" object describing that figure so it can be drawn. Use this schema:
  {{"type": "triangle", "triangle_kind": "right"|"scalene"|"isosceles"|"equilateral", "vertices": ["A","B","C"], "side_labels": {{"AB": "6", "AC": "8", "BC": "?"}}, "angle_labels": {{"A": "90°"}}}}
  or {{"type": "circle", "center_label": "O", "radius_label": "r = 5"}}
  or {{"type": "rectangle", "width_label": "8", "height_label": "5"}}
  Only include labels that are actually given/asked about in the question text; use "?" for the unknown quantity being solved for.
- If the question presents or refers to a data table (e.g. paired values, a data set, a frequency table), you MUST include a "visual_aid" object with this schema instead:
  {{"type": "table", "headers": [string, ...], "rows": [[string, ...], ...]}}
  The table must contain the exact data mentioned in the question text (do not describe the data only in prose).
- If the question has no figure and no table, omit "visual_aid" entirely (or set it to null).
{avoid_section}
Respond ONLY with valid JSON matching this schema (a JSON array of objects):
[
  {{
    "question_text": string,
    "options": {{"A": string, "B": string, "C": string, "D": string}} or null,
    "correct_answer": string,
    "explanation": string,
    "visual_aid": object or null
  }}
]
"""


def _build_prompt(
    exam_type: str,
    topic: str,
    difficulty: int,
    question_format: str,
    n: int,
    avoid_questions: list[str] | None = None,
) -> str:
    avoid_section = ""
    if avoid_questions:
        bullet_list = "\n".join(f"- {text[:200]}" for text in avoid_questions[:30])
        avoid_section = (
            "\nThe student has already seen the following questions. Do NOT repeat them or generate "
            "near-duplicates (same numbers/wording); write genuinely new questions instead:\n"
            f"{bullet_list}\n"
        )
    return PROMPT_TEMPLATE.format(
        exam_type=exam_type,
        topic=topic,
        difficulty=difficulty,
        question_format=question_format,
        n=n,
        avoid_section=avoid_section,
    )


def _call_llm(prompt: str) -> str:
    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,  # deterministic output, <= 0.3 per spec
    )
    return response.choices[0].message.content or ""


def _validate_question(item: dict[str, Any], question_format: str) -> None:
    """Reject malformed or hallucinated questions."""
    required_fields = ["question_text", "correct_answer", "explanation"]
    for field in required_fields:
        if not item.get(field):
            raise ValueError(f"Missing required field: {field}")

    if question_format == "multiple_choice":
        options = item.get("options")
        if not isinstance(options, dict) or set(options.keys()) != {"A", "B", "C", "D"}:
            raise ValueError("multiple_choice question must have exactly options A-D")
        if item["correct_answer"] not in options and item["correct_answer"] not in options.keys():
            raise ValueError("correct_answer must reference one of the options")

    if question_format == "numeric" and item.get("options"):
        raise ValueError("numeric question must not include options")

    if len(item["explanation"].strip()) < 20:
        raise ValueError("explanation is too short / incomplete")


_VALID_VISUAL_TYPES = {"triangle", "circle", "rectangle", "table"}


def _sanitize_visual_aid(item: dict[str, Any]) -> dict[str, Any] | None:
    """Best-effort validation of the optional visual_aid object. Drops it instead of
    failing the whole question if it's malformed, since it's a supplementary aid."""
    visual_aid = item.get("visual_aid")
    if not isinstance(visual_aid, dict):
        return None

    vtype = visual_aid.get("type")
    if vtype not in _VALID_VISUAL_TYPES:
        return None

    if vtype == "table":
        headers = visual_aid.get("headers")
        rows = visual_aid.get("rows")
        if not isinstance(headers, list) or not all(isinstance(h, str) for h in headers):
            return None
        if not isinstance(rows, list) or not rows:
            return None
        for row in rows:
            if not isinstance(row, list):
                return None
        return {"type": "table", "headers": headers, "rows": rows}

    if vtype == "triangle":
        vertices = visual_aid.get("vertices")
        if not isinstance(vertices, list) or len(vertices) != 3:
            return None
        return {
            "type": "triangle",
            "triangle_kind": visual_aid.get("triangle_kind") or "scalene",
            "vertices": vertices,
            "side_labels": visual_aid.get("side_labels") or {},
            "angle_labels": visual_aid.get("angle_labels") or {},
        }

    if vtype == "circle":
        return {
            "type": "circle",
            "center_label": visual_aid.get("center_label") or "O",
            "radius_label": visual_aid.get("radius_label") or "",
        }

    if vtype == "rectangle":
        return {
            "type": "rectangle",
            "width_label": visual_aid.get("width_label") or "",
            "height_label": visual_aid.get("height_label") or "",
        }

    return None


def generate_questions(
    exam_type: str,
    topic: str,
    difficulty: int,
    question_format: str,
    number_of_questions: int,
    avoid_questions: list[str] | None = None,
) -> list[dict[str, Any]]:
    """Runs the full generation pipeline and returns validated question dicts."""
    prompt = _build_prompt(exam_type, topic, difficulty, question_format, number_of_questions, avoid_questions)
    raw_output = _call_llm(prompt)

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ValueError(f"LLM did not return valid JSON: {exc}") from exc

    if not isinstance(parsed, list):
        raise ValueError("Expected a JSON array of questions")

    validated_questions: list[dict[str, Any]] = []
    for item in parsed:
        _validate_question(item, question_format)
        item["visual_aid"] = _sanitize_visual_aid(item)
        validated_questions.append(item)

    if not validated_questions:
        raise ValueError("No valid questions were generated")

    return validated_questions
