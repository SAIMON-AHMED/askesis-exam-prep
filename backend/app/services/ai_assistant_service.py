"""Conversational study assistant service, powered by the configured chat model."""
from openai import OpenAI

from app.core.config import get_settings

settings = get_settings()

SYSTEM_PROMPT = """You are a friendly, encouraging study tutor embedded in an exam prep platform \
(SAT, ACT, GRE, GMAT, SHSAT, and Regents). Help students understand concepts, work through practice \
questions, and build study strategies.

Guidelines:
- Keep answers concise and focused (a few short paragraphs at most, use bullet points for steps).
- When a student shares a practice question, prefer guiding hints and step-by-step reasoning over \
just stating the final answer, unless they explicitly ask for the answer.
- Adapt explanations to the student's exam and topic when that context is provided.
- Be encouraging and supportive, especially if the student seems frustrated or stuck.
"""


def chat_with_assistant(message: str, history: list[dict[str, str]], context: str | None = None) -> str:
    """Send a chat message (with optional history and page context) and return the reply text."""
    if not settings.chatgpt_api_key:
        raise ValueError("CHATGPT_API_KEY is not configured")

    client = OpenAI(api_key=settings.chatgpt_api_key)

    messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]
    if context:
        messages.append({"role": "system", "content": f"Current student context: {context}"})

    # Only keep the last few turns to bound request size/cost
    for turn in history[-10:]:
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model=settings.chatgpt_model,
        messages=messages,
        temperature=0.5,
    )
    return response.choices[0].message.content or ""
