"""Access schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class AccessBase(BaseModel):
    """Base access schema"""
    user_id: int
    granted_by: int


class AccessCreate(AccessBase):
    """Create access request"""
    pass


class AccessResponse(AccessBase):
    """Access response"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
