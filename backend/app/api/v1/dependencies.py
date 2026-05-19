"""Shared dependencies for API endpoints"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ...core import get_db_session
from ...services import (
    UserService,
    DeveloperService,
    CallService,
    AccessService,
    NotificationService,
)


async def get_user_service(session: AsyncSession = Depends(get_db_session)) -> UserService:
    """Dependency to get UserService"""
    return UserService(session)


async def get_developer_service(
    session: AsyncSession = Depends(get_db_session),
) -> DeveloperService:
    """Dependency to get DeveloperService"""
    return DeveloperService(session)


async def get_call_service(session: AsyncSession = Depends(get_db_session)) -> CallService:
    """Dependency to get CallService"""
    return CallService(session)


async def get_access_service(session: AsyncSession = Depends(get_db_session)) -> AccessService:
    """Dependency to get AccessService"""
    return AccessService(session)


async def get_notification_service(
    session: AsyncSession = Depends(get_db_session),
) -> NotificationService:
    """Dependency to get NotificationService"""
    return NotificationService(session)
