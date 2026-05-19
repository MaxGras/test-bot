"""User model"""
from sqlalchemy import Column, Integer, BigInteger, String, Boolean, DateTime, Enum as SQLEnum
from datetime import datetime
import enum

from . import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    ADMIN = "admin"
    DEVELOPER = "developer"
    SALES_MANAGER = "sales_manager"


class User(Base):
    """User table"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False, index=True)
    role = Column(SQLEnum(UserRole), nullable=False)
    username = Column(String(255), nullable=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<User {self.telegram_id} ({self.role})>"
