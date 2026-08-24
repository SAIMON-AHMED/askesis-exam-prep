"""Subscription/payment endpoints backed by Stripe."""
import logging
from datetime import datetime, timedelta, timezone

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.models import ExamPurchase, Subscription, SubscriptionStatus, User
from app.schemas.schemas import (
    SubscriptionCheckoutOut,
    SubscriptionCreateRequest,
    SubscriptionOut,
    SubscriptionPlanOut,
)
from app.services.subscription import (
    expire_trial_if_needed,
    get_current_subscription as get_subscription,
)

logger = logging.getLogger(__name__)
settings = get_settings()
stripe.api_key = settings.stripe_secret_key

router = APIRouter(prefix="/subscription", tags=["subscription"])

# Plan definitions
SUBSCRIPTION_PLANS = {
    "free": {
        "name": "Free",
        "price": 0,
        "currency": "usd",
        "questions_per_day": 5,
        "exams_per_month": 1,
        "trial_period_days": 0,
        "features": ["Basic practice questions", "Limited exams", "Basic progress tracking"],
    },
    "pro": {
        "name": "Pro",
        "price": 9.99,
        "currency": "usd",
        "questions_per_day": 50,
        "exams_per_month": 10,
        "trial_period_days": 3,
        "features": [
            "Unlimited practice questions",
            "Unlimited exams",
            "Advanced analytics",
            "Personalized study plans",
            "Priority support",
        ],
    },
    "premium": {
        "name": "Premium",
        "price": 19.99,
        "currency": "usd",
        "questions_per_day": 999,
        "exams_per_month": 999,
        "trial_period_days": 3,
        "features": [
            "Everything in Pro",
            "1-on-1 tutoring sessions",
            "Custom learning paths",
            "Advanced progress tracking",
            "Offline access",
            "VIP email support",
        ],
    },
}


@router.get("/plans", response_model=list[SubscriptionPlanOut])
def get_plans() -> list[SubscriptionPlanOut]:
    """Get available subscription plans."""
    return [
        SubscriptionPlanOut(
            plan_id=plan_id,
            name=plan_data["name"],
            price=plan_data["price"],
            currency=plan_data["currency"],
            questions_per_day=plan_data["questions_per_day"],
            exams_per_month=plan_data["exams_per_month"],
            trial_period_days=plan_data["trial_period_days"],
            features=plan_data["features"],
        )
        for plan_id, plan_data in SUBSCRIPTION_PLANS.items()
    ]


@router.get("/me", response_model=SubscriptionOut)
def get_current_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Subscription:
    """Get current user's subscription."""
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .order_by(Subscription.created_at.desc())
        .first()
    )

    if not subscription:
        # Create free subscription for new users
        subscription = Subscription(
            user_id=current_user.id,
            plan_name="free",
            status=SubscriptionStatus.active,
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)

    return expire_trial_if_needed(subscription, db)


@router.post(
    "/create",
    response_model=SubscriptionCheckoutOut | SubscriptionOut,
    status_code=status.HTTP_201_CREATED,
)
def create_subscription(
    payload: SubscriptionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Subscription:
    """Create a Stripe subscription Checkout Session with a three-day trial."""
    try:
        if payload.plan_name not in SUBSCRIPTION_PLANS:
            raise HTTPException(status_code=400, detail="Invalid plan")

        # Check if user already has an active subscription
        existing = (
            db.query(Subscription)
            .filter(
                Subscription.user_id == current_user.id,
                Subscription.status.in_([SubscriptionStatus.active, SubscriptionStatus.trialing]),
            )
            .first()
        )

        if existing and existing.plan_name == payload.plan_name:
            raise HTTPException(status_code=400, detail="You already have this subscription")

        if payload.plan_name == "free":
            subscription = Subscription(
                user_id=current_user.id,
                plan_name="free",
                status=SubscriptionStatus.active,
            )
            db.add(subscription)
            db.commit()
            db.refresh(subscription)
            return subscription

        if not settings.stripe_secret_key:
            raise HTTPException(status_code=503, detail="Paid subscriptions are not configured")

        stripe.api_key = settings.stripe_secret_key
        plan = SUBSCRIPTION_PLANS[payload.plan_name]
        checkout_session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[
                {
                    "price_data": {
                        "currency": plan["currency"],
                        "unit_amount": int(plan["price"] * 100),
                        "recurring": {"interval": "month"},
                        "product_data": {"name": f"Askesis {plan['name']}"},
                    },
                    "quantity": 1,
                }
            ],
            subscription_data={
                "trial_period_days": plan["trial_period_days"],
                "metadata": {"user_id": current_user.id, "plan_name": payload.plan_name},
            },
            success_url=f"{settings.frontend_origin}/subscription?payment=success",
            cancel_url=f"{settings.frontend_origin}/subscription?payment=cancelled",
            metadata={"user_id": current_user.id, "plan_name": payload.plan_name},
            customer_email=current_user.email,
        )
        db.add(
            Subscription(
                user_id=current_user.id,
                stripe_customer_id=checkout_session.get("customer"),
                stripe_subscription_id=checkout_session.get("subscription"),
                plan_name=payload.plan_name,
                status=SubscriptionStatus.trialing,
                trial_ends_at=datetime.now(timezone.utc)
                + timedelta(days=plan["trial_period_days"]),
            )
        )
        db.commit()
        return {"checkout_url": checkout_session.url}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error creating subscription: %s", exc)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create subscription: {str(exc)}"
        ) from exc


