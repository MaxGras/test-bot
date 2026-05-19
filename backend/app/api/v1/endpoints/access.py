"""Access endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ....schemas.access import AccessCreate, AccessResponse
from ....services import AccessService
from .dependencies import get_access_service

router = APIRouter(prefix="/access", tags=["access"])


@router.post("", response_model=AccessResponse, status_code=status.HTTP_201_CREATED)
async def grant_access(
    access_in: AccessCreate, service: AccessService = Depends(get_access_service)
):
    """Grant access to a user"""
    try:
        return await service.grant_access(access_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Access grant failed")


@router.get("/{access_id}", response_model=AccessResponse)
async def get_access(access_id: int, service: AccessService = Depends(get_access_service)):
    """Get access record by ID"""
    access = await service.get_access(access_id)
    if not access:
        raise HTTPException(status_code=404, detail="Access not found")
    return access


@router.get("")
async def list_access(
    user_id: int = Query(None),
    skip: int = 0,
    limit: int = 100,
    service: AccessService = Depends(get_access_service),
):
    """List access records"""
    return await service.list_access(user_id, skip, limit)


@router.delete("/{access_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_access(access_id: int, service: AccessService = Depends(get_access_service)):
    """Revoke access"""
    success = await service.revoke_access(access_id)
    if not success:
        raise HTTPException(status_code=404, detail="Access not found")
