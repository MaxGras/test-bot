"""User repository - specific data access for users"""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.user import User
from ..schemas.user import UserCreate
from .base import Repository


class UserRepository(Repository[User, UserCreate]):
    """User repository with custom queries"""

    def __init__(self, session: AsyncSession):
        super().__init__(session, User)

    async def get_by_telegram_id(self, telegram_id: int) -> Optional[User]:
        """Get user by Telegram ID"""
        result = await self.session.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        return result.scalars().first()

    async def get_by_role(self, role: str, skip: int = 0, limit: int = 100) -> tuple[list[User], int]:
        """Get users by role with pagination"""
        from ..models.user import UserRole

        # Get total count
        result = await self.session.execute(
            select(User).where(User.role == UserRole(role))
        )
        total = len(result.scalars().all())

        # Get paginated results
        result = await self.session.execute(
            select(User).where(User.role == UserRole(role)).offset(skip).limit(limit)
        )
        return result.scalars().all(), total
