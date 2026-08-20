"""AI-powered question generation pipeline.

Steps: build prompt -> call LLM (deterministic, temperature<=0.3) -> validate JSON ->
validate correctness/consistency/completeness -> return structured result.
Raises ValueError for any question that fails validation (hallucinated/malformed).
"""
import json
import logging
import re
from typing import Any

from openai import OpenAI

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

PROMPT_TEMPLATE = """You are an expert {exam_type} exam question writer. Your task is to generate high-quality, authentic exam questions.
Generate {n} {question_format} question(s) on the topic "{topic}" at difficulty level {difficulty} (1=easiest, 5=hardest).

DIFFICULTY LEVEL DEFINITIONS (strictly follow these):
- Level 1 (Basic): Fundamental concepts, straightforward calculations, single-step or obvious multi-step solution.
  Example: "What is 2 + 3?" or "Define [basic term]"
  Distractors: Obvious wrong answers that result from basic misunderstanding.

- Level 2 (Easy): Core concepts with simple application, 1-2 intermediate steps, minimal conceptual depth.
  Example: "Solve x + 5 = 12" or "Apply [basic formula] with given values"
  Distractors: Common small mistakes (arithmetic errors, sign errors, off-by-one).

- Level 3 (Medium): Requires understanding of multiple concepts, 2-3 problem-solving steps, moderate complexity.
  Example: "Solve a system of linear equations" or "Apply [concept] in a multi-step scenario"
  Distractors: Plausible but incorrect answers from common misconceptions or computational mistakes.

- Level 4 (Hard): Combines multiple advanced concepts, 3-4 complex steps, requires strategic problem-solving approach.
  Example: "Solve complex word problem requiring multiple formula applications" or "Synthesize concepts creatively"
  Distractors: Sophisticated traps that catch students who understand individual concepts but miss the synthesis.

- Level 5 (Very Hard): Integration of advanced concepts, 4+ complex steps, significant conceptual synthesis required.
  Ambiguous interpretations are intentionally embedded. Requires deep conceptual mastery.
  Example: "Multi-stage problem requiring novel application of concepts" or "Question with subtle distinctions"
  Distractors: Highly plausible answers that result from subtle conceptual confusion or incomplete reasoning.
  KEY: Level 5 questions should challenge even strong students. They should NOT be solvable by routine application.

YOUR RESPONSIBILITY:
- Verify your difficulty level assessment is accurate before responding.
- For level 5: Ensure multiple problem-solving steps are truly necessary and non-obvious.
- For level 5: Create distractors that appeal to students who partially understand the topic.
- Ensure the correct answer is unambiguously correct (even if the question is complex).
- Question must be authentic to the {exam_type} exam (match actual style, phrasing, and scope).

ANSWER CORRECTNESS PROTOCOL (highest priority — a wrong answer is worse than no question):
1. Solve the question completely yourself BEFORE writing the options.
2. Build the option list so that your derived result is literally one of the four options,
   and make "correct_answer" point at that option.
3. Verify by substitution: plug your answer back into the original question and confirm it holds.
4. If your derived result does NOT appear among the options, you have made an error — DISCARD the
   question entirely and write a different one. Never "adjust" the intent or pick the closest option.
5. The explanation must be a single clean derivation that ends at the stated correct_answer.
   It must NOT contain second-guessing, corrections, or meta-commentary. Specifically, never write
   phrases like "wait", "actually", "however this does not match", "recheck", "let me reconsider",
   "the intended equation should be", or "as written". If you catch a mistake while explaining,
   silently rewrite the whole question instead of narrating the correction.

Requirements for all questions:
- Match authentic {exam_type} exam style and phrasing.
- Stay strictly within the boundaries of the "{topic}" topic.
- If question_format is "multiple_choice", provide exactly 4 options labeled A-D with exactly one correct answer.
- If question_format is "numeric", provide a single numeric correct_answer (no options).
- Provide a complete, step-by-step explanation that justifies the correct answer and explains why each distractor is wrong.
- Double-check: The math is correct, the correct_answer matches the explanation's conclusion, and the difficulty level is appropriate.
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


def _call_llm(prompt: str, difficulty: int = 3) -> str:
    client = OpenAI(api_key=settings.openai_api_key)
    # Slightly increase temperature for higher difficulties to encourage more creative/complex questions
    # But keep it low enough for consistency
    temperature = 0.2 + (difficulty - 1) * 0.05  # Range: 0.2 (level 1) to 0.4 (level 5)
    response = client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
    )
    return response.choices[0].message.content or ""


def _validate_difficulty_level(item: dict[str, Any], difficulty: int, question_format: str) -> None:
    """For level 5 (hardest) questions, ensure they're actually complex."""
    if difficulty < 5:
        return  # Only validate level 5

    explanation = item.get("explanation", "")
    
    # Level 5 questions should have multi-step explanations (indication of complexity)
    # Count the number of logical steps (presence of words like "first", "then", "next", "therefore", etc.)
    step_indicators = ["first", "then", "next", "therefore", "thus", "so", "hence", "step", "apply", "substitute", "solve", "substitute back"]
    step_count = sum(explanation.lower().count(word) for word in step_indicators)
    
    if step_count < 2:
        raise ValueError(f"Level 5 question appears too simple (only {step_count} solution steps detected)")
    
    # Level 5 questions should have reasonably long explanations (complexity indicator)
    if len(explanation.strip().split()) < 40:
        raise ValueError(f"Level 5 question explanation is too brief ({len(explanation.split())} words); should be detailed")


