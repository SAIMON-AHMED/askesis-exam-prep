"""Business model expansion and monetization tests."""
from datetime import datetime, timedelta, timezone

from app.api.routers import subscription
from app.models.models import Subscription, SubscriptionStatus


def test_subscription_plans_are_defined():
    """Verify all subscription plans are properly configured."""
    plans = subscription.SUBSCRIPTION_PLANS
    assert "free" in plans
    assert "pro" in plans
    assert "premium" in plans

    # Each plan should have essential fields
    for plan_name, plan_data in plans.items():
        assert "name" in plan_data
        assert "price" in plan_data
        assert "currency" in plan_data
        assert "features" in plan_data
        assert isinstance(plan_data["features"], list)
        assert len(plan_data["features"]) > 0


def test_pro_plan_has_higher_limits_than_free():
    """Verify Pro plan offers better value than Free plan."""
    free_plan = subscription.SUBSCRIPTION_PLANS["free"]
    pro_plan = subscription.SUBSCRIPTION_PLANS["pro"]

    assert pro_plan["questions_per_day"] > free_plan["questions_per_day"]
    assert pro_plan["exams_per_month"] > free_plan["exams_per_month"]
    assert pro_plan["price"] > free_plan["price"]
    assert len(pro_plan["features"]) >= len(free_plan["features"])


def test_premium_plan_has_highest_limits():
    """Verify Premium plan offers the most value."""
    pro_plan = subscription.SUBSCRIPTION_PLANS["pro"]
    premium_plan = subscription.SUBSCRIPTION_PLANS["premium"]

    assert premium_plan["questions_per_day"] >= pro_plan["questions_per_day"]
    assert premium_plan["exams_per_month"] >= pro_plan["exams_per_month"]
    assert premium_plan["price"] >= pro_plan["price"]
    assert len(premium_plan["features"]) >= len(pro_plan["features"])


def test_trial_period_incentives():
    """Verify trial periods are configured to drive conversions."""
    pro_plan = subscription.SUBSCRIPTION_PLANS["pro"]
    premium_plan = subscription.SUBSCRIPTION_PLANS["premium"]

    # Trial periods should encourage users to try premium
    assert pro_plan["trial_period_days"] > 0
    assert premium_plan["trial_period_days"] > 0
    assert pro_plan["trial_period_days"] >= 3  # At least 3 days
    assert premium_plan["trial_period_days"] >= 3


def test_subscription_revenue_optimization():
    """Verify subscription structure maximizes lifetime value."""
    plans = subscription.SUBSCRIPTION_PLANS
    
    # Ensure there's a free tier for acquisition
    assert plans["free"]["price"] == 0
    
    # Ensure multiple paid tiers for upsell path
    paid_plans = [p for p_name, p in plans.items() if p["price"] > 0]
    assert len(paid_plans) >= 2, "Should have at least 2 paid tiers for upsell ladder"
    
    # Verify price points are sensible for market
    prices = sorted([p["price"] for p_name, p in plans.items() if p["price"] > 0])
    # Premium should be roughly 2x Pro for perceived value increase
    assert prices[-1] / prices[0] >= 1.5, "Premium should have meaningful price gap from Pro"
