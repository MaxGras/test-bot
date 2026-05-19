"""Notification settings endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ....schemas.notification_settings import (
    NotificationSettingsCreate,
    NotificationSettingsUpdate,
    NotificationSettingsResponse,
)
from ....services import NotificationService
from .dependencies import get_notification_service

router = APIRouter(prefix="/notification-settings", tags=["notifications"])


@router.post("", response_model=NotificationSettingsResponse, status_code=status.HTTP_201_CREATED)
async def create_settings(
    settings_in: NotificationSettingsCreate,
    service: NotificationService = Depends(get_notification_service),
):
    """Create notification settings"""
    try:
        return await service.create_settings(settings_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Settings creation failed")


@router.get("/{settings_id}", response_model=NotificationSettingsResponse)
async def get_settings(
    settings_id: int, service: NotificationService = Depends(get_notification_service)
):
    """Get notification settings by ID"""
    settings = await service.get_settings(settings_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings


@router.get("")
async def list_settings(
    sales_manager_id: int = Query(None),
    developer_id: int = Query(None),
    service: NotificationService = Depends(get_notification_service),
):
    """List notification settings"""
    return await service.list_settings(sales_manager_id, developer_id)


@router.patch("/{settings_id}", response_model=NotificationSettingsResponse)
async def update_settings(
    settings_id: int,
    settings_in: NotificationSettingsUpdate,
    service: NotificationService = Depends(get_notification_service),
):
    """Update notification settings"""
    settings = await service.update_settings(settings_id, settings_in)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings


@router.post("/{sales_manager_id}/{developer_id}/toggle")
async def toggle_notifications(
    sales_manager_id: int,
    developer_id: int,
    service: NotificationService = Depends(get_notification_service),
):
    """Toggle notifications for manager and developer"""
    return await service.toggle_notifications(sales_manager_id, developer_id)
