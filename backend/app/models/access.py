"""Access model"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from datetime import datetime

from . import Base


class Access(Base):
    """Access table - tracks who granted access to whom"""
    __tablename__ = "access"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    granted_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Access user_id={self.user_id}>"
