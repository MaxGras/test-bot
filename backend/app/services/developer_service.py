"""Developer service - business logic for developers"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.developer_repository import DeveloperRepository
from ..schemas.developer import DeveloperCreate, DeveloperUpdate


class DeveloperService:
    """Developer business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = DeveloperRepository(session)

    async def create_developer(self, developer_in: DeveloperCreate):
        """Create a new developer"""
        return await self.repo.create(developer_in)

    async def get_developer(self, developer_id: int):
        """Get developer by ID"""
        return await self.repo.get(developer_id)

    async def list_developers(self, skip: int = 0, limit: int = 100):
        """List all developers"""
        developers, total = await self.repo.get_all(skip, limit)
        return {"total": total, "items": developers}

    async def update_developer(self, developer_id: int, developer_in: DeveloperUpdate):
        """Update developer"""
        return await self.repo.update(developer_id, developer_in.dict(exclude_unset=True))

    async def delete_developer(self, developer_id: int):
        """Delete developer"""
        return await self.repo.delete(developer_id)
