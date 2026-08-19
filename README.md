# Askesis

Adaptive AI-powered exam prep platform for SAT, ACT, GRE, GMAT, SHSAT, and Regents. MVP focuses on SAT Math.

## Architecture

- **Backend**: Python + FastAPI + SQLAlchemy (`/backend`)
- **Frontend**: Next.js (React) (`/frontend`)
- **Database**: PostgreSQL
- **AI layer**: OpenAI API for question generation, explanations, and study plans

## Backend setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # then fill in real secrets
alembic revision --autogenerate -m "init"
alembic upgrade head
uvicorn app.main:app --reload
```

Run tests:

```powershell
pytest
```

## Frontend setup

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

## Docker Compose (full stack)

```powershell
docker compose up --build
```

This starts Postgres, the FastAPI backend, the Next.js frontend, and an NGINX reverse proxy on port 80.

## Key backend modules

- `app/models/models.py` — SQLAlchemy models for all tables (users, exam_types, topics, questions, generated_questions, user_attempts, user_progress, study_plans, subscriptions)
- `app/services/question_generation.py` — AI question generation pipeline (prompt → LLM → JSON validation → math/consistency checks)
- `app/services/adaptive_engine.py` — Adaptive difficulty/topic recommendation engine
- `app/services/study_plan.py` — LLM-based weekly study plan generator
- `app/api/routers/` — REST endpoints for auth, questions, practice, progress, study-plan, subscription

## Security notes

- All secrets are loaded from environment variables (`.env`), never hardcoded.
- Passwords are hashed with bcrypt; auth uses JWT bearer tokens.
- Stripe webhook signatures are verified before processing events.
- CORS is restricted to the configured frontend origin.

## Next steps

- Add curated `questions` seed data per exam/topic.
- Expand `/exam` into a full timed multi-section experience.
- Add per-endpoint rate limiting and request logging middleware.
- Wire Stripe Checkout session creation into `/subscription/create`.
