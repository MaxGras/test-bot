"""Application configuration using Pydantic settings"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings - loads from .env file"""

    # API Configuration
    API_TITLE: str = "Telegram Bot API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "REST API for developer call scheduling"
    API_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://tg_bot_user:tg_bot_password@localhost:5432/tg_bot_db"

    # Security
    ADMIN_ID: int
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Bot
    BOT_TOKEN: str = ""
    BOT_WEBHOOK_URL: str = "http://localhost:8000/webhook/telegram"

    # Application
    TIMEZONE: str = "ETC/GMT-2"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"  # development, staging, production

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
