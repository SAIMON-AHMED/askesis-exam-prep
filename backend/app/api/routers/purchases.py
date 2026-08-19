"""Per-exam purchase endpoints with Stripe Checkout integration."""
import logging

import stripe
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.models import ExamPurchase, User
from app.schemas.schemas import (
    ExamCatalogItem,
    ExamPurchaseOut,
    ExamPurchaseRequest,
    MyExamAccessOut,
)
from app.services.subscription import is_premium_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/purchases", tags=["purchases"])

# One-time price for lifetime access to a single exam's full curriculum.
EXAM_CATALOG: dict[str, dict] = {
    "sat": {"name": "SAT", "price": 14.99, "currency": "usd"},
    "act": {"name": "ACT", "price": 14.99, "currency": "usd"},
    "gre": {"name": "GRE", "price": 19.99, "currency": "usd"},
    "gmat": {"name": "GMAT", "price": 19.99, "currency": "usd"},
    "shsat": {"name": "SHSAT", "price": 12.99, "currency": "usd"},
    "regents": {"name": "Regents", "price": 12.99, "currency": "usd"},
}


@router.get("/catalog", response_model=list[ExamCatalogItem])
def get_catalog() -> list[ExamCatalogItem]:
    """Public list of purchasable exams and prices."""
    return [
        ExamCatalogItem(exam_id=exam_id, name=data["name"], price=data["price"], currency=data["currency"])
        for exam_id, data in EXAM_CATALOG.items()
    ]


@router.get("/me", response_model=MyExamAccessOut)
def get_my_access(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MyExamAccessOut:
    """Exams the current user can access."""
    purchases = db.query(ExamPurchase).filter(ExamPurchase.user_id == current_user.id).all()
    return MyExamAccessOut(
        purchased_exam_ids=sorted({p.exam_id for p in purchases}),
        has_all_access=is_premium_user(current_user.id, db),
    )


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def purchase_exam(
    payload: ExamPurchaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Create a Stripe Checkout session for exam purchase.
    
    Returns: { "checkout_url": "https://checkout.stripe.com/..." }
    Frontend redirects user to checkout_url.
    Upon payment success, Stripe webhook grants access.
    """
    settings = get_settings()
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    stripe.api_key = settings.stripe_secret_key
    exam_id = payload.exam_id.lower().strip()
    catalog_entry = EXAM_CATALOG.get(exam_id)
    if not catalog_entry:
        raise HTTPException(status_code=400, detail="Unknown exam")

    existing = (
        db.query(ExamPurchase)
        .filter(ExamPurchase.user_id == current_user.id, ExamPurchase.exam_id == exam_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already own this exam")

    try:
        # Create Stripe Checkout session
        checkout_session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": int(catalog_entry["price"] * 100),  # Convert to cents
                        "product_data": {
                            "name": f"{catalog_entry['name']} - Lifetime Access",
                            "description": f"Full curriculum, practice questions, and analytics for {catalog_entry['name']}",
                        },
                    },
                    "quantity": 1,
                }
            ],
            # User will be redirected here after payment
            success_url=f"{settings.frontend_origin}/exams/{exam_id}?payment=success",
            cancel_url=f"{settings.frontend_origin}/subscription?payment=cancelled",
            # Store metadata to identify user + exam in webhook
            metadata={
                "user_id": current_user.id,
                "exam_id": exam_id,
                "email": current_user.email,
            },
            customer_email=current_user.email,
        )
        
        logger.info("Created Stripe checkout session %s for user %s exam %s", 
                   checkout_session.id, current_user.id, exam_id)
        
        return {"checkout_url": checkout_session.url}
    
    except stripe.error.StripeError as exc:
        logger.error("Stripe error creating checkout session: %s", exc)
        raise HTTPException(status_code=500, detail="Payment processing error")
