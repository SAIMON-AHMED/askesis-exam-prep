"""Global error handling and exception middleware."""
import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import traceback

logger = logging.getLogger(__name__)


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str | None = None,
        details: dict | None = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "APP_ERROR"
        self.details = details or {}
        super().__init__(self.message)


class ValidationException(AppException):
    """Validation error."""

    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", details)


class AuthenticationException(AppException):
    """Authentication error."""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, "AUTH_ERROR")


class AuthorizationException(AppException):
    """Authorization error."""

    def __init__(self, message: str = "Access denied"):
        super().__init__(message, status.HTTP_403_FORBIDDEN, "FORBIDDEN")


class ResourceNotFoundException(AppException):
    """Resource not found."""

    def __init__(self, resource: str, resource_id: str | None = None):
        message = f"{resource} not found"
        if resource_id:
            message += f" (ID: {resource_id})"
        super().__init__(message, status.HTTP_404_NOT_FOUND, "NOT_FOUND")


class ConflictException(AppException):
    """Resource already exists."""

    def __init__(self, message: str):
        super().__init__(message, status.HTTP_409_CONFLICT, "CONFLICT")


class RateLimitException(AppException):
    """Rate limit exceeded."""

    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, status.HTTP_429_TOO_MANY_REQUESTS, "RATE_LIMITED")


class InternalServerException(AppException):
    """Internal server error."""

    def __init__(self, message: str = "An unexpected error occurred"):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR, "INTERNAL_ERROR")


def register_error_handlers(app: FastAPI):
    """Register global error handlers."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        logger.warning(
            f"App exception: {exc.error_code} - {exc.message}",
            extra={"status_code": exc.status_code, "details": exc.details},
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.error_code,
                "message": exc.message,
                "details": exc.details,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle Pydantic validation errors."""
        errors = []
        for error in exc.errors():
            field = ".".join(str(x) for x in error["loc"][1:])
            errors.append({
                "field": field,
                "message": error["msg"],
                "type": error["type"],
            })

        logger.warning(
            "Validation error",
            extra={"path": request.url.path, "errors": errors},
        )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "details": {"errors": errors},
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle unexpected exceptions."""
        error_id = str(id(exc))  # Unique error ID for tracking
        logger.error(
            f"Unexpected error {error_id}: {str(exc)}",
            extra={
                "error_id": error_id,
                "path": request.url.path,
                "method": request.method,
                "traceback": traceback.format_exc(),
            },
        )

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "INTERNAL_ERROR",
                "message": "An unexpected error occurred. Please contact support if the problem persists.",
                "error_id": error_id,
            },
        )
