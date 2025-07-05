"""
기도 관리 API 엔드포인트
"""
from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from datetime import date

from app.schemas import (
    PrayerCategory, PrayerCategoryCreate, PrayerCategoryUpdate,
    Prayer, PrayerCreate, PrayerUpdate, PrayerListResponse,
    PrayerParticipant, PrayerParticipantCreate,
    PrayerComment, PrayerCommentCreate, PrayerCommentUpdate
)
from app.services.prayer_service_fixed import prayer_service

router = APIRouter()

# 기도 카테고리 관련 엔드포인트
@router.get("/categories", response_model=List[PrayerCategory])
async def get_prayer_categories(
    active_only: bool = Query(default=True, description="활성 카테고리만 조회")
):
    """기도 카테고리 목록 조회"""
    try:
        categories = await prayer_service.get_prayer_categories(active_only=active_only)
        return categories
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 카테고리 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/categories", response_model=dict)
async def create_prayer_category(category_data: PrayerCategoryCreate):
    """기도 카테고리 생성"""
    try:
        result = await prayer_service.create_prayer_category(category_data.dict())
        return {"message": "기도 카테고리가 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 카테고리 생성 중 오류가 발생했습니다: {str(e)}"
        )

# 기도 제목 관련 엔드포인트
@router.get("/", response_model=List[Prayer])
async def get_prayers(
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=20, ge=1, le=100, description="가져올 항목 수"),
    category: Optional[str] = Query(default=None, description="카테고리 필터"),
    status: Optional[str] = Query(default=None, description="상태 필터"),
    visibility: Optional[str] = Query(default=None, description="공개 범위 필터"),
    user_id: Optional[int] = Query(default=None, description="작성자 필터")
):
    """기도 제목 목록 조회"""
    try:
        prayers = await prayer_service.get_prayers(
            skip=skip, 
            limit=limit,
            category=category,
            status=status,
            visibility=visibility,
            user_id=user_id
        )
        return prayers
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 제목 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/", response_model=dict)
async def create_prayer(prayer_data: PrayerCreate):
    """기도 제목 생성"""
    try:
        result = await prayer_service.create_prayer(prayer_data.dict())
        return {"message": "기도 제목이 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 제목 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{prayer_id}", response_model=Prayer)
async def get_prayer(prayer_id: int):
    """기도 제목 상세 조회"""
    try:
        prayer = await prayer_service.get_prayer_by_id(prayer_id)
        if not prayer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="기도 제목을 찾을 수 없습니다"
            )
        return prayer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 제목 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/{prayer_id}", response_model=Prayer)
async def update_prayer(prayer_id: int, prayer_data: PrayerUpdate):
    """기도 제목 수정"""
    try:
        updated_prayer = await prayer_service.update_prayer(prayer_id, prayer_data.dict(exclude_unset=True))
        if not updated_prayer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="기도 제목을 찾을 수 없습니다"
            )
        return updated_prayer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 제목 수정 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/{prayer_id}", response_model=dict)
async def delete_prayer(prayer_id: int):
    """기도 제목 삭제"""
    try:
        success = await prayer_service.delete_prayer(prayer_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="기도 제목을 찾을 수 없습니다"
            )
        return {"message": "기도 제목이 삭제되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 제목 삭제 중 오류가 발생했습니다: {str(e)}"
        )

# 기도 참여 관련 엔드포인트
@router.post("/{prayer_id}/participate", response_model=dict)
async def participate_prayer(prayer_id: int, user_id: int):
    """기도 참여"""
    try:
        result = await prayer_service.participate_prayer(prayer_id, user_id)
        return {"message": "기도 참여가 완료되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 참여 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{prayer_id}/participants", response_model=List[PrayerParticipant])
async def get_prayer_participants(prayer_id: int):
    """기도 참여자 목록 조회"""
    try:
        participants = await prayer_service.get_prayer_participants(prayer_id)
        return participants
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기도 참여자 조회 중 오류가 발생했습니다: {str(e)}"
        )

# 기도 댓글 관련 엔드포인트
@router.post("/{prayer_id}/comments", response_model=dict)
async def create_prayer_comment(prayer_id: int, comment_data: PrayerCommentCreate):
    """기도 댓글 생성"""
    try:
        # prayer_id를 comment_data에 설정
        comment_dict = comment_data.dict()
        comment_dict["prayer_id"] = prayer_id
        
        result = await prayer_service.create_prayer_comment(comment_dict)
        return {"message": "댓글이 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"댓글 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/{prayer_id}/comments", response_model=List[PrayerComment])
async def get_prayer_comments(prayer_id: int):
    """기도 댓글 목록 조회"""
    try:
        comments = await prayer_service.get_prayer_comments(prayer_id)
        return comments
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"댓글 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/comments/{comment_id}", response_model=dict)
async def delete_prayer_comment(comment_id: int, user_id: int):
    """기도 댓글 삭제 (본인만 가능)"""
    try:
        success = await prayer_service.delete_prayer_comment(comment_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="댓글을 찾을 수 없거나 삭제 권한이 없습니다"
            )
        return {"message": "댓글이 삭제되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"댓글 삭제 중 오류가 발생했습니다: {str(e)}"
        ) 