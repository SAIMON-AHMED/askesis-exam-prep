"""Tests for premium feature tracking."""
from unittest.mock import MagicMock

from app.api.routers import features
from app.models.models import AnalyticsEvent, User


def test_premium_features_are_defined():
    """Verify all premium features are properly configured."""
    feature_list = features.PREMIUM_FEATURES
    assert len(feature_list) > 0
    
    for feature_name, feature_data in feature_list.items():
        assert "name" in feature_data
        assert "plan" in feature_data
        assert "category" in feature_data
        assert "value" in feature_data
        assert feature_data["plan"] in ["pro", "premium"]


def test_feature_tracking_logs_event():
    """Verify feature usage is tracked for analytics."""
    user = User(id="user-789", email="feature@test.com", hashed_password="hash")
    db = MagicMock()
    
    captured_event = None
    
    def mock_add(obj):
        nonlocal captured_event
        if isinstance(obj, AnalyticsEvent):
            captured_event = obj
    
    db.add.side_effect = mock_add
    
    result = features.track_feature_usage("unlimited_practice", user, db)
    
    assert result["status"] == "tracked"
    assert result["feature"] == "unlimited_practice"
    assert captured_event is not None
    assert captured_event.event_type == "premium_feature_used"
    assert captured_event.event_data["feature"] == "unlimited_practice"
    assert db.commit.called


def test_unknown_feature_returns_gracefully():
    """Verify unknown features don't crash tracking."""
    user = User(id="user-xyz", email="test@example.com", hashed_password="hash")
    db = MagicMock()
    
    result = features.track_feature_usage("nonexistent_feature", user, db)
    
    assert result["status"] == "unknown_feature"
    assert result["feature"] == "nonexistent_feature"


def test_features_list_returns_all_features():
    """Verify feature listing returns all premium features."""
    result = features.list_premium_features()
    
    assert "features" in result
    assert "total_features" in result
    assert "categories" in result
    assert result["total_features"] > 0
    assert len(result["features"]) == result["total_features"]
