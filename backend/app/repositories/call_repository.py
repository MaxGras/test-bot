"""Call repository"""
from typing import List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.call import Call
from ..schemas.call import CallCreate
from .base import Repository


class CallRepository(Repository[Call, CallCreate]):
    """Call repository with custom queries"""

    def __init__(self, session: AsyncSession):
        super().__init__(session, Call)

    async def get_by_developer(
        self, developer_id: int, skip: int = 0, limit: int = 100
    ) -> tuple[List[Call], int]:
        """Get calls for a specific developer"""
        result = await self.session.execute(
            select(Call).where(Call.developer_id == developer_id)
        )
        total = len(result.scalars().all())

        result = await self.session.execute(
            select(Call)
            .where(Call.developer_id == developer_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all(), total

    async def get_by_sales_manager(
        self, sales_manager_id: int, skip: int = 0, limit: int = 100
    ) -> tuple[List[Call], int]:
        """Get calls for a specific sales manager"""
        result = await self.session.execute(
            select(Call).where(Call.sales_manager_id == sales_manager_id)
        )
        total = len(result.scalars().all())

        result = await self.session.execute(
            select(Call)
            .where(Call.sales_manager_id == sales_manager_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all(), total

    async def get_by_developer_and_manager(
        self, developer_id: int, sales_manager_id: int, skip: int = 0, limit: int = 100
    ) -> tuple[List[Call], int]:
        """Get calls for specific developer and manager"""
        result = await self.session.execute(
            select(Call).where(
                and_(
                    Call.developer_id == developer_id,
                    Call.sales_manager_id == sales_manager_id,
                )
            )
        )
        total = len(result.scalars().all())

        result = await self.session.execute(
            select(Call)
            .where(
                and_(
                    Call.developer_id == developer_id,
                    Call.sales_manager_id == sales_manager_id,
                )
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all(), total
