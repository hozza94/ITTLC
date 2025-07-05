"""
헌금 관리 API 엔드포인트
"""
from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from datetime import date

from app.schemas import (
    OfferingType, OfferingTypeCreate, OfferingTypeUpdate,
    Offering, OfferingCreate, OfferingUpdate, OfferingListResponse,
    OfferingStatistics, MemberOfferingSummary, OfferingSearchFilter
)
from app.services.offering_service import offering_service

router = APIRouter()

# 헌금 종류 관련 엔드포인트
@router.get("/types", response_model=List[OfferingType])
async def get_offering_types(
    active_only: bool = Query(default=True, description="활성 헌금 종류만 조회")
):
    """헌금 종류 목록 조회"""
    try:
        types = await offering_service.get_offering_types(active_only=active_only)
        return types
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 종류 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/types", response_model=dict)
async def create_offering_type(type_data: OfferingTypeCreate):
    """헌금 종류 생성"""
    try:
        result = await offering_service.create_offering_type(type_data.dict())
        return {"message": "헌금 종류가 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 종류 생성 중 오류가 발생했습니다: {str(e)}"
        )

# 헌금 기록 관련 엔드포인트
@router.get("/", response_model=List[Offering])
async def get_offerings(
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=20, ge=1, le=100, description="가져올 항목 수"),
    member_id: Optional[int] = Query(default=None, description="성도 ID 필터"),
    offering_type: Optional[str] = Query(default=None, description="헌금 종류 필터"),
    start_date: Optional[date] = Query(default=None, description="시작 날짜"),
    end_date: Optional[date] = Query(default=None, description="종료 날짜")
):
    """헌금 기록 목록 조회"""
    try:
        offerings = await offering_service.get_offerings(
            skip=skip,
            limit=limit,
            member_id=member_id,
            offering_type=offering_type,
            start_date=start_date,
            end_date=end_date
        )
        return offerings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 기록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/", response_model=dict)
async def create_offering(offering_data: OfferingCreate):
    """헌금 기록 생성"""
    try:
        result = await offering_service.create_offering(offering_data.dict())
        return {"message": "헌금 기록이 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 기록 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{offering_id}", response_model=Offering)
async def get_offering(offering_id: int):
    """헌금 기록 상세 조회"""
    try:
        offering = await offering_service.get_offering_by_id(offering_id)
        if not offering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="헌금 기록을 찾을 수 없습니다"
            )
        return offering
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 기록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/{offering_id}", response_model=Offering)
async def update_offering(offering_id: int, offering_data: OfferingUpdate):
    """헌금 기록 수정"""
    try:
        updated_offering = await offering_service.update_offering(
            offering_id, 
            offering_data.dict(exclude_unset=True)
        )
        if not updated_offering:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="헌금 기록을 찾을 수 없습니다"
            )
        return updated_offering
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 기록 수정 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/{offering_id}", response_model=dict)
async def delete_offering(offering_id: int):
    """헌금 기록 삭제"""
    try:
        success = await offering_service.delete_offering(offering_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="헌금 기록을 찾을 수 없습니다"
            )
        return {"message": "헌금 기록이 삭제되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 기록 삭제 중 오류가 발생했습니다: {str(e)}"
        )

# 헌금 통계 관련 엔드포인트
@router.get("/statistics/period", response_model=OfferingStatistics)
async def get_offering_statistics(
    start_date: date = Query(..., description="시작 날짜"),
    end_date: date = Query(..., description="종료 날짜")
):
    """기간별 헌금 통계 조회"""
    try:
        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="시작 날짜는 종료 날짜보다 앞서야 합니다"
            )
        
        statistics = await offering_service.get_offering_statistics(start_date, end_date)
        return statistics
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"헌금 통계 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/statistics/member/{member_id}", response_model=List[MemberOfferingSummary])
async def get_member_offering_summary(
    member_id: int,
    year: int = Query(..., description="조회할 연도", ge=2000, le=2100)
):
    """성도별 헌금 요약 조회"""
    try:
        summary = await offering_service.get_member_offering_summary(member_id, year)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"성도별 헌금 요약 조회 중 오류가 발생했습니다: {str(e)}"
        ) 