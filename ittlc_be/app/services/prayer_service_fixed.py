"""
기도 관리 서비스 (수정된 버전)
"""
import os
from typing import Optional, List, Dict, Any
from libsql_client import create_client
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 로드
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class PrayerService:
    def __init__(self):
        self.libsql_url = os.getenv("LIBSQL_URL")
        self.auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        
        if not self.libsql_url:
            raise ValueError("LIBSQL_URL이 설정되지 않았습니다.")
        
        # HTTP URL로 변환
        self.http_url = self.libsql_url.replace("libsql://", "https://")
    
    async def get_client(self):
        """LibSQL 클라이언트 반환"""
        return create_client(url=self.http_url, auth_token=self.auth_token)
    
    def _safe_dict_from_result(self, result, default_columns=None):
        """결과를 안전하게 딕셔너리로 변환"""
        if not result.rows:
            return []
        
        # 컬럼 이름을 안전하게 처리
        try:
            if hasattr(result, 'columns') and result.columns:
                if isinstance(result.columns, list) and isinstance(result.columns[0], str):
                    column_names = result.columns
                elif hasattr(result.columns[0], 'name'):
                    column_names = [col.name for col in result.columns]
                else:
                    column_names = default_columns or [f"col_{i}" for i in range(len(result.rows[0]))]
            else:
                column_names = default_columns or [f"col_{i}" for i in range(len(result.rows[0]))]
        except:
            column_names = default_columns or [f"col_{i}" for i in range(len(result.rows[0]))]
        
        return [dict(zip(column_names, row)) for row in result.rows]
    
    # 기도 카테고리 관련 메서드
    async def get_prayer_categories(self, active_only: bool = True) -> List[Dict[str, Any]]:
        """기도 카테고리 목록 조회"""
        client = await self.get_client()
        try:
            sql = "SELECT * FROM prayer_categories"
            if active_only:
                sql += " WHERE is_active = TRUE"
            sql += " ORDER BY name"
            
            result = await client.execute(sql)
            return self._safe_dict_from_result(result)
        finally:
            await client.close()
    
    async def get_prayers(self, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        """기도 제목 목록 조회"""
        client = await self.get_client()
        try:
            sql = "SELECT * FROM prayers ORDER BY created_at DESC LIMIT ? OFFSET ?"
            result = await client.execute(sql, [limit, skip])
            return self._safe_dict_from_result(result)
        finally:
            await client.close()

# 전역 기도 서비스 인스턴스
prayer_service = PrayerService() 