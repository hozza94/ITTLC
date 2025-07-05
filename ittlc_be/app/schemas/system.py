"""
시스템 관리 및 대시보드 스키마
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Any
from decimal import Decimal

# 시스템 설정 스키마
class SystemSettingBase(BaseModel):
    setting_key: str = Field(..., min_length=1, max_length=100)
    setting_value: str
    setting_type: str = Field(default="string", pattern=r'^(string|number|boolean|json)$')
    description: Optional[str] = None

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingUpdate(BaseModel):
    setting_value: str
    description: Optional[str] = None

class SystemSetting(SystemSettingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 시스템 로그 스키마
class SystemLogBase(BaseModel):
    log_level: str = Field(..., pattern=r'^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$')
    log_type: str = Field(..., min_length=1, max_length=50)
    message: str = Field(..., min_length=1)
    ip_address: Optional[str] = Field(None, max_length=45)
    user_agent: Optional[str] = None
    additional_data: Optional[str] = None

class SystemLogCreate(SystemLogBase):
    user_id: Optional[int] = None

class SystemLog(SystemLogBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    # 조인된 사용자 정보
    username: Optional[str] = None

    class Config:
        from_attributes = True

# 백업 이력 스키마
class BackupHistoryBase(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    file_size: Optional[int] = None
    backup_type: str = Field(..., pattern=r'^(manual|auto|scheduled)$')
    status: str = Field(default="in_progress", pattern=r'^(success|failed|in_progress)$')

class BackupHistoryCreate(BackupHistoryBase):
    created_by: Optional[int] = None

class BackupHistoryUpdate(BaseModel):
    status: str = Field(..., pattern=r'^(success|failed|in_progress)$')

class BackupHistory(BackupHistoryBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    # 조인된 사용자 정보
    created_by_username: Optional[str] = None

    class Config:
        from_attributes = True

# 대시보드 통계 스키마
class DashboardStats(BaseModel):
    member_count: int
    family_count: int
    monthly_prayer_count: int
    monthly_offering_amount: Decimal

# 응답 스키마들
class SystemSettingListResponse(BaseModel):
    settings: List[SystemSetting]
    total: int

class SystemLogListResponse(BaseModel):
    logs: List[SystemLog]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

class BackupHistoryListResponse(BaseModel):
    backups: List[BackupHistory]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

# 시스템 로그 필터 스키마
class SystemLogFilter(BaseModel):
    log_level: Optional[str] = Field(None, pattern=r'^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$')
    log_type: Optional[str] = None
    user_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=50, ge=1, le=100) 