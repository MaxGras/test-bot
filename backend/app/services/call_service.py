"""Call service - business logic for calls"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.call_repository import CallRepository
from ..schemas.call import CallCreate, CallUpdate


class CallService:
    """Call business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = CallRepository(session)

    async def create_call(self, call_in: CallCreate):
        """Create a new call"""
        return await self.repo.create(call_in)

    async def get_call(self, call_id: int):
        """Get call by ID"""
        return await self.repo.get(call_id)

    async def list_calls(
        self,
        skip: int = 0,
        limit: int = 100,
        developer_id: int = None,
        sales_manager_id: int = None,
    ):
        """List calls with optional filters"""
        if developer_id and sales_manager_id:
            calls, total = await self.repo.get_by_developer_and_manager(
                developer_id, sales_manager_id, skip, limit
            )
        elif developer_id:
            calls, total = await self.repo.get_by_developer(developer_id, skip, limit)
        elif sales_manager_id:
            calls, total = await self.repo.get_by_sales_manager(
                sales_manager_id, skip, limit
            )
        else:
            calls, total = await self.repo.get_all(skip, limit)

        return {"total": total, "items": calls}

    async def update_call(self, call_id: int, call_in: CallUpdate):
        """Update call"""
        return await self.repo.update(call_id, call_in.dict(exclude_unset=True))

    async def delete_call(self, call_id: int):
        """Delete call"""
        return await self.repo.delete(call_id)
