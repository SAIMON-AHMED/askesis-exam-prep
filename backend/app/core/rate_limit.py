"""Rate limiting middleware using slowapi."""
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from functools import lru_cache

# Initialize limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],  # Default: 100 requests per minute
)

# Define specific rate limits
RATE_LIMITS = {
    "auth": "5/minute",  # Strict limit for auth endpoints
    "practice": "100/hour",  # Generous limit for practice questions
    "exam": "10/hour",  # Limited exam starts
    "api": "100/minute",  # Default API rate limit
}


def get_rate_limit(endpoint: str) -> str:
    """Get rate limit for a specific endpoint type."""
    return RATE_LIMITS.get(endpoint, RATE_LIMITS["api"])


def rate_limit_key(request: Request) -> str:
    """Generate a rate limit key based on client."""
    return f"{get_remote_address(request)}"
