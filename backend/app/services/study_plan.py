"""Study plan generator: builds a structured weekly plan via LLM based on
user profile, progress metrics, and exam timeline.
"""
import json
import math
from datetime import datetime, timezone
from typing import Any

from openai import OpenAI

from app.core.config import get_settings

settings = get_settings()

MAX_PLAN_WEEKS = 24
DEFAULT_PLAN_WEEKS = 4

PROMPT_TEMPLATE = """You are an expert exam-prep coach.
Create a personalized weekly study plan in JSON for a student with this profile:

- Today's date: {today}
- Exam date: {exam_date}
- Total weeks available before the exam: {num_weeks}
- Current skill level (avg mastery score 0-100): {current_skill_level}
- Target score: {target_score}
- Weak topics: {weak_topics}
- Available weekly study hours: {weekly_hours}

The plan MUST contain EXACTLY {num_weeks} week entries, numbered 1 through {num_weeks} in
chronological order, where week 1 starts on {today} and the final week ends on or before the
exam date. Do not include more or fewer weeks than {num_weeks}.

Respond ONLY with valid JSON matching this schema:
{{
  "weeks": [
    {{
      "week_number": int,
      "focus_topics": [string],
      "daily_tasks": [{{"day": string, "tasks": [string]}}],
      "recommended_question_sets": [string],
      "recommended_mock_exams": [string],
      "review_sessions": [string]
    }}
  ]
}}
"""


def _call_llm(prompt: str) -> str:
    """Call OpenAI API to generate study plan. Raises exception if fails."""
    if not settings.openai_api_key or settings.openai_api_key.startswith("sk-"):
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY not configured in environment")
    
    try:
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        result = response.choices[0].message.content or ""
        if not result:
            raise ValueError("LLM returned empty response")
        return result
    except Exception as e:
        raise ValueError(f"OpenAI API call failed: {str(e)}")


def _compute_num_weeks(exam_date: datetime | None) -> int:
    """Deterministically derive how many weeks the plan should cover."""
    if exam_date is None:
        return DEFAULT_PLAN_WEEKS

    now = datetime.now(timezone.utc)
    # Normalize exam_date to UTC if it has timezone info
    if exam_date.tzinfo is None:
        target = exam_date.replace(tzinfo=timezone.utc)
    else:
        target = exam_date

    if target <= now:
        raise ValueError("Exam date must be in the future")

    days_remaining = (target - now).days
    num_weeks = max(1, math.ceil(days_remaining / 7))
    return min(num_weeks, MAX_PLAN_WEEKS)


def _generate_fallback_plan(num_weeks: int, weekly_hours: float) -> dict[str, Any]:
    """Generate a basic study plan when LLM fails."""
    weeks = []
    focus_topics = ["Core Concepts", "Practice Problems", "Review & Refinement", "Full-Length Exams"]
    
    for week_num in range(1, num_weeks + 1):
        focus_index = min((week_num - 1) % len(focus_topics), len(focus_topics) - 1)
        week = {
            "week_number": week_num,
            "focus_topics": [focus_topics[focus_index]],
            "daily_tasks": [
                {
                    "day": day,
                    "tasks": [
                        f"Study {focus_topics[focus_index].lower()}",
                        f"Complete {int(weekly_hours / 6)} practice questions",
                        "Review difficult concepts"
                    ]
                }
                for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            ],
            "recommended_question_sets": ["Topic-specific practice set", "Mixed difficulty drill"],
            "recommended_mock_exams": ["Full-length timed exam"] if week_num % 2 == 0 else [],
            "review_sessions": ["Review errors from previous day"]
        }
        weeks.append(week)
    
    return {"weeks": weeks}


def generate_study_plan(
    exam_date: datetime | None,
    current_skill_level: float,
    target_score: int | None,
    weak_topics: list[str],
    weekly_hours: float,
) -> dict[str, Any]:
    num_weeks = _compute_num_weeks(exam_date)
    today = datetime.now(timezone.utc).date().isoformat()

    prompt = PROMPT_TEMPLATE.format(
        today=today,
        exam_date=exam_date.isoformat() if exam_date else "not specified",
        num_weeks=num_weeks,
        current_skill_level=current_skill_level,
        target_score=target_score or "not specified",
        weak_topics=", ".join(weak_topics) if weak_topics else "none identified yet",
        weekly_hours=weekly_hours,
    )
    
    # Try to get plan from LLM
    plan = None
    try:
        raw_output = _call_llm(prompt)
        plan = json.loads(raw_output)
    except (ValueError, json.JSONDecodeError) as e:
        # Fall back to generated plan
        import logging
        logging.warning(f"LLM study plan generation failed ({str(e)}), using fallback plan")
        plan = _generate_fallback_plan(num_weeks, weekly_hours)

    # Validate and normalize the plan
    if "weeks" not in plan or not isinstance(plan["weeks"], list):
        raise ValueError("Study plan JSON missing 'weeks' array")

    weeks = plan["weeks"]
    if len(weeks) > num_weeks:
        weeks = weeks[:num_weeks]
    for idx, week in enumerate(weeks, start=1):
        week["week_number"] = idx
    plan["weeks"] = weeks

    return plan
