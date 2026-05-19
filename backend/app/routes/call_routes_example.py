"""
Call scheduling routes - Example implementation based on old-bot flows.

This file demonstrates how to use CallSchedulingService in FastAPI endpoints.
These routes follow the patterns from the old-bot Telegram handlers.

Routes are structured around the user flows documented in OLD_BOT_DOCUMENTATION.md
"""

from datetime import datetime, date, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.call import (
    CallCreate, CallUpdate, CallResponse,
    CreateCallRequest, CallConflictResponse
)
from ..schemas.developer import DeveloperResponse
from ..services.call_scheduling_service import (
    CallSchedulingService,
    schedule_call_with_notifications,
    validate_and_create_call
)
from ..dependencies import get_db
from ..auth import get_current_user
from ..models.user import User, UserRole

router = APIRouter(prefix="/api/calls", tags=["calls"])


# ============================================================================
# CALL MANAGEMENT ENDPOINTS
# ============================================================================

@router.post("", response_model=CallResponse)
async def create_call(
    call_in: CreateCallRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new call with validation.
    Old bot equivalent: setup_call_handle_job_post() -> save_call_with_extras()

    Flow:
    1. Validate call title, duration, time
    2. Check for time conflicts
    3. Create call if no conflicts
    4. Get subscribed admins for notifications

    Request:
    {
        "developer_id": 1,
        "start_time": "2026-05-20T14:00:00",
        "duration_minutes": 60,
        "title": "Company Inc - Interview",
        "call_link": "https://zoom.us/...",
        "salary_fork": "80k-120k",
        "job_post_link": "https://jobs.example.com/..."
    }
    """
    service = CallSchedulingService(db)

    start_time = call_in.start_time
    success, message, call = await validate_and_create_call(
        db,
        developer_id=call_in.developer_id,
        sales_manager_id=current_user.id,
        start_time=start_time,
        duration_minutes=call_in.duration_minutes,
        title=call_in.title,
        call_link=call_in.call_link,
        salary_fork=call_in.salary_fork,
        job_post_link=call_in.job_post_link
    )

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return CallResponse.from_orm(call)


@router.post("/{call_id}/cancel", response_model=dict)
async def cancel_call(
    call_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancel a call (delete it).
    Old bot equivalent: suspend_call_execute_delete()

    Permissions:
    - Sales Manager: Can only delete their own calls
    - Admin: Can delete any call
    """
    service = CallSchedulingService(db)
    call = await service.get_call(call_id)

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    # Check permissions
    if current_user.role == UserRole.SALES_MANAGER:
        if call.sales_manager_id != current_user.id:
            raise HTTPException(status_code=403, detail="Cannot delete other's calls")

    success = await service.delete_call(call_id)
    if success:
        return {"message": "✅ Call deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete call")


@router.get("/{call_id}", response_model=CallResponse)
async def get_call(
    call_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get call details"""
    service = CallSchedulingService(db)
    call = await service.get_call(call_id)

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    return CallResponse.from_orm(call)


# ============================================================================
# CONFLICT DETECTION
# ============================================================================

@router.post("/check-availability", response_model=dict)
async def check_availability(
    developer_id: int = Query(...),
    start_time: datetime = Query(...),
    duration_minutes: int = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Check if time slot is available for developer.
    Old bot equivalent: setup_call_handle_duration() conflict check

    Returns:
    - available: bool
    - conflict: Call details if conflict found
    """
    service = CallSchedulingService(db)

    end_time = start_time + timedelta(minutes=duration_minutes)
    conflict = await service.check_time_conflict(developer_id, start_time, end_time)

    if conflict:
        return {
            "available": False,
            "conflict": {
                "title": conflict.title,
                "start_time": conflict.start_time,
                "end_time": conflict.end_time
            }
        }

    return {"available": True}


# ============================================================================
# SCHEDULE VIEWING - Following old-bot display patterns
# ============================================================================

@router.get("/developer/{developer_id}/schedule", response_model=List[CallResponse])
async def get_developer_schedule(
    developer_id: int,
    date_str: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all calls for developer on specific date.
    Old bot equivalent: show_admin_schedule() or show_schedule()

    Display format (from old-bot):
    📅 Schedule for {Developer Name}
    {Date}

    • {Account} - HH:mm to HH:mm
    • {Account} - HH:mm to HH:mm
    """
    service = CallSchedulingService(db)

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    calls = await service.get_conflicts_on_date(developer_id, target_date)
    return [CallResponse.from_orm(call) for call in calls]


@router.get("/manager/my-calls", response_model=List[CallResponse])
async def get_my_calls(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all calls booked by current sales manager.
    Old bot equivalent: All calls in suspend_call_date flow
    """
    if current_user.role != UserRole.SALES_MANAGER:
        raise HTTPException(status_code=403, detail="Sales managers only")

    service = CallSchedulingService(db)
    calls = await service.get_manager_all_calls(current_user.id)
    return [CallResponse.from_orm(call) for call in calls]


@router.get("/manager/{manager_id}/calls-by-date", response_model=List[CallResponse])
async def get_manager_calls_by_date(
    developer_id: int,
    date_str: str = Query(..., description="Date in YYYY-MM-DD format"),
    manager_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get calls booked by manager on specific date for developer.
    Old bot equivalent: show_manager_calls() - "Your calls on {date}"
    """
    service = CallSchedulingService(db)

    # If manager_id not provided, use current user
    if manager_id is None:
        manager_id = current_user.id

    # Can only view own calls unless admin
    if current_user.role != UserRole.ADMIN and manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot view other's calls")

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    calls = await service.get_manager_calls_on_date(developer_id, manager_id, target_date)
    return [CallResponse.from_orm(call) for call in calls]


# ============================================================================
# NOTIFICATIONS
# ============================================================================

@router.post("/developer/{developer_id}/notifications/toggle", response_model=dict)
async def toggle_notifications(
    developer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Toggle notifications for a developer.
    Old bot equivalent: toggle_notifications() / toggle_developer_notifications()

    Returns:
    {
        "enabled": true/false,
        "label": "🔔 Notifications: ON" / "🔔 Notifications: OFF"
    }
    """
    service = CallSchedulingService(db)

    new_status = await service.toggle_notifications(current_user.id, developer_id)
    label = "🔔 Notifications: ON" if new_status else "🔔 Notifications: OFF"

    return {
        "enabled": new_status,
        "label": label
    }


@router.get("/developer/{developer_id}/notifications/status", response_model=dict)
async def get_notification_status(
    developer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current notification status for developer.
    Old bot equivalent: Check in manager_menu / admin detail view
    """
    service = CallSchedulingService(db)
    enabled = await service.is_notifications_enabled(current_user.id, developer_id)

    return {
        "enabled": enabled,
        "label": "🔔 Notifications: ON" if enabled else "🔔 Notifications: OFF"
    }


@router.get("/developer/{developer_id}/subscribed-admins", response_model=List[dict])
async def get_subscribed_admins(
    developer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get admins subscribed to notifications for developer.
    Old bot equivalent: Used in notify_admins_new_call()

    Used to determine who to send call notifications to.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins only")

    service = CallSchedulingService(db)
    admins = await service.get_subscribed_admins_for_developer(developer_id)

    return [
        {
            "id": admin.id,
            "telegram_id": admin.telegram_id,
            "name": admin.first_name or admin.username
        }
        for admin in admins
    ]


# ============================================================================
# DEVELOPER INFORMATION
# ============================================================================

@router.get("/developers", response_model=List[DeveloperResponse])
async def get_developers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of all developers.
    Old bot equivalent: get_developers_keyboard() / admin_view_schedule_start()

    Display format (for menus):
    👨‍💻 {Developer Name}
    👨‍💻 {Developer Name}
    """
    service = CallSchedulingService(db)
    developers = await service.get_all_developers()
    return [DeveloperResponse.from_orm(dev) for dev in developers]


# ============================================================================
# STATISTICS (Admin views)
# ============================================================================

@router.get("/stats/developer/{developer_id}", response_model=dict)
async def get_developer_stats(
    developer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get statistics for developer.
    Old bot equivalent: View in admin detail screen
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins only")

    service = CallSchedulingService(db)
    call_count = await service.get_developer_call_count(developer_id)

    return {
        "developer_id": developer_id,
        "total_calls": call_count
    }


@router.get("/stats/manager/{manager_id}", response_model=dict)
async def get_manager_stats(
    manager_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get statistics for sales manager.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins only")

    service = CallSchedulingService(db)
    call_count = await service.get_manager_call_count(manager_id)

    return {
        "manager_id": manager_id,
        "total_calls": call_count
    }


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

@router.post("/validate", response_model=dict)
async def validate_call_data(
    title: str = Query(...),
    duration_minutes: int = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate call parameters before creation.
    Old bot equivalent: Step-by-step validation in handlers

    Checks:
    - Title not empty (Account name)
    - Duration is valid (30, 60, or 90 minutes)
    """
    service = CallSchedulingService(db)

    errors = []

    if not service.validate_call_title(title):
        errors.append("Account name cannot be empty")

    if not service.validate_duration_minutes(duration_minutes):
        errors.append("Duration must be 30, 60, or 90 minutes")

    if errors:
        raise HTTPException(status_code=400, detail={"errors": errors})

    return {"valid": True}
