"""Access service - business logic for access control"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.access_repository import AccessRepository
from ..schemas.access import AccessCreate


class AccessService:
    """Access business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = AccessRepository(session)

    async def grant_access(self, access_in: AccessCreate):
        """Grant access to a user"""
        return await self.repo.create(access_in)

    async def get_access(self, access_id: int):
        """Get access by ID"""
        return await self.repo.get(access_id)

    async def list_access(self, user_id: int = None, skip: int = 0, limit: int = 100):
        """List access records"""
        if user_id:
            access_list = await self.repo.get_by_user(user_id)
            return {"total": len(access_list), "items": access_list}

        access_list, total = await self.repo.get_all(skip, limit)
        return {"total": total, "items": access_list}

    async def revoke_access(self, access_id: int):
        """Revoke access"""
        return await self.repo.delete(access_id)
