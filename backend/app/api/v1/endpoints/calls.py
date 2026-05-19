"""Call endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ....schemas.call import CallCreate, CallUpdate, CallResponse, CallListResponse
from ....services import CallService
from .dependencies import get_call_service

router = APIRouter(prefix="/calls", tags=["calls"])


@router.post("", response_model=CallResponse, status_code=status.HTTP_201_CREATED)
async def create_call(call_in: CallCreate, service: CallService = Depends(get_call_service)):
    """Create a new call"""
    try:
        return await service.create_call(call_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Call creation failed")


@router.get("/{call_id}", response_model=CallResponse)
async def get_call(call_id: int, service: CallService = Depends(get_call_service)):
    """Get call by ID"""
    call = await service.get_call(call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call


@router.get("", response_model=CallListResponse)
async def list_calls(
    skip: int = 0,
    limit: int = 100,
    developer_id: int = Query(None),
    sales_manager_id: int = Query(None),
    service: CallService = Depends(get_call_service),
):
    """List calls with optional filters"""
    return await service.list_calls(skip, limit, developer_id, sales_manager_id)


@router.patch("/{call_id}", response_model=CallResponse)
async def update_call(
    call_id: int, call_in: CallUpdate, service: CallService = Depends(get_call_service)
):
    """Update call"""
    call = await service.update_call(call_id, call_in)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call


@router.delete("/{call_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_call(call_id: int, service: CallService = Depends(get_call_service)):
    """Delete call"""
    success = await service.delete_call(call_id)
    if not success:
        raise HTTPException(status_code=404, detail="Call not found")
