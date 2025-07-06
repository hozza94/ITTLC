"""
성도 관리 스키마
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional, List

# 성도 스키마
class MemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    name_en: Optional[str] = Field(None, max_length=100)
    birth_date: date = Field(...)
    gender: str = Field(..., pattern=r'^(남|여)$')
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    job: Optional[str] = Field(None, max_length=100)
    registration_date: date = Field(...)
    baptism_date: Optional[date] = None
    position: str = Field(default='성도', max_length=50)
    district: Optional[str] = Field(None, max_length=50)
    family_id: Optional[int] = None
    family_role: Optional[str] = Field(None, max_length=20)
    is_active: bool = Field(default=True)
    notes: Optional[str] = None

class MemberCreate(MemberBase):
    created_by: int

class MemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    name_en: Optional[str] = Field(None, max_length=100)
    birth_date: Optional[date] = None
    gender: Optional[str] = Field(None, pattern=r'^(남|여)$')
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    job: Optional[str] = Field(None, max_length=100)
    registration_date: Optional[date] = None
    baptism_date: Optional[date] = None
    position: Optional[str] = Field(None, max_length=50)
    district: Optional[str] = Field(None, max_length=50)
    family_id: Optional[int] = None
    family_role: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None
    notes: Optional[str] = None

class Member(MemberBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    # 조인된 정보
    family_name: Optional[str] = None
    created_by_username: Optional[str] = None

    class Config:
        from_attributes = True

# 성도 목록 응답 스키마
class MemberListResponse(BaseModel):
    members: List[Member]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

# 성도 검색 스키마
class MemberSearch(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    district: Optional[str] = None
    position: Optional[str] = None
    is_active: Optional[bool] = None