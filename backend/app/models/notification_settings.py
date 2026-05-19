"""Notification Settings model"""
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime

from . import Base


class NotificationSettings(Base):
    """Notification settings - per developer per sales manager"""
    __tablename__ = "notification_settings"

    id = Column(Integer, primary_key=True, index=True)
    sales_manager_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    developer_id = Column(Integer, ForeignKey("developers.id", ondelete="CASCADE"), nullable=False)
    is_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("sales_manager_id", "developer_id", name="uq_manager_dev_notif"),
    )

    def __repr__(self) -> str:
        return f"<NotificationSettings manager_id={self.sales_manager_id} dev_id={self.developer_id}>"
