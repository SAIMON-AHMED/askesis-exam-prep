# ===== Build Stage =====
FROM python:3.12-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc \
  && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt


# ===== Runtime Stage =====
FROM python:3.12-slim

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python packages from builder into the runtime Python installation.
COPY --from=builder /install /usr/local

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PIP_NO_CACHE_DIR=1 \
  PIP_DISABLE_PIP_VERSION_CHECK=1

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f "http://localhost:${PORT:-8000}/health" || exit 1

EXPOSE 8000

# Apply database migrations before starting the production server.
CMD ["sh", "-c", "alembic upgrade head && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}"]