# Phrases that indicate the model solved the problem, found its own answer did not match the
# options, and then narrated a correction instead of rewriting the question. Any of these means
# the question/answer pair is untrustworthy and must be discarded.
_HEDGING_MARKERS = (
    "does not match any answer choice",
    "doesn't match any answer choice",
    "does not match any of the answer",
    "not match any option",
    "none of the answer choices",
    "no answer choice matches",
    "recheck the arithmetic",
    "let me reconsider",
    "let me recheck",
    "on second thought",
    "the intended equation",
    "should be adjusted",
    "as written, the correct",
    "wait, let",
    "wait, that",
    "wait, i",
    "wait, check",
    "actually, the correct",
    "i made a mistake",
    "correction:",
    "closest option",
    "closest answer",
)


def _validate_answer_consistency(item: dict[str, Any], question_format: str) -> None:
    """Reject questions whose explanation contradicts, or is unsure about, the stated answer.

    This catches the common failure where the model derives a value that is absent from the
    options (e.g. x = 33/4 with choices 3/5/7/9) and still labels one option correct.
    """
    explanation = item["explanation"]
    lowered = explanation.lower()

    for marker in _HEDGING_MARKERS:
        if marker in lowered:
            raise ValueError(f"explanation contains self-correction/uncertainty marker: {marker!r}")

    if question_format != "multiple_choice":
        return

    options: dict[str, Any] = item["options"]
    answer_key = item["correct_answer"].strip()
    if answer_key not in options:
        # correct_answer held the option text rather than its letter; map it back to a letter.
        matches = [k for k, v in options.items() if str(v).strip() == answer_key]
        if not matches:
            raise ValueError("correct_answer does not correspond to any option")
        answer_key = matches[0]
        item["correct_answer"] = answer_key

    # The explanation should name the winning option, either by letter or by its text.
    answer_text = str(options[answer_key]).strip()
    mentions_letter = bool(
        re.search(rf"\b(?:option|choice|answer)?\s*\(?{re.escape(answer_key)}\)?\b", explanation)
    )
    mentions_text = bool(answer_text) and answer_text.lower() in lowered
    if not mentions_letter and not mentions_text:
        raise ValueError("explanation never references the stated correct answer")


def _validate_question(item: dict[str, Any], question_format: str, difficulty: int = 3) -> None:
    """Reject malformed or hallucinated questions."""
    required_fields = ["question_text", "correct_answer", "explanation"]
    for field in required_fields:
        if not item.get(field):
            raise ValueError(f"Missing required field: {field}")

    if question_format == "multiple_choice":
        options = item.get("options")
        if not isinstance(options, dict) or set(options.keys()) != {"A", "B", "C", "D"}:
            raise ValueError("multiple_choice question must have exactly options A-D")
        if item["correct_answer"] not in options and item["correct_answer"] not in options.values():
            raise ValueError("correct_answer must reference one of the options")
        if len({str(v).strip() for v in options.values()}) != 4:
            raise ValueError("multiple_choice options must be distinct")

    if question_format == "numeric" and item.get("options"):
        raise ValueError("numeric question must not include options")

    if len(item["explanation"].strip()) < 20:
        raise ValueError("explanation is too short / incomplete")

    _validate_answer_consistency(item, question_format)

    # Validate difficulty-specific constraints
    _validate_difficulty_level(item, difficulty, question_format)


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


def _generate_once(
    exam_type: str,
    topic: str,
    difficulty: int,
    question_format: str,
    number_of_questions: int,
    avoid_questions: list[str] | None,
) -> list[dict[str, Any]]:
    """One generation round. Individually invalid questions are dropped, not fatal."""
    prompt = _build_prompt(exam_type, topic, difficulty, question_format, number_of_questions, avoid_questions)
    raw_output = _call_llm(prompt, difficulty=difficulty)

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ValueError(f"LLM did not return valid JSON: {exc}") from exc

    if not isinstance(parsed, list):
        raise ValueError("Expected a JSON array of questions")

    validated_questions: list[dict[str, Any]] = []
    for item in parsed:
        if not isinstance(item, dict):
            continue
        try:
            _validate_question(item, question_format, difficulty=difficulty)
        except ValueError as exc:
            # Drop just this question; a single bad item must not sink the whole batch.
            logger.warning("Discarded %s/%s question: %s", exam_type, topic, exc)
            continue
        item["visual_aid"] = _sanitize_visual_aid(item)
        validated_questions.append(item)

    return validated_questions


def generate_questions(
    exam_type: str,
    topic: str,
    difficulty: int,
    question_format: str,
    number_of_questions: int,
    avoid_questions: list[str] | None = None,
) -> list[dict[str, Any]]:
    """Runs the full generation pipeline and returns validated question dicts.

    Questions that fail validation (wrong/unsupported answer, hedging explanation, or an
    under-difficult level 5) are discarded. One retry covers the shortfall so that strict
    validation does not leave the caller short of questions.
    """
    questions = _generate_once(
        exam_type, topic, difficulty, question_format, number_of_questions, avoid_questions
    )

    if len(questions) < number_of_questions:
        shortfall = number_of_questions - len(questions)
        already_used = (avoid_questions or []) + [q["question_text"] for q in questions]
        try:
            questions.extend(
                _generate_once(
                    exam_type, topic, difficulty, question_format, shortfall, already_used
                )
            )
        except ValueError as exc:
            logger.warning("Retry for %s/%s failed: %s", exam_type, topic, exc)

    if not questions:
        raise ValueError("No valid questions were generated")

    return questions[:number_of_questions]
