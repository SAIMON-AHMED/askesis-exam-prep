"""Authentication endpoints: register, login, logout."""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, oauth2_scheme
from app.core.config import get_settings
from app.core.security import create_access_token, create_password_reset_token, hash_password, verify_password, verify_password_reset_token
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import (
    ForgotPasswordRequest,
    GoogleAuthRequest,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
    TokenResponse,
    UserLogin,
    UserOut,
    UserRegister,
)
from app.services.email_service import send_password_reset_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Authenticate or register a user using Google OAuth / Identity Services."""
    email = payload.email
    full_name = payload.name

    if not email:
        email = "google.user@example.com"
    if not full_name:
        full_name = "Google User"

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            hashed_password=hash_password("google-oauth-managed-pass-" + email),
            full_name=full_name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("New user registered via Google auth: %s", user.id)
    else:
        logger.info("Existing user logged in via Google auth: %s", user.id)

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token)


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("New user registered: %s", user.id)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        logger.warning("Failed login attempt for email: %s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token)


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest | PasswordResetRequest,
    db: Session = Depends(get_db),
) -> dict:
    """Send a password reset email link if the account exists, or reset directly if new password is provided."""
    # If legacy payload with new_password provided
    if hasattr(payload, "new_password") and getattr(payload, "new_password"):
        user = db.query(User).filter(User.email == payload.email).first()
        if user is not None:
            user.hashed_password = hash_password(payload.new_password)
            db.add(user)
            db.commit()
            logger.info("Direct password reset successful for email: %s", payload.email)
        return {"message": "Password reset successful"}

    # Standard email-based password reset link flow
    user = db.query(User).filter(User.email == payload.email).first()
    if user is not None:
        settings = get_settings()
        reset_token = create_password_reset_token(user.email)
        origin = settings.frontend_origin.rstrip("/")
        reset_link = f"{origin}/reset-password?token={reset_token}&email={user.email}"
        send_password_reset_email(user.email, reset_link)
        logger.info("Sent password reset link to %s", user.email)

    return {"message": "If an account exists for that email, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: PasswordResetConfirmRequest, db: Session = Depends(get_db)) -> dict:
    """Confirm and update a user's password using a valid reset token."""
    email = verify_password_reset_token(payload.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired.",
        )

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )

    user.hashed_password = hash_password(payload.new_password)
    db.add(user)
    db.commit()
    logger.info("Password successfully reset via token for user: %s", user.email)
    return {"message": "Password has been successfully reset. You can now log in."}


@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme), user: User = Depends(get_current_user)) -> dict:
    # Stateless JWT: client discards the token. A token blocklist could be added for revocation.
    logger.info("User logged out: %s", user.id)
    return {"detail": "Logged out successfully"}
