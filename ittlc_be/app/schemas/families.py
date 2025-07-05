"""
가족 관리 스키마
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# 가족 스키마
class FamilyBase(BaseModel):
    family_name: str = Field(..., min_length=1, max_length=100)
    head_member_id: Optional[int] = None
    address: Optional[str] = None

class FamilyCreate(FamilyBase):
    pass

class FamilyUpdate(BaseModel):
    family_name: Optional[str] = Field(None, min_length=1, max_length=100)
    head_member_id: Optional[int] = None
    address: Optional[str] = None

class Family(FamilyBase):
    id: int
    created_at: datetime
    # 조인된 정보
    head_member_name: Optional[str] = None
    member_count: Optional[int] = 0

    class Config:
        from_attributes = True

# 가족 구성원 관리 스키마
class FamilyMemberUpdate(BaseModel):
    family_id: Optional[int] = None
    family_role: Optional[str] = Field(None, max_length=20)

class FamilyMemberAdd(BaseModel):
    member_id: int
    family_role: str = Field(default="자녀", max_length=20)

# 가족 목록 응답 스키마
class FamilyListResponse(BaseModel):
    families: List[Family]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

# 가족 상세 응답 스키마 (구성원 포함)
class FamilyDetail(Family):
    members: Optional[List[dict]] = []  # Member 스키마는 다른 파일에 있으므로 dict로 처리 