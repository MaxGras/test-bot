"""API v1 module"""
from fastapi import APIRouter

from .endpoints import (
    users_router,
    developers_router,
    calls_router,
    access_router,
    notifications_router,
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(users_router)
api_router.include_router(developers_router)
api_router.include_router(calls_router)
api_router.include_router(access_router)
api_router.include_router(notifications_router)

__all__ = ["api_router"]
