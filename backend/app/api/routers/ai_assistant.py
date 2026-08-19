"""Conversational study assistant endpoints."""
import logging

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.ai_assistant_service import chat_with_assistant

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/assistant", tags=["assistant"])


class ChatMessage(BaseModel):
    """A single turn in the conversation history."""

    role: str
    content: str


class AssistantChatRequest(BaseModel):
    """Request model for a study assistant chat turn."""

    message: str
    context: str | None = None
    history: list[ChatMessage] = Field(default_factory=list)


class AssistantChatResponse(BaseModel):
    """Response model for a study assistant chat turn."""

    reply: str


@router.post("/chat", response_model=AssistantChatResponse)
async def assistant_chat(request: AssistantChatRequest) -> AssistantChatResponse:
    """
    Send a message to the study assistant and get a reply.

    Args:
        request: message, optional page context (exam/topic/question), and recent history

    Returns:
        The assistant's reply text
    """
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="message cannot be empty",
        )

    try:
        reply = chat_with_assistant(
            message=request.message,
            history=[turn.model_dump() for turn in request.history],
            context=request.context,
        )
        return AssistantChatResponse(reply=reply)
    except ValueError as e:
        logger.error(f"Assistant chat failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assistant chat failed: {str(e)}",
        )
