"""
헌금 관리 스키마
"""
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal

# 헌금 종류 스키마
class OfferingTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    is_active: bool = True

class OfferingTypeCreate(OfferingTypeBase):
    pass

class OfferingTypeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    is_active: Optional[bool] = None

class OfferingType(OfferingTypeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# 헌금 기록 스키마
class OfferingBase(BaseModel):
    member_id: int
    offering_date: date
    offering_type: str = Field(..., min_length=1, max_length=50)
    amount: Decimal = Field(..., gt=0)
    memo: Optional[str] = None

class OfferingCreate(OfferingBase):
    created_by: int

class OfferingUpdate(BaseModel):
    member_id: Optional[int] = None
    offering_date: Optional[date] = None
    offering_type: Optional[str] = Field(None, min_length=1, max_length=50)
    amount: Optional[Decimal] = Field(None, gt=0)
    memo: Optional[str] = None

class Offering(OfferingBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    # 조인된 정보
    member_name: Optional[str] = None
    created_by_username: Optional[str] = None

    class Config:
        from_attributes = True

# 헌금 통계 스키마
class OfferingStatsByType(BaseModel):
    offering_type: str
    amount: Decimal
    count: int

class OfferingStatsByMonth(BaseModel):
    month: str
    amount: Decimal
    count: int

class OfferingStatsTotal(BaseModel):
    total_amount: Optional[Decimal] = None
    total_count: int

class OfferingStatistics(BaseModel):
    total: OfferingStatsTotal
    by_type: List[OfferingStatsByType]
    monthly: List[OfferingStatsByMonth]

# 성도별 헌금 요약 스키마
class MemberOfferingSummary(BaseModel):
    offering_type: str
    total_amount: Decimal
    count: int
    first_date: Optional[date] = None
    last_date: Optional[date] = None

# 헌금 목록 응답 스키마
class OfferingListResponse(BaseModel):
    offerings: List[Offering]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

# 헌금 검색 필터 스키마
class OfferingSearchFilter(BaseModel):
    member_id: Optional[int] = None
    offering_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    min_amount: Optional[Decimal] = Field(None, gt=0)
    max_amount: Optional[Decimal] = Field(None, gt=0)
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100) 