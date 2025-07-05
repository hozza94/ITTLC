# backend/app/api/v1/endpoints/users.py
from fastapi import APIRouter, HTTPException
from typing import List
from app import schemas
from app.services.libsql_service import libsql_service

router = APIRouter()

@router.get("/test")
def test_users():
    """데이터베이스 연결 없이 테스트용 엔드포인트"""
    return {"message": "Users API가 정상적으로 작동합니다!"}

@router.post("/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate):
    """사용자 생성"""
    try:
        # 이메일 중복 체크
        existing_user = await libsql_service.get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # 사용자 생성
        user_data = {
            "email": user.email,
            "password_hash": user.password,  # 실제로는 해시화해야 함
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active
        }
        
        result = await libsql_service.create_user(user_data)
        
        # 생성된 사용자 정보 반환
        created_user = await libsql_service.get_user_by_id(result["user_id"])
        return created_user
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"사용자 생성 실패: {str(e)}")

@router.get("/", response_model=List[schemas.User])
async def read_users(skip: int = 0, limit: int = 100):
    """사용자 목록 조회"""
    try:
        users = await libsql_service.get_users(skip=skip, limit=limit)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"사용자 목록 조회 실패: {str(e)}")

@router.get("/{user_id}", response_model=schemas.User)
async def read_user(user_id: int):
    """사용자 조회"""
    try:
        user = await libsql_service.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"사용자 조회 실패: {str(e)}")