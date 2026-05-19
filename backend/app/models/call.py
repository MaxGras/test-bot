"""Call model"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime

from . import Base


class Call(Base):
    """Call table"""
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    developer_id = Column(Integer, ForeignKey("developers.id", ondelete="CASCADE"), nullable=False)
    sales_manager_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    call_link = Column(String(500), nullable=True)
    salary_fork = Column(String(255), nullable=True)
    job_post_link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Call {self.title} {self.start_time}>"
