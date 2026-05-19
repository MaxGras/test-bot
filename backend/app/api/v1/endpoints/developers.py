"""Developer endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status

from ....schemas.developer import DeveloperCreate, DeveloperUpdate, DeveloperResponse, DeveloperListResponse
from ....services import DeveloperService
from .dependencies import get_developer_service

router = APIRouter(prefix="/developers", tags=["developers"])


@router.post("", response_model=DeveloperResponse, status_code=status.HTTP_201_CREATED)
async def create_developer(
    developer_in: DeveloperCreate, service: DeveloperService = Depends(get_developer_service)
):
    """Create a new developer"""
    try:
        return await service.create_developer(developer_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Developer creation failed")


@router.get("/{developer_id}", response_model=DeveloperResponse)
async def get_developer(
    developer_id: int, service: DeveloperService = Depends(get_developer_service)
):
    """Get developer by ID"""
    developer = await service.get_developer(developer_id)
    if not developer:
        raise HTTPException(status_code=404, detail="Developer not found")
    return developer


@router.get("", response_model=DeveloperListResponse)
async def list_developers(
    skip: int = 0, limit: int = 100, service: DeveloperService = Depends(get_developer_service)
):
    """List all developers"""
    return await service.list_developers(skip, limit)


@router.patch("/{developer_id}", response_model=DeveloperResponse)
async def update_developer(
    developer_id: int,
    developer_in: DeveloperUpdate,
    service: DeveloperService = Depends(get_developer_service),
):
    """Update developer"""
    developer = await service.update_developer(developer_id, developer_in)
    if not developer:
        raise HTTPException(status_code=404, detail="Developer not found")
    return developer


@router.delete("/{developer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_developer(
    developer_id: int, service: DeveloperService = Depends(get_developer_service)
):
    """Delete developer"""
    success = await service.delete_developer(developer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Developer not found")
