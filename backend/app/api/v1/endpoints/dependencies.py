"""Import dependencies from parent"""
from ..dependencies import (
    get_user_service,
    get_developer_service,
    get_call_service,
    get_access_service,
    get_notification_service,
)

__all__ = [
    "get_user_service",
    "get_developer_service",
    "get_call_service",
    "get_access_service",
    "get_notification_service",
]