@router.post("/cancel")
def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Cancel current subscription (downgrade to free)."""
    subscription = get_subscription(current_user.id, db)

    # Create a new free subscription
    free_sub = Subscription(
        user_id=current_user.id,
        plan_name="free",
        status=SubscriptionStatus.active,
    )
    db.add(free_sub)
    db.commit()

    return {"message": "Subscription canceled", "plan": "free"}


@router.get("/usage")
def get_subscription_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Get current subscription usage."""
    subscription = get_subscription(current_user.id, db)

    plan = SUBSCRIPTION_PLANS.get(subscription.plan_name, SUBSCRIPTION_PLANS["free"])

    return {
        "plan": subscription.plan_name,
        "status": subscription.status.value,
        "limits": {
            "questions_per_day": plan["questions_per_day"],
            "exams_per_month": plan["exams_per_month"],
        },
        "current_usage": {
            "questions_today": 0,  # Track this from analytics
            "exams_this_month": 0,  # Track this from exam sessions
        },
    }


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    """Handle Stripe webhook events for subscriptions and exam purchases."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
    except (ValueError, stripe.error.SignatureVerificationError) as exc:
        logger.error("Invalid Stripe webhook signature: %s", exc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature") from exc

    event_type = event.get("type", "")
    logger.info("Received Stripe webhook event: %s", event_type)

    data_object = event.get("data", {}).get("object", {})
    # Checkout metadata is available on the Checkout Session, not the Charge.
    if event_type == "checkout.session.completed" and data_object.get("payment_status") == "paid":
        try:
            metadata = data_object.get("metadata", {})
            user_id = metadata.get("user_id")
            exam_id = metadata.get("exam_id")
            plan_name = metadata.get("plan_name")

            if user_id and plan_name and data_object.get("subscription"):
                subscription = (
                    db.query(Subscription)
                    .filter(
                        Subscription.user_id == user_id,
                        Subscription.plan_name == plan_name,
                        Subscription.status == SubscriptionStatus.trialing,
                    )
                    .order_by(Subscription.created_at.desc())
                    .first()
                )
                if subscription:
                    subscription.stripe_subscription_id = data_object["subscription"]
                    subscription.stripe_customer_id = data_object.get("customer")
                    db.commit()

            if user_id and exam_id:
                existing = (
                    db.query(ExamPurchase)
                    .filter(ExamPurchase.user_id == user_id, ExamPurchase.exam_id == exam_id)
                    .first()
                )
                if not existing:
                    purchase = ExamPurchase(
                        user_id=user_id,
                        exam_id=exam_id.lower(),
                        price_paid=data_object.get("amount_total", 0) / 100,
                        currency=data_object.get("currency", "usd"),
                        payment_provider="stripe",
                        payment_reference=data_object.get("payment_intent") or data_object.get("id"),
                    )
                    db.add(purchase)
                    db.commit()
                    logger.info("Granted exam purchase: user=%s exam=%s session=%s", user_id, exam_id, data_object.get("id"))
        except Exception:
            db.rollback()
            logger.exception("Error processing exam purchase webhook")
            raise HTTPException(status_code=500, detail="Webhook processing failed")

    # Handle subscriptions
    stripe_subscription_id = data_object.get("subscription") if event_type == "invoice.payment_failed" else data_object.get("id")
    if stripe_subscription_id:
        subscription = (
            db.query(Subscription)
            .filter(Subscription.stripe_subscription_id == stripe_subscription_id)
            .first()
        )
        if subscription:
            if event_type == "customer.subscription.deleted":
                subscription.status = SubscriptionStatus.canceled
            elif event_type == "invoice.payment_failed":
                subscription.status = SubscriptionStatus.past_due
            elif event_type in ("customer.subscription.updated", "customer.subscription.created"):
                stripe_status = data_object.get("status")
                subscription.status = {
                    "trialing": SubscriptionStatus.trialing,
                    "active": SubscriptionStatus.active,
                    "past_due": SubscriptionStatus.past_due,
                    "canceled": SubscriptionStatus.canceled,
                    "unpaid": SubscriptionStatus.past_due,
                }.get(stripe_status, subscription.status)
                trial_end = data_object.get("trial_end")
                if trial_end:
                    subscription.trial_ends_at = datetime.fromtimestamp(trial_end, tz=timezone.utc)
            db.commit()

    return {"received": True}
