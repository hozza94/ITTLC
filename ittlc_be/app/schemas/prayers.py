"""
기도 관리 스키마
"""
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List

# 기도 카테고리 스키마
class PrayerCategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    is_active: bool = True

class PrayerCategoryCreate(PrayerCategoryBase):
    pass

class PrayerCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    is_active: Optional[bool] = None

class PrayerCategory(PrayerCategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# 기도 제목 스키마
class PrayerBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=50)
    is_anonymous: bool = False
    visibility: str = Field(default="public", pattern=r'^(public|members|private)$')
    status: str = Field(default="active", pattern=r'^(active|answered|completed)$')
    prayer_period_start: Optional[date] = None
    prayer_period_end: Optional[date] = None
    tags: Optional[str] = Field(None, max_length=500)

class PrayerCreate(PrayerBase):
    created_by: int

class PrayerUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    is_anonymous: Optional[bool] = None
    visibility: Optional[str] = Field(None, pattern=r'^(public|members|private)$')
    status: Optional[str] = Field(None, pattern=r'^(active|answered|completed)$')
    prayer_period_start: Optional[date] = None
    prayer_period_end: Optional[date] = None
    answer_content: Optional[str] = None
    answer_date: Optional[date] = None
    tags: Optional[str] = Field(None, max_length=500)

class Prayer(PrayerBase):
    id: int
    created_by: int
    answer_content: Optional[str] = None
    answer_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 기도 참여 스키마
class PrayerParticipantBase(BaseModel):
    prayer_id: int
    user_id: int

class PrayerParticipantCreate(PrayerParticipantBase):
    pass

class PrayerParticipant(PrayerParticipantBase):
    id: int
    participated_at: datetime
    # 조인된 사용자 정보
    username: Optional[str] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

# 기도 댓글 스키마
class PrayerCommentBase(BaseModel):
    comment: str = Field(..., min_length=1)
    is_anonymous: bool = False

class PrayerCommentCreate(PrayerCommentBase):
    prayer_id: int
    user_id: int

class PrayerCommentUpdate(BaseModel):
    comment: Optional[str] = Field(None, min_length=1)
    is_anonymous: Optional[bool] = None

class PrayerComment(PrayerCommentBase):
    id: int
    prayer_id: int
    user_id: int
    created_at: datetime
    # 조인된 사용자 정보
    username: Optional[str] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

# 기도 목록 응답 스키마
class PrayerListResponse(BaseModel):
    prayers: List[Prayer]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool 