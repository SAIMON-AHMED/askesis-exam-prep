"""FastAPI application entrypoint."""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.routers import auth, exam, practice, progress, questions, study_plan, subscription, analytics, profile, admin, essay, ai_assistant, purchases
from app.core.config import get_settings
from app.core.error_handlers import register_error_handlers

logging.basicConfig(level=logging.INFO)
settings = get_settings()

app = FastAPI(title="Askesis API", version="0.1.0")

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Build CORS origins list
cors_origins = [
    "http://localhost:3002",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    settings.frontend_origin,
]
# Add www version for production domain
if "askesisprep.com" in settings.frontend_origin:
    cors_origins.append("https://www.askesisprep.com")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(essay.router)
app.include_router(practice.router)
app.include_router(progress.router)
app.include_router(study_plan.router)
app.include_router(subscription.router)
app.include_router(purchases.router)
app.include_router(analytics.router)
app.include_router(profile.router)
app.include_router(exam.router)
app.include_router(admin.router)
app.include_router(ai_assistant.router)

# Register error handlers
register_error_handlers(app)


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "version": "0.1.0"}
