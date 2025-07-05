# backend/app/api/v1/endpoints/members.py
from fastapi import APIRouter, HTTPException
from typing import List
from app import schemas
from app.services.libsql_service import libsql_service

router = APIRouter()

@router.get("/test")
def test_members():
    """데이터베이스 연결 없이 테스트용 엔드포인트"""
    return {"message": "Members API가 정상적으로 작동합니다!"}

@router.post("/", response_model=schemas.Member)
async def create_member(member: schemas.MemberCreate):
    """멤버 생성"""
    try:
        # 이메일 중복 체크 (이메일이 있는 경우)
        if member.email:
            existing_member = await libsql_service.get_member_by_email(member.email)
            if existing_member:
                raise HTTPException(status_code=400, detail="Email already registered")
        
        # 멤버 생성
        member_data = {
            "name": member.name,
            "age": member.age,
            "sex": member.sex,
            "birthday": member.birthday,
            "contact": member.contact,
            "address": member.address,
            "job": member.job,
            "email": member.email,
            "baptism": member.baptism,
            "marriage": member.marriage,
            "prev_church": member.prev_church,
            "registration_date": member.registration_date,
            "memo": member.memo
        }
        
        result = await libsql_service.create_member(member_data)
        
        # 생성된 멤버 정보 반환
        created_member = await libsql_service.get_member_by_id(result["member_id"])
        return created_member
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"멤버 생성 실패: {str(e)}")

@router.get("/", response_model=List[schemas.Member])
async def read_members(skip: int = 0, limit: int = 100):
    """멤버 목록 조회"""
    try:
        members = await libsql_service.get_members(skip=skip, limit=limit)
        return members
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"멤버 목록 조회 실패: {str(e)}")

@router.get("/{member_id}", response_model=schemas.Member)
async def read_member(member_id: int):
    """멤버 조회"""
    try:
        member = await libsql_service.get_member_by_id(member_id)
        if member is None:
            raise HTTPException(status_code=404, detail="Member not found")
        return member
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"멤버 조회 실패: {str(e)}")

@router.put("/{member_id}", response_model=schemas.Member)
async def update_member(member_id: int, member: schemas.MemberUpdate):
    """멤버 업데이트"""
    try:
        # 멤버 존재 확인
        existing_member = await libsql_service.get_member_by_id(member_id)
        if existing_member is None:
            raise HTTPException(status_code=404, detail="Member not found")
        
        # 업데이트할 데이터 준비
        update_data = {}
        for field, value in member.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        # 멤버 업데이트
        updated_member = await libsql_service.update_member(member_id, update_data)
        if updated_member is None:
            raise HTTPException(status_code=500, detail="멤버 업데이트 실패")
        
        return updated_member
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"멤버 업데이트 실패: {str(e)}")

@router.delete("/{member_id}")
async def delete_member(member_id: int):
    """멤버 삭제"""
    try:
        # 멤버 존재 확인
        existing_member = await libsql_service.get_member_by_id(member_id)
        if existing_member is None:
            raise HTTPException(status_code=404, detail="Member not found")
        
        # 멤버 삭제
        success = await libsql_service.delete_member(member_id)
        if not success:
            raise HTTPException(status_code=500, detail="멤버 삭제 실패")
        
        return {"message": "Member deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"멤버 삭제 실패: {str(e)}")