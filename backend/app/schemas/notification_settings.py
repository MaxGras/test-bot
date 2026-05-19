"""Notification settings schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class NotificationSettingsBase(BaseModel):
    """Base notification settings schema"""
    sales_manager_id: int
    developer_id: int
    is_enabled: bool = False


class NotificationSettingsCreate(NotificationSettingsBase):
    """Create notification settings request"""
    pass


class NotificationSettingsUpdate(BaseModel):
    """Update notification settings request"""
    is_enabled: Optional[bool] = None


class NotificationSettingsResponse(NotificationSettingsBase):
    """Notification settings response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
