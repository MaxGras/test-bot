"""Developer schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class DeveloperBase(BaseModel):
    """Base developer schema"""
    name: str
    bio: Optional[str] = None
    is_available: bool = True


class DeveloperCreate(DeveloperBase):
    """Create developer request"""
    user_id: int


class DeveloperUpdate(BaseModel):
    """Update developer request"""
    name: Optional[str] = None
    bio: Optional[str] = None
    is_available: Optional[bool] = None


class DeveloperResponse(DeveloperBase):
    """Developer response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DeveloperListResponse(BaseModel):
    """Developer list response"""
    total: int
    items: List[DeveloperResponse]
