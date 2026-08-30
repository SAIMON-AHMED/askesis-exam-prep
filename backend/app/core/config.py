"""Application configuration loaded from environment variables."""
from functools import lru_cache
from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://examprep_user:examprep_pass@localhost:5432/examprepai"

    jwt_secret_key: str = "insecure-dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 5_256_000
    redis_url: str = "redis://localhost:6379/0"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    ai_service_api_key: str = Field(
        default="", validation_alias=AliasChoices("AI_SERVICE_API_KEY", "CHATGPT_API_KEY")
    )
    ai_service_model: str = Field(
        default="gpt-4o-mini", validation_alias=AliasChoices("AI_SERVICE_MODEL", "CHATGPT_MODEL")
    )

    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""

    resend_api_key: str = ""
    sendgrid_api_key: str = ""
    email_from: str = "contact@askesisprep.com"

    environment: str = "development"
    frontend_origin: str = "http://localhost:3000"

    @field_validator("database_url", mode="before")
    @classmethod
    def use_psycopg3_driver(cls, value: str) -> str:
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
