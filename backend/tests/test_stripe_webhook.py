"""Focused tests for Stripe Checkout purchase fulfillment."""
import asyncio
from unittest.mock import MagicMock

from starlette.requests import Request

from app.api.routers import subscription
from app.models.models import ExamPurchase


def test_completed_checkout_grants_exam_access(monkeypatch):
    event = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_123",
                "payment_status": "paid",
                "amount_total": 1499,
                "currency": "usd",
                "payment_intent": "pi_test_123",
                "metadata": {
                    "user_id": "user-uuid-123",
                    "exam_id": "sat",
                },
            }
        },
    }
    monkeypatch.setattr(subscription.stripe.Webhook, "construct_event", lambda *_args: event)

    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    async def receive():
        return {"type": "http.request", "body": b"{}", "more_body": False}

    request = Request(
        {
            "type": "http",
            "method": "POST",
            "path": "/subscription/webhook",
            "headers": [(b"stripe-signature", b"test-signature")],
        },
        receive,
    )

    response = asyncio.run(subscription.stripe_webhook(request, db))

    assert response == {"received": True}
    purchase = db.add.call_args.args[0]
    assert isinstance(purchase, ExamPurchase)
    assert purchase.user_id == "user-uuid-123"
    assert purchase.exam_id == "sat"
    assert purchase.price_paid == 14.99
    assert purchase.payment_provider == "stripe"
    assert purchase.payment_reference == "pi_test_123"
    db.commit.assert_called_once()
