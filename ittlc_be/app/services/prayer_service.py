"""
기도 관리 서비스
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
        if hasattr(result, 'columns') and result.columns:
            if isinstance(result.columns, list) and isinstance(result.columns[0], str):
                column_names = result.columns
            elif hasattr(result.columns[0], 'name'):
                column_names = [col.name for col in result.columns]
            else:
                column_names = default_columns or []
        else:
            column_names = default_columns or []
        
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
            return self._safe_dict_from_result(result, ['id', 'name', 'description', 'color', 'is_active', 'created_at'])
        finally:
            await client.close()
    
    async def create_prayer_category(self, category_data: Dict[str, Any]) -> Dict[str, Any]:
        """기도 카테고리 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO prayer_categories (name, description, color, is_active)
            VALUES (?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                category_data['name'],
                category_data.get('description'),
                category_data.get('color'),
                category_data.get('is_active', True)
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    # 기도 제목 관련 메서드
    async def create_prayer(self, prayer_data: Dict[str, Any]) -> Dict[str, Any]:
        """기도 제목 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO prayers (title, content, category, is_anonymous, visibility, 
                               status, prayer_period_start, prayer_period_end, tags, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                prayer_data['title'],
                prayer_data['content'],
                prayer_data['category'],
                prayer_data.get('is_anonymous', False),
                prayer_data.get('visibility', 'public'),
                prayer_data.get('status', 'active'),
                prayer_data.get('prayer_period_start'),
                prayer_data.get('prayer_period_end'),
                prayer_data.get('tags'),
                prayer_data['created_by']
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_prayer_by_id(self, prayer_id: int) -> Optional[Dict[str, Any]]:
        """ID로 기도 제목 조회"""
        client = await self.get_client()
        try:
            sql = "SELECT * FROM prayers WHERE id = ?"
            result = await client.execute(sql, [prayer_id])
            if result.rows:
                return dict(zip([col.name for col in result.columns], result.rows[0]))
            return None
        finally:
            await client.close()
    
    async def get_prayers(self, skip: int = 0, limit: int = 20, 
                         category: Optional[str] = None, 
                         status: Optional[str] = None,
                         visibility: Optional[str] = None,
                         user_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """기도 제목 목록 조회"""
        client = await self.get_client()
        try:
            sql = "SELECT * FROM prayers WHERE 1=1"
            params = []
            
            if category:
                sql += " AND category = ?"
                params.append(category)
            
            if status:
                sql += " AND status = ?"
                params.append(status)
            
            if visibility:
                sql += " AND visibility = ?"
                params.append(visibility)
            
            if user_id:
                sql += " AND created_by = ?"
                params.append(user_id)
            
            sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, skip])
            
            result = await client.execute(sql, params)
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def update_prayer(self, prayer_id: int, prayer_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """기도 제목 업데이트"""
        client = await self.get_client()
        try:
            update_fields = []
            values = []
            
            for key, value in prayer_data.items():
                if value is not None and key != 'id':
                    update_fields.append(f"{key} = ?")
                    values.append(value)
            
            if not update_fields:
                return None
            
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            values.append(prayer_id)
            
            sql = f"UPDATE prayers SET {', '.join(update_fields)} WHERE id = ?"
            await client.execute(sql, values)
            
            return await self.get_prayer_by_id(prayer_id)
        finally:
            await client.close()
    
    async def delete_prayer(self, prayer_id: int) -> bool:
        """기도 제목 삭제"""
        client = await self.get_client()
        try:
            sql = "DELETE FROM prayers WHERE id = ?"
            result = await client.execute(sql, [prayer_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    # 기도 참여 관련 메서드
    async def participate_prayer(self, prayer_id: int, user_id: int) -> Dict[str, Any]:
        """기도 참여"""
        client = await self.get_client()
        try:
            sql = """
            INSERT OR IGNORE INTO prayer_participants (prayer_id, user_id)
            VALUES (?, ?)
            """
            result = await client.execute(sql, [prayer_id, user_id])
            return {"success": True, "id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_prayer_participants(self, prayer_id: int) -> List[Dict[str, Any]]:
        """기도 참여자 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT pp.*, u.username, u.full_name
            FROM prayer_participants pp
            JOIN users u ON pp.user_id = u.id
            WHERE pp.prayer_id = ?
            ORDER BY pp.participated_at DESC
            """
            result = await client.execute(sql, [prayer_id])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    # 기도 댓글 관련 메서드
    async def create_prayer_comment(self, comment_data: Dict[str, Any]) -> Dict[str, Any]:
        """기도 댓글 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO prayer_comments (prayer_id, user_id, comment, is_anonymous)
            VALUES (?, ?, ?, ?)
            """
            result = await client.execute(sql, [
                comment_data['prayer_id'],
                comment_data['user_id'],
                comment_data['comment'],
                comment_data.get('is_anonymous', False)
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_prayer_comments(self, prayer_id: int) -> List[Dict[str, Any]]:
        """기도 댓글 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT pc.*, u.username, u.full_name
            FROM prayer_comments pc
            JOIN users u ON pc.user_id = u.id
            WHERE pc.prayer_id = ?
            ORDER BY pc.created_at ASC
            """
            result = await client.execute(sql, [prayer_id])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def delete_prayer_comment(self, comment_id: int, user_id: int) -> bool:
        """기도 댓글 삭제 (본인만 가능)"""
        client = await self.get_client()
        try:
            sql = "DELETE FROM prayer_comments WHERE id = ? AND user_id = ?"
            result = await client.execute(sql, [comment_id, user_id])
            return result.rows_affected > 0
        finally:
            await client.close()

# 전역 기도 서비스 인스턴스
prayer_service = PrayerService() 