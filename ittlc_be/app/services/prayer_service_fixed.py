"""
기도 관리 서비스 (수정된 버전)
"""
import os
from typing import Optional, List, Dict, Any
from libsql_client import create_client
from dotenv import load_dotenv
from pathlib import Path
import logging
from datetime import datetime, date

# 로거 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    
    async def ensure_tables(self):
        """필요한 테이블들을 생성"""
        client = await self.get_client()
        try:
            # 기도 카테고리 테이블
            await client.execute("""
                CREATE TABLE IF NOT EXISTS prayer_categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    color TEXT,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 기도 제목 테이블
            await client.execute("""
                CREATE TABLE IF NOT EXISTS prayers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    category TEXT NOT NULL,
                    is_anonymous BOOLEAN DEFAULT FALSE,
                    visibility TEXT DEFAULT 'public',
                    status TEXT DEFAULT 'active',
                    prayer_period_start DATE,
                    prayer_period_end DATE,
                    tags TEXT,
                    created_by INTEGER NOT NULL,
                    answer_content TEXT,
                    answer_date DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 기도 참여 테이블
            await client.execute("""
                CREATE TABLE IF NOT EXISTS prayer_participants (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    prayer_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(prayer_id, user_id)
                )
            """)
            
            # 기도 댓글 테이블
            await client.execute("""
                CREATE TABLE IF NOT EXISTS prayer_comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    prayer_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    comment TEXT NOT NULL,
                    is_anonymous BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 기본 카테고리 삽입
            await client.execute("""
                INSERT OR IGNORE INTO prayer_categories (name, description, color, is_active)
                VALUES 
                    ('일반', '일반적인 기도 제목', '#3B82F6', TRUE),
                    ('가족', '가족을 위한 기도', '#10B981', TRUE),
                    ('건강', '건강을 위한 기도', '#F59E0B', TRUE),
                    ('사업', '사업과 직장을 위한 기도', '#EF4444', TRUE),
                    ('교회', '교회를 위한 기도', '#8B5CF6', TRUE),
                    ('선교', '선교를 위한 기도', '#06B6D4', TRUE),
                    ('감사', '감사 기도', '#84CC16', TRUE),
                    ('회개', '회개 기도', '#F97316', TRUE)
            """)
            
            logger.info("기도 관리 테이블 생성 완료")
            
        finally:
            await client.close()
    
    # 기도 카테고리 관련 메서드
    async def get_prayer_categories(self, active_only: bool = True) -> List[Dict[str, Any]]:
        """기도 카테고리 목록 조회"""
        await self.ensure_tables()
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
        await self.ensure_tables()
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
    async def get_prayers(self, skip: int = 0, limit: int = 20, **filters) -> List[Dict[str, Any]]:
        """기도 제목 목록 조회"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = "SELECT * FROM prayers WHERE 1=1"
            params = []
            
            if filters.get('category'):
                sql += " AND category = ?"
                params.append(filters['category'])
            
            if filters.get('status'):
                sql += " AND status = ?"
                params.append(filters['status'])
            
            if filters.get('visibility'):
                sql += " AND visibility = ?"
                params.append(filters['visibility'])
            
            if filters.get('user_id'):
                sql += " AND created_by = ?"
                params.append(filters['user_id'])
            
            sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, skip])
            
            result = await client.execute(sql, params)
            return self._safe_dict_from_result(result, [
                'id', 'title', 'content', 'category', 'is_anonymous', 'visibility', 'status',
                'prayer_period_start', 'prayer_period_end', 'tags', 'created_by',
                'answer_content', 'answer_date', 'created_at', 'updated_at'
            ])
        finally:
            await client.close()
    
    async def get_prayer_by_id(self, prayer_id: int) -> Optional[Dict[str, Any]]:
        """기도 제목 상세 조회"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = "SELECT * FROM prayers WHERE id = ?"
            result = await client.execute(sql, [prayer_id])
            
            if not result.rows:
                return None
            
            prayers = self._safe_dict_from_result(result, [
                'id', 'title', 'content', 'category', 'is_anonymous', 'visibility', 'status',
                'prayer_period_start', 'prayer_period_end', 'tags', 'created_by',
                'answer_content', 'answer_date', 'created_at', 'updated_at'
            ])
            
            return prayers[0] if prayers else None
        finally:
            await client.close()
    
    async def create_prayer(self, prayer_data: Dict[str, Any]) -> Dict[str, Any]:
        """기도 제목 생성"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = """
                INSERT INTO prayers (
                    title, content, category, is_anonymous, visibility, status,
                    prayer_period_start, prayer_period_end, tags, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    
    async def update_prayer(self, prayer_id: int, prayer_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """기도 제목 수정"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            # 기존 데이터 확인
            existing = await self.get_prayer_by_id(prayer_id)
            if not existing:
                return None
            
            # 업데이트할 필드들
            updates = []
            params = []
            
            for field in ['title', 'content', 'category', 'is_anonymous', 'visibility', 'status',
                         'prayer_period_start', 'prayer_period_end', 'tags', 'answer_content', 'answer_date']:
                if field in prayer_data:
                    updates.append(f"{field} = ?")
                    params.append(prayer_data[field])
            
            if not updates:
                return existing
            
            updates.append("updated_at = CURRENT_TIMESTAMP")
            params.append(prayer_id)
            
            sql = f"UPDATE prayers SET {', '.join(updates)} WHERE id = ?"
            await client.execute(sql, params)
            
            return await self.get_prayer_by_id(prayer_id)
        finally:
            await client.close()
    
    async def delete_prayer(self, prayer_id: int) -> bool:
        """기도 제목 삭제"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            # 관련 데이터 삭제
            await client.execute("DELETE FROM prayer_comments WHERE prayer_id = ?", [prayer_id])
            await client.execute("DELETE FROM prayer_participants WHERE prayer_id = ?", [prayer_id])
            
            # 기도 제목 삭제
            result = await client.execute("DELETE FROM prayers WHERE id = ?", [prayer_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    # 기도 참여 관련 메서드
    async def participate_prayer(self, prayer_id: int, user_id: int) -> Dict[str, Any]:
        """기도 참여"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = """
                INSERT OR IGNORE INTO prayer_participants (prayer_id, user_id)
                VALUES (?, ?)
            """
            result = await client.execute(sql, [prayer_id, user_id])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_prayer_participants(self, prayer_id: int) -> List[Dict[str, Any]]:
        """기도 참여자 목록 조회"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = """
                SELECT pp.*, 'user' as username, 'User Name' as full_name
                FROM prayer_participants pp
                WHERE pp.prayer_id = ?
                ORDER BY pp.participated_at DESC
            """
            result = await client.execute(sql, [prayer_id])
            return self._safe_dict_from_result(result, [
                'id', 'prayer_id', 'user_id', 'participated_at', 'username', 'full_name'
            ])
        finally:
            await client.close()
    
    # 기도 댓글 관련 메서드
    async def create_prayer_comment(self, comment_data: Dict[str, Any]) -> Dict[str, Any]:
        """기도 댓글 생성"""
        await self.ensure_tables()
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
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = """
                SELECT pc.*, 'user' as username, 'User Name' as full_name
                FROM prayer_comments pc
                WHERE pc.prayer_id = ?
                ORDER BY pc.created_at ASC
            """
            result = await client.execute(sql, [prayer_id])
            return self._safe_dict_from_result(result, [
                'id', 'prayer_id', 'user_id', 'comment', 'is_anonymous', 'created_at', 'username', 'full_name'
            ])
        finally:
            await client.close()
    
    async def delete_prayer_comment(self, comment_id: int, user_id: int) -> bool:
        """기도 댓글 삭제"""
        await self.ensure_tables()
        client = await self.get_client()
        try:
            sql = "DELETE FROM prayer_comments WHERE id = ? AND user_id = ?"
            result = await client.execute(sql, [comment_id, user_id])
            return result.rows_affected > 0
        finally:
            await client.close()

# 전역 기도 서비스 인스턴스
prayer_service = PrayerService() 