"""Notification service - business logic for notifications"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.notification_settings_repository import NotificationSettingsRepository
from ..schemas.notification_settings import (
    NotificationSettingsCreate,
    NotificationSettingsUpdate,
)


class NotificationService:
    """Notification business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = NotificationSettingsRepository(session)

    async def create_settings(self, settings_in: NotificationSettingsCreate):
        """Create notification settings"""
        return await self.repo.create(settings_in)

    async def get_settings(self, settings_id: int):
        """Get notification settings by ID"""
        return await self.repo.get(settings_id)

    async def get_settings_by_manager_and_developer(
        self, sales_manager_id: int, developer_id: int
    ):
        """Get notification settings for manager and developer"""
        return await self.repo.get_by_manager_and_developer(
            sales_manager_id, developer_id
        )

    async def list_settings(
        self, sales_manager_id: int = None, developer_id: int = None
    ):
        """List notification settings"""
        if sales_manager_id:
            settings = await self.repo.get_by_manager(sales_manager_id)
        elif developer_id:
            settings = await self.repo.get_by_developer(developer_id)
        else:
            settings, _ = await self.repo.get_all()

        return {"total": len(settings), "items": settings}

    async def update_settings(
        self, settings_id: int, settings_in: NotificationSettingsUpdate
    ):
        """Update notification settings"""
        return await self.repo.update(
            settings_id, settings_in.dict(exclude_unset=True)
        )

    async def toggle_notifications(self, sales_manager_id: int, developer_id: int):
        """Toggle notifications for manager and developer"""
        settings = await self.repo.get_by_manager_and_developer(
            sales_manager_id, developer_id
        )

        if settings:
            settings.is_enabled = not settings.is_enabled
            await self.repo.session.commit()
            await self.repo.session.refresh(settings)
            return settings

        # Create if doesn't exist
        new_settings = await self.repo.create(
            NotificationSettingsCreate(
                sales_manager_id=sales_manager_id,
                developer_id=developer_id,
                is_enabled=True,
            )
        )
        return new_settings
