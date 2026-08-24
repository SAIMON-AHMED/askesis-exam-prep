"""Redis caching service for application-level caching."""
import json
import logging
from typing import Any, Optional, Callable
from functools import wraps
from datetime import timedelta
try:
    import redis
except ModuleNotFoundError:
    redis = None
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class CacheService:
    """Service for Redis caching operations."""

    def __init__(self, redis_url: Optional[str] = None):
        self.redis_url = redis_url or settings.redis_url
        if redis is None:
            self.enabled = False
            self.client = None
            return
        try:
            self.client = redis.from_url(
                self.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_keepalive=True,
                health_check_interval=30,
            )
            # Test connection
            self.client.ping()
            self.enabled = True
            logger.info("Redis cache connected successfully")
        except Exception as e:
            logger.warning(f"Redis cache unavailable: {e}. Caching disabled.")
            self.enabled = False
            self.client = None

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if not self.enabled:
            return None

        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            logger.error(f"Error getting cache key {key}: {e}")

        return None

    def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
    ) -> bool:
        """Set value in cache with optional TTL (in seconds)."""
        if not self.enabled:
            return False

        try:
            serialized = json.dumps(value)
            if ttl:
                self.client.setex(key, ttl, serialized)
            else:
                self.client.set(key, serialized)
            return True
        except Exception as e:
            logger.error(f"Error setting cache key {key}: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete value from cache."""
        if not self.enabled:
            return False

        try:
            self.client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Error deleting cache key {key}: {e}")
            return False

    def clear_pattern(self, pattern: str) -> int:
        """Delete all keys matching a pattern."""
        if not self.enabled:
            return 0

        try:
            keys = self.client.keys(pattern)
            if keys:
                return self.client.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Error clearing cache pattern {pattern}: {e}")
            return 0

    def exists(self, key: str) -> bool:
        """Check if key exists in cache."""
        if not self.enabled:
            return False

        try:
            return bool(self.client.exists(key))
        except Exception as e:
            logger.error(f"Error checking cache key {key}: {e}")
            return False

    def increment(self, key: str, amount: int = 1) -> int:
        """Increment numeric value in cache."""
        if not self.enabled:
            return 0

        try:
            return self.client.incrby(key, amount)
        except Exception as e:
            logger.error(f"Error incrementing cache key {key}: {e}")
            return 0

    def expire(self, key: str, ttl: int) -> bool:
        """Set expiration on an existing key."""
        if not self.enabled:
            return False

        try:
            return bool(self.client.expire(key, ttl))
        except Exception as e:
            logger.error(f"Error setting expiration on cache key {key}: {e}")
            return False


# Global cache instance
_cache_instance: Optional[CacheService] = None


def get_cache() -> CacheService:
    """Get or create global cache instance."""
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = CacheService()
    return _cache_instance


# Cache key patterns for different data types
CACHE_KEYS = {
    'user_profile': 'user:{user_id}:profile',
    'user_progress': 'user:{user_id}:progress',
    'exam_history': 'user:{user_id}:exams',
    'study_plans': 'user:{user_id}:study_plans',
    'subscription': 'user:{user_id}:subscription',
    'analytics_overview': 'user:{user_id}:analytics:overview',
    'curriculum': 'exam:{exam_id}:curriculum',
    'question_pool': 'exam:{exam_id}:questions',
    'trending_topics': 'trending:topics',
}

# Default TTLs (in seconds)
CACHE_TTL = {
    'user_profile': 3600,  # 1 hour
    'user_progress': 1800,  # 30 minutes
    'exam_history': 3600,  # 1 hour
    'study_plans': 3600,  # 1 hour
    'subscription': 3600,  # 1 hour
    'analytics_overview': 1800,  # 30 minutes
    'curriculum': 86400,  # 24 hours
    'question_pool': 3600,  # 1 hour
    'trending_topics': 3600,  # 1 hour
}


def cache_decorator(
    key_func: Callable,
    ttl: int = 3600,
):
    """
    Decorator for caching function results.

    Usage:
        @cache_decorator(lambda user_id: f'user:{user_id}:data', ttl=1800)
        def get_user_data(user_id: str):
            return expensive_operation()
    """

    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache = get_cache()

            # Generate cache key
            cache_key = key_func(*args, **kwargs) if callable(key_func) else key_func

            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit: {cache_key}")
                return cached_value

            # Compute value and cache it
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            logger.debug(f"Cache miss, computed and cached: {cache_key}")

            return result

        return wrapper

    return decorator


# Invalidation strategies
def invalidate_user_cache(user_id: str):
    """Invalidate all cache entries for a user."""
    cache = get_cache()
    patterns = [
        f'user:{user_id}:*',
    ]
    for pattern in patterns:
        cache.clear_pattern(pattern)
    logger.info(f"Invalidated cache for user {user_id}")


def invalidate_exam_cache(exam_id: str):
    """Invalidate all cache entries for an exam."""
    cache = get_cache()
    cache.clear_pattern(f'exam:{exam_id}:*')
    logger.info(f"Invalidated cache for exam {exam_id}")
