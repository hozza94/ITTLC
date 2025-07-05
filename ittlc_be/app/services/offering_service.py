"""
헌금 관리 서비스
"""
import os
from typing import Optional, List, Dict, Any
from libsql_client import create_client
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, date

# .env 파일 로드
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class OfferingService:
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
    
    # 헌금 종류 관련 메서드
    async def get_offering_types(self, active_only: bool = True) -> List[Dict[str, Any]]:
        """헌금 종류 목록 조회"""
        client = await self.get_client()
        try:
            sql = "SELECT * FROM offering_types"
            if active_only:
                sql += " WHERE is_active = TRUE"
            sql += " ORDER BY name"
            
            result = await client.execute(sql)
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def create_offering_type(self, type_data: Dict[str, Any]) -> Dict[str, Any]:
        """헌금 종류 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO offering_types (name, description, is_active)
            VALUES (?, ?, ?)
            """
            result = await client.execute(sql, [
                type_data['name'],
                type_data.get('description'),
                type_data.get('is_active', True)
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    # 헌금 관련 메서드
    async def create_offering(self, offering_data: Dict[str, Any]) -> Dict[str, Any]:
        """헌금 기록 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO offerings (member_id, offering_date, offering_type, amount, memo, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                offering_data['member_id'],
                offering_data['offering_date'],
                offering_data['offering_type'],
                offering_data['amount'],
                offering_data.get('memo'),
                offering_data['created_by']
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_offering_by_id(self, offering_id: int) -> Optional[Dict[str, Any]]:
        """ID로 헌금 기록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT o.*, m.name as member_name, u.username as created_by_username
            FROM offerings o
            JOIN members m ON o.member_id = m.id
            JOIN users u ON o.created_by = u.id
            WHERE o.id = ?
            """
            result = await client.execute(sql, [offering_id])
            if result.rows:
                return dict(zip([col.name for col in result.columns], result.rows[0]))
            return None
        finally:
            await client.close()
    
    async def get_offerings(self, skip: int = 0, limit: int = 20,
                           member_id: Optional[int] = None,
                           offering_type: Optional[str] = None,
                           start_date: Optional[date] = None,
                           end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        """헌금 기록 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT o.*, m.name as member_name, u.username as created_by_username
            FROM offerings o
            JOIN members m ON o.member_id = m.id
            JOIN users u ON o.created_by = u.id
            WHERE 1=1
            """
            params = []
            
            if member_id:
                sql += " AND o.member_id = ?"
                params.append(member_id)
            
            if offering_type:
                sql += " AND o.offering_type = ?"
                params.append(offering_type)
            
            if start_date:
                sql += " AND o.offering_date >= ?"
                params.append(start_date.isoformat())
            
            if end_date:
                sql += " AND o.offering_date <= ?"
                params.append(end_date.isoformat())
            
            sql += " ORDER BY o.offering_date DESC, o.created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, skip])
            
            result = await client.execute(sql, params)
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def update_offering(self, offering_id: int, offering_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """헌금 기록 업데이트"""
        client = await self.get_client()
        try:
            update_fields = []
            values = []
            
            for key, value in offering_data.items():
                if value is not None and key != 'id':
                    update_fields.append(f"{key} = ?")
                    values.append(value)
            
            if not update_fields:
                return None
            
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            values.append(offering_id)
            
            sql = f"UPDATE offerings SET {', '.join(update_fields)} WHERE id = ?"
            await client.execute(sql, values)
            
            return await self.get_offering_by_id(offering_id)
        finally:
            await client.close()
    
    async def delete_offering(self, offering_id: int) -> bool:
        """헌금 기록 삭제"""
        client = await self.get_client()
        try:
            sql = "DELETE FROM offerings WHERE id = ?"
            result = await client.execute(sql, [offering_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    # 헌금 통계 관련 메서드
    async def get_offering_statistics(self, start_date: date, end_date: date) -> Dict[str, Any]:
        """헌금 통계 조회"""
        client = await self.get_client()
        try:
            # 기간별 총 헌금액
            sql_total = """
            SELECT SUM(amount) as total_amount, COUNT(*) as total_count
            FROM offerings
            WHERE offering_date BETWEEN ? AND ?
            """
            result_total = await client.execute(sql_total, [start_date.isoformat(), end_date.isoformat()])
            total_data = dict(zip([col.name for col in result_total.columns], result_total.rows[0]))
            
            # 헌금 종류별 통계
            sql_by_type = """
            SELECT offering_type, SUM(amount) as amount, COUNT(*) as count
            FROM offerings
            WHERE offering_date BETWEEN ? AND ?
            GROUP BY offering_type
            ORDER BY amount DESC
            """
            result_by_type = await client.execute(sql_by_type, [start_date.isoformat(), end_date.isoformat()])
            by_type_data = [dict(zip([col.name for col in result_by_type.columns], row)) for row in result_by_type.rows]
            
            # 월별 헌금 통계
            sql_monthly = """
            SELECT 
                strftime('%Y-%m', offering_date) as month,
                SUM(amount) as amount,
                COUNT(*) as count
            FROM offerings
            WHERE offering_date BETWEEN ? AND ?
            GROUP BY strftime('%Y-%m', offering_date)
            ORDER BY month
            """
            result_monthly = await client.execute(sql_monthly, [start_date.isoformat(), end_date.isoformat()])
            monthly_data = [dict(zip([col.name for col in result_monthly.columns], row)) for row in result_monthly.rows]
            
            return {
                "total": total_data,
                "by_type": by_type_data,
                "monthly": monthly_data
            }
        finally:
            await client.close()
    
    async def get_member_offering_summary(self, member_id: int, year: int) -> Dict[str, Any]:
        """성도별 헌금 요약 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT 
                offering_type,
                SUM(amount) as total_amount,
                COUNT(*) as count,
                MIN(offering_date) as first_date,
                MAX(offering_date) as last_date
            FROM offerings
            WHERE member_id = ? AND strftime('%Y', offering_date) = ?
            GROUP BY offering_type
            ORDER BY total_amount DESC
            """
            result = await client.execute(sql, [member_id, str(year)])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()

# 전역 헌금 서비스 인스턴스
offering_service = OfferingService() 