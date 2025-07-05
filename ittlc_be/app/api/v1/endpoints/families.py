"""
가족 관리 API 엔드포인트
"""
from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional

from app.schemas import (
    Family, FamilyCreate, FamilyUpdate, FamilyListResponse, FamilyDetail,
    FamilyMemberUpdate, FamilyMemberAdd
)
from app.services.family_service import family_service

router = APIRouter()

@router.get("/", response_model=List[Family])
async def get_families(
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=20, ge=1, le=100, description="가져올 항목 수")
):
    """가족 목록 조회"""
    try:
        families = await family_service.get_families(skip=skip, limit=limit)
        return families
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/", response_model=dict)
async def create_family(family_data: FamilyCreate):
    """가족 생성"""
    try:
        result = await family_service.create_family(family_data.dict())
        return {"message": "가족이 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{family_id}", response_model=Family)
async def get_family(family_id: int):
    """가족 상세 조회"""
    try:
        family = await family_service.get_family_by_id(family_id)
        if not family:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="가족을 찾을 수 없습니다"
            )
        return family
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{family_id}/members", response_model=List[dict])
async def get_family_members(family_id: int):
    """가족 구성원 목록 조회"""
    try:
        members = await family_service.get_family_members(family_id)
        return members
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 구성원 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/{family_id}", response_model=Family)
async def update_family(family_id: int, family_data: FamilyUpdate):
    """가족 정보 수정"""
    try:
        updated_family = await family_service.update_family(
            family_id, 
            family_data.dict(exclude_unset=True)
        )
        if not updated_family:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="가족을 찾을 수 없습니다"
            )
        return updated_family
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 정보 수정 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/{family_id}", response_model=dict)
async def delete_family(family_id: int):
    """가족 삭제"""
    try:
        success = await family_service.delete_family(family_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="가족을 찾을 수 없습니다"
            )
        return {"message": "가족이 삭제되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 삭제 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/{family_id}/members", response_model=dict)
async def add_member_to_family(family_id: int, member_data: FamilyMemberAdd):
    """가족에 구성원 추가"""
    try:
        success = await family_service.add_member_to_family(
            family_id, 
            member_data.member_id, 
            member_data.family_role
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="가족 구성원 추가에 실패했습니다"
            )
        return {"message": "가족 구성원이 추가되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 구성원 추가 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/members/{member_id}", response_model=dict)
async def remove_member_from_family(member_id: int):
    """가족에서 구성원 제거"""
    try:
        success = await family_service.remove_member_from_family(member_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="가족 구성원 제거에 실패했습니다"
            )
        return {"message": "가족 구성원이 제거되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"가족 구성원 제거 중 오류가 발생했습니다: {str(e)}"
        ) 