"""Access repository"""
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.access import Access
from ..schemas.access import AccessCreate
from .base import Repository


class AccessRepository(Repository[Access, AccessCreate]):
    """Access repository with custom queries"""

    def __init__(self, session: AsyncSession):
        super().__init__(session, Access)

    async def get_by_user(self, user_id: int) -> List[Access]:
        """Get all access records for a user"""
        result = await self.session.execute(
            select(Access).where(Access.user_id == user_id)
        )
        return result.scalars().all()
