"""Call schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class CallBase(BaseModel):
    """Base call schema"""
    developer_id: int
    sales_manager_id: int
    title: str
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None
    call_link: Optional[str] = None
    salary_fork: Optional[str] = None
    job_post_link: Optional[str] = None


class CallCreate(CallBase):
    """Create call request"""
    pass


class CallUpdate(BaseModel):
    """Update call request"""
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    notes: Optional[str] = None
    call_link: Optional[str] = None
    salary_fork: Optional[str] = None
    job_post_link: Optional[str] = None


class CallResponse(CallBase):
    """Call response"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CallListResponse(BaseModel):
    """Call list response"""
    total: int
    items: List[CallResponse]
