"""Authentication endpoints: register, login, logout."""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, oauth2_scheme
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import TokenResponse, UserLogin, UserOut, UserRegister

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


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


@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme), user: User = Depends(get_current_user)) -> dict:
    # Stateless JWT: client discards the token. A token blocklist could be added for revocation.
    logger.info("User logged out: %s", user.id)
    return {"detail": "Logged out successfully"}
