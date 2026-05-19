"""User schemas"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration"""
    ADMIN = "admin"
    DEVELOPER = "developer"
    SALES_MANAGER = "sales_manager"


class UserBase(BaseModel):
    """Base user schema"""
    telegram_id: int
    role: UserRole
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    """Create user request"""
    pass


class UserUpdate(BaseModel):
    """Update user request"""
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """User response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """User list response"""
    total: int
    items: List[UserResponse]
