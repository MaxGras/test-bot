"""Notification Settings repository"""
from typing import List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.notification_settings import NotificationSettings
from ..schemas.notification_settings import NotificationSettingsCreate
from .base import Repository


class NotificationSettingsRepository(Repository[NotificationSettings, NotificationSettingsCreate]):
    """Notification Settings repository with custom queries"""

    def __init__(self, session: AsyncSession):
        super().__init__(session, NotificationSettings)

    async def get_by_manager_and_developer(
        self, sales_manager_id: int, developer_id: int
    ) -> Optional[NotificationSettings]:
        """Get notification settings for specific manager and developer"""
        result = await self.session.execute(
            select(NotificationSettings).where(
                and_(
                    NotificationSettings.sales_manager_id == sales_manager_id,
                    NotificationSettings.developer_id == developer_id,
                )
            )
        )
        return result.scalars().first()

    async def get_by_developer(self, developer_id: int) -> List[NotificationSettings]:
        """Get all notification settings for a developer"""
        result = await self.session.execute(
            select(NotificationSettings).where(
                NotificationSettings.developer_id == developer_id
            )
        )
        return result.scalars().all()

    async def get_by_manager(self, sales_manager_id: int) -> List[NotificationSettings]:
        """Get all notification settings for a manager"""
        result = await self.session.execute(
            select(NotificationSettings).where(
                NotificationSettings.sales_manager_id == sales_manager_id
            )
        )
        return result.scalars().all()
