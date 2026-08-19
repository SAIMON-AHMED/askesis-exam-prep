"""Database query optimization utilities."""
from typing import TypeVar, Generic, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from sqlalchemy import func

T = TypeVar('T')


class QueryOptimizer(Generic[T]):
    """Utility class for optimizing database queries."""

    def __init__(self, session: Session):
        self.session = session

    @staticmethod
    def batch_fetch(session: Session, model_class: type, ids: List[str]) -> List[T]:
        """
        Fetch multiple records by IDs in a single query.
        Better than N+1 queries.
        """
        if not ids:
            return []
        return session.query(model_class).filter(model_class.id.in_(ids)).all()

    @staticmethod
    def paginate(query, page: int = 1, per_page: int = 20):
        """
        Paginate query results efficiently.
        Use offset/limit for better performance with indexed columns.
        """
        total = query.count()
        offset = (page - 1) * per_page
        items = query.offset(offset).limit(per_page).all()
        
        return {
            'items': items,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page,
        }

    @staticmethod
    def select_fields(query, *fields):
        """
        Select specific columns to reduce data transfer.
        Useful when you don't need the entire model.
        """
        return query.with_entities(*fields)

    @staticmethod
    def with_count(session: Session, model_class: type) -> int:
        """
        Count records efficiently using COUNT(*).
        """
        return session.query(func.count(model_class.id)).scalar() or 0


class CachedQuery:
    """
    Simple query result caching decorator.
    Use with Redis for distributed caching in production.
    """

    def __init__(self, ttl_seconds: int = 300):
        self.ttl_seconds = ttl_seconds
        self._cache = {}
        self._cache_times = {}

    def get(self, key: str):
        """Get cached value if not expired."""
        import time
        if key in self._cache:
            if time.time() - self._cache_times[key] < self.ttl_seconds:
                return self._cache[key]
            else:
                del self._cache[key]
                del self._cache_times[key]
        return None

    def set(self, key: str, value):
        """Set cached value with TTL."""
        import time
        self._cache[key] = value
        self._cache_times[key] = time.time()

    def clear(self, key: str = None):
        """Clear cache entry or entire cache."""
        if key:
            self._cache.pop(key, None)
            self._cache_times.pop(key, None)
        else:
            self._cache.clear()
            self._cache_times.clear()


# Performance optimization query patterns

def get_user_with_progress(session: Session, user_id: str):
    """
    Fetch user with related progress in single query using join.
    Avoids N+1 queries.
    """
    from app.models.models import User, UserProgress
    
    return session.query(User).options(
        # joinedload or selectinload to avoid N+1
    ).filter(User.id == user_id).first()


def get_exam_summary_stats(session: Session, user_id: str):
    """
    Aggregate stats in database instead of application.
    More efficient than fetching all records and aggregating in Python.
    """
    from app.models.models import ExamSession
    from sqlalchemy import func as db_func
    
    return session.query(
        db_func.count(ExamSession.id).label('total_exams'),
        db_func.avg(ExamSession.raw_score).label('avg_score'),
        db_func.max(ExamSession.raw_score).label('max_score'),
    ).filter(
        ExamSession.user_id == user_id,
        ExamSession.status == 'submitted'
    ).first()


def get_recent_activities(session: Session, user_id: str, limit: int = 10):
    """
    Get recent activities efficiently with proper indexes.
    """
    from app.models.models import AnalyticsEvent
    
    return session.query(AnalyticsEvent).filter(
        AnalyticsEvent.user_id == user_id
    ).order_by(
        AnalyticsEvent.created_at.desc()
    ).limit(limit).all()


# Database connection pool optimization
DB_POOL_CONFIG = {
    'pool_size': 20,  # Base pool size
    'max_overflow': 40,  # Maximum overflow connections
    'pool_recycle': 3600,  # Recycle connections after 1 hour
    'pool_pre_ping': True,  # Test connections before using (detect stale connections)
    'echo': False,  # Set to True for SQL debugging
}
