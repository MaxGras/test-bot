"""API v1 endpoints"""
from .users import router as users_router
from .developers import router as developers_router
from .calls import router as calls_router
from .access import router as access_router
from .notifications import router as notifications_router

__all__ = [
    "users_router",
    "developers_router",
    "calls_router",
    "access_router",
    "notifications_router",
]
