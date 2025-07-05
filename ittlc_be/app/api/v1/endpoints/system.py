"""
시스템 관리 및 대시보드 API 엔드포인트
"""
from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from datetime import datetime, date

from app.schemas import (
    SystemSetting, SystemSettingCreate, SystemSettingUpdate, SystemSettingListResponse,
    SystemLog, SystemLogCreate, SystemLogListResponse, SystemLogFilter,
    BackupHistory, BackupHistoryCreate, BackupHistoryUpdate, BackupHistoryListResponse,
    DashboardStats
)
from app.services.system_service import system_service

router = APIRouter()

# 대시보드 관련 엔드포인트
@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """대시보드 통계 조회"""
    try:
        stats = await system_service.get_dashboard_stats()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"대시보드 통계 조회 중 오류가 발생했습니다: {str(e)}"
        )

# 시스템 설정 관련 엔드포인트
@router.get("/settings", response_model=List[SystemSetting])
async def get_system_settings():
    """시스템 설정 목록 조회"""
    try:
        settings = await system_service.get_system_settings()
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"시스템 설정 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/settings", response_model=dict)
async def create_system_setting(setting_data: SystemSettingCreate):
    """시스템 설정 생성"""
    try:
        result = await system_service.create_system_setting(setting_data.dict())
        return {"message": "시스템 설정이 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"시스템 설정 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/settings/{setting_key}", response_model=SystemSetting)
async def get_system_setting(setting_key: str):
    """시스템 설정 조회"""
    try:
        setting = await system_service.get_system_setting_by_key(setting_key)
        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="시스템 설정을 찾을 수 없습니다"
            )
        return setting
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"시스템 설정 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/settings/{setting_key}", response_model=SystemSetting)
async def update_system_setting(setting_key: str, setting_data: SystemSettingUpdate):
    """시스템 설정 수정"""
    try:
        updated_setting = await system_service.update_system_setting(
            setting_key, 
            setting_data.dict(exclude_unset=True)
        )
        if not updated_setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="시스템 설정을 찾을 수 없습니다"
            )
        return updated_setting
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"시스템 설정 수정 중 오류가 발생했습니다: {str(e)}"
        )

# 시스템 로그 관련 엔드포인트
@router.get("/logs", response_model=List[SystemLog])
async def get_system_logs(
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=50, ge=1, le=100, description="가져올 항목 수"),
    log_level: Optional[str] = Query(default=None, description="로그 레벨 필터"),
    log_type: Optional[str] = Query(default=None, description="로그 타입 필터"),
    start_date: Optional[datetime] = Query(default=None, description="시작 날짜"),
    end_date: Optional[datetime] = Query(default=None, description="종료 날짜")
):
    """시스템 로그 목록 조회"""
    try:
        logs = await system_service.get_system_logs(
            skip=skip,
            limit=limit,
            log_level=log_level,
            log_type=log_type,
            start_date=start_date,
            end_date=end_date
        )
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"시스템 로그 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/logs", response_model=dict)
async def create_system_log(log_data: SystemLogCreate):
    """시스템 로그 생성"""
    try:
        result = await system_service.create_system_log(log_data.dict())
        return {"message": "시스템 로그가 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"시스템 로그 생성 중 오류가 발생했습니다: {str(e)}"
        )

# 백업 관련 엔드포인트
@router.get("/backups", response_model=List[BackupHistory])
async def get_backup_history(
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=20, ge=1, le=100, description="가져올 항목 수")
):
    """백업 이력 조회"""
    try:
        backups = await system_service.get_backup_history(skip=skip, limit=limit)
        return backups
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"백업 이력 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/backups", response_model=dict)
async def create_backup(backup_data: BackupHistoryCreate):
    """백업 생성"""
    try:
        result = await system_service.create_backup(backup_data.dict())
        return {"message": "백업이 생성되었습니다", "id": result["id"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"백업 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/backups/{backup_id}/status", response_model=dict)
async def update_backup_status(backup_id: int, status_data: BackupHistoryUpdate):
    """백업 상태 업데이트"""
    try:
        success = await system_service.update_backup_status(
            backup_id, 
            status_data.status
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="백업을 찾을 수 없습니다"
            )
        return {"message": "백업 상태가 업데이트되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"백업 상태 업데이트 중 오류가 발생했습니다: {str(e)}"
        ) 