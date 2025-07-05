"""
시스템 관리 서비스
"""
import os
from typing import Optional, List, Dict, Any
from libsql_client import create_client
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 로드
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class SystemService:
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
    
    # 시스템 설정 관련 메서드
    async def get_setting(self, setting_key: str) -> Optional[Dict[str, Any]]:
        """시스템 설정 조회"""
        client = await self.get_client()
        try:
            sql = "SELECT * FROM system_settings WHERE setting_key = ?"
            result = await client.execute(sql, [setting_key])
            if result.rows:
                return dict(zip([col.name for col in result.columns], result.rows[0]))
            return None
        finally:
            await client.close()
    
    async def get_settings(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """시스템 설정 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT * FROM system_settings
            ORDER BY setting_key
            LIMIT ? OFFSET ?
            """
            result = await client.execute(sql, [limit, skip])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def update_setting(self, setting_key: str, setting_value: str) -> Optional[Dict[str, Any]]:
        """시스템 설정 업데이트"""
        client = await self.get_client()
        try:
            sql = """
            UPDATE system_settings
            SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
            WHERE setting_key = ?
            """
            result = await client.execute(sql, [setting_value, setting_key])
            
            if result.rows_affected > 0:
                return await self.get_setting(setting_key)
            return None
        finally:
            await client.close()
    
    async def create_setting(self, setting_data: Dict[str, Any]) -> Dict[str, Any]:
        """시스템 설정 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
            VALUES (?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                setting_data['setting_key'],
                setting_data['setting_value'],
                setting_data.get('setting_type', 'string'),
                setting_data.get('description')
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def delete_setting(self, setting_key: str) -> bool:
        """시스템 설정 삭제"""
        client = await self.get_client()
        try:
            sql = "DELETE FROM system_settings WHERE setting_key = ?"
            result = await client.execute(sql, [setting_key])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    # 시스템 로그 관련 메서드
    async def create_log(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """시스템 로그 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO system_logs (user_id, log_level, log_type, message, 
                                   ip_address, user_agent, additional_data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                log_data.get('user_id'),
                log_data['log_level'],
                log_data['log_type'],
                log_data['message'],
                log_data.get('ip_address'),
                log_data.get('user_agent'),
                log_data.get('additional_data')
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_logs(self, skip: int = 0, limit: int = 50,
                      log_level: Optional[str] = None,
                      log_type: Optional[str] = None,
                      user_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """시스템 로그 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT sl.*, u.username
            FROM system_logs sl
            LEFT JOIN users u ON sl.user_id = u.id
            WHERE 1=1
            """
            params = []
            
            if log_level:
                sql += " AND sl.log_level = ?"
                params.append(log_level)
            
            if log_type:
                sql += " AND sl.log_type = ?"
                params.append(log_type)
            
            if user_id:
                sql += " AND sl.user_id = ?"
                params.append(user_id)
            
            sql += " ORDER BY sl.created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, skip])
            
            result = await client.execute(sql, params)
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def clear_old_logs(self, days: int = 90) -> int:
        """오래된 로그 정리"""
        client = await self.get_client()
        try:
            sql = """
            DELETE FROM system_logs
            WHERE created_at < datetime('now', '-{} days')
            """.format(days)
            result = await client.execute(sql)
            return result.rows_affected
        finally:
            await client.close()
    
    # 백업 관련 메서드
    async def create_backup_record(self, backup_data: Dict[str, Any]) -> Dict[str, Any]:
        """백업 기록 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO backup_history (filename, file_size, backup_type, status, created_by)
            VALUES (?, ?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                backup_data['filename'],
                backup_data.get('file_size'),
                backup_data['backup_type'],
                backup_data.get('status', 'in_progress'),
                backup_data.get('created_by')
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def update_backup_status(self, backup_id: int, status: str) -> bool:
        """백업 상태 업데이트"""
        client = await self.get_client()
        try:
            sql = "UPDATE backup_history SET status = ? WHERE id = ?"
            result = await client.execute(sql, [status, backup_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    async def get_backup_history(self, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        """백업 이력 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT bh.*, u.username as created_by_username
            FROM backup_history bh
            LEFT JOIN users u ON bh.created_by = u.id
            ORDER BY bh.created_at DESC
            LIMIT ? OFFSET ?
            """
            result = await client.execute(sql, [limit, skip])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def delete_backup_record(self, backup_id: int) -> bool:
        """백업 기록 삭제"""
        client = await self.get_client()
        try:
            sql = "DELETE FROM backup_history WHERE id = ?"
            result = await client.execute(sql, [backup_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    # 대시보드 통계 관련 메서드
    async def get_dashboard_stats(self) -> Dict[str, Any]:
        """대시보드 통계 조회"""
        client = await self.get_client()
        try:
            # 성도 수
            member_count_result = await client.execute("SELECT COUNT(*) FROM members WHERE is_active = TRUE")
            member_count = member_count_result.rows[0][0]
            
            # 가족 수
            family_count_result = await client.execute("SELECT COUNT(*) FROM families")
            family_count = family_count_result.rows[0][0]
            
            # 이달의 기도 제목 수
            prayer_count_result = await client.execute("""
                SELECT COUNT(*) FROM prayers
                WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
            """)
            prayer_count = prayer_count_result.rows[0][0]
            
            # 이달의 헌금 총액
            offering_amount_result = await client.execute("""
                SELECT COALESCE(SUM(amount), 0) FROM offerings
                WHERE strftime('%Y-%m', offering_date) = strftime('%Y-%m', 'now')
            """)
            offering_amount = offering_amount_result.rows[0][0]
            
            return {
                "member_count": member_count,
                "family_count": family_count,
                "monthly_prayer_count": prayer_count,
                "monthly_offering_amount": offering_amount
            }
        finally:
            await client.close()

# 전역 시스템 서비스 인스턴스
system_service = SystemService() 