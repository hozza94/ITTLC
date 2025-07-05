"""
LibSQL 직접 연결 서비스
"""
import os
from typing import Optional, List, Dict, Any
from app.db.my_libsql_client import LibSQLClient
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 로드
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class LibSQLService:
    def __init__(self):
        self.libsql_url = os.getenv("LIBSQL_URL")
        self.auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        
        if not self.libsql_url:
            raise ValueError("LIBSQL_URL이 설정되지 않았습니다.")
        
        # HTTP URL로 변환 (file:// URL인 경우 그대로 사용)
        if self.libsql_url.startswith("file:"):
            self.http_url = self.libsql_url
        else:
            self.http_url = self.libsql_url.replace("libsql://", "https://")
    
    async def get_client(self):
        """LibSQL 클라이언트 반환"""
        return await LibSQLClient.create(url=self.http_url, auth_token=self.auth_token)
    
    async def close(self):
        """클라이언트 종료"""
        # 필요할 때마다 생성하므로 굳이 닫을 필요가 없습니다.
        pass
    
    # User 관련 메서드
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """사용자 생성"""
        libsql_client = await self.get_client()
        try:
            sql = """
            INSERT INTO users (email, password_hash, username, role, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """
            result = await libsql_client.execute(sql, [
                user_data['email'],
                user_data['password_hash'],
                user_data['username'],
                user_data.get('role', 'user'),
                user_data.get('is_active', True)
            ])
            return {"user_id": result.last_insert_rowid}
        finally:
            await libsql_client.close()
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """이메일로 사용자 조회"""
        libsql_client = await self.get_client()
        try:
            sql = "SELECT * FROM users WHERE email = ?"
            result = await libsql_client.execute(sql, [email])
            if result.rows:
                # 컬럼 이름을 안전하게 처리
                if hasattr(result, 'columns') and result.columns:
                    # columns가 문자열 리스트인 경우
                    if isinstance(result.columns, list) and isinstance(result.columns[0], str):
                        column_names = result.columns
                    # columns가 객체 리스트인 경우
                    elif hasattr(result.columns[0], 'name'):
                        column_names = [col.name for col in result.columns]
                    else:
                        # 기본 컬럼 이름 사용
                        column_names = ['user_id', 'email', 'password_hash', 'username', 'role', 'is_active', 'created_at', 'updated_at']
                else:
                    # 기본 컬럼 이름 사용
                    column_names = ['user_id', 'email', 'password_hash', 'username', 'role', 'is_active', 'created_at', 'updated_at']
                
                return dict(zip(column_names, result.rows[0]))
            return None
        finally:
            await libsql_client.close()
    
    async def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """ID로 사용자 조회"""
        libsql_client = await self.get_client()
        try:
            sql = "SELECT * FROM users WHERE user_id = ?"
            result = await libsql_client.execute(sql, [user_id])
            if result.rows:
                # 컬럼 이름을 안전하게 처리
                if hasattr(result, 'columns') and result.columns:
                    # columns가 문자열 리스트인 경우
                    if isinstance(result.columns, list) and isinstance(result.columns[0], str):
                        column_names = result.columns
                    # columns가 객체 리스트인 경우
                    elif hasattr(result.columns[0], 'name'):
                        column_names = [col.name for col in result.columns]
                    else:
                        # 기본 컬럼 이름 사용
                        column_names = ['user_id', 'email', 'password_hash', 'username', 'role', 'is_active', 'created_at', 'updated_at']
                else:
                    # 기본 컬럼 이름 사용
                    column_names = ['user_id', 'email', 'password_hash', 'username', 'role', 'is_active', 'created_at', 'updated_at']
                
                return dict(zip(column_names, result.rows[0]))
            return None
        finally:
            await libsql_client.close()
    
    async def get_users(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """사용자 목록 조회"""
        libsql_client = await self.get_client()
        try:
            sql = "SELECT * FROM users LIMIT ? OFFSET ?"
            result = await libsql_client.execute(sql, [limit, skip])
            
            # 컬럼 이름을 안전하게 처리
            if hasattr(result, 'columns') and result.columns:
                # columns가 문자열 리스트인 경우
                if isinstance(result.columns, list) and isinstance(result.columns[0], str):
                    column_names = result.columns
                # columns가 객체 리스트인 경우
                elif hasattr(result.columns[0], 'name'):
                    column_names = [col.name for col in result.columns]
                else:
                    # 기본 컬럼 이름 사용
                    column_names = ['user_id', 'email', 'password_hash', 'username', 'role', 'is_active', 'created_at', 'updated_at']
            else:
                # 기본 컬럼 이름 사용
                column_names = ['user_id', 'email', 'password_hash', 'username', 'role', 'is_active', 'created_at', 'updated_at']
            
            return [dict(zip(column_names, row)) for row in result.rows]
        finally:
            await libsql_client.close()
    
    # Member 관련 메서드
    async def create_member(self, member_data: Dict[str, Any]) -> Dict[str, Any]:
        """멤버 생성"""
        libsql_client = await self.get_client()
        try:
            sql = """
            INSERT INTO members (name, age, sex, birthday, contact, address, job, email, 
                               baptism, marriage, prev_church, registration_date, memo, 
                               created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """
            result = await libsql_client.execute(sql, [
                member_data['name'],
                member_data.get('age'),
                member_data.get('sex'),
                member_data.get('birthday'),
                member_data.get('contact'),
                member_data.get('address'),
                member_data.get('job'),
                member_data.get('email'),
                member_data.get('baptism', False),
                member_data.get('marriage', False),
                member_data.get('prev_church'),
                member_data.get('registration_date'),
                member_data.get('memo')
            ])
            return {"member_id": result.last_insert_rowid}
        finally:
            await libsql_client.close()
    
    async def get_member_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """이메일로 멤버 조회"""
        libsql_client = await self.get_client()
        try:
            sql = "SELECT * FROM members WHERE email = ?"
            result = await libsql_client.execute(sql, [email])
            if result.rows:
                return dict(zip([col.name for col in result.columns], result.rows[0]))
            return None
        finally:
            await libsql_client.close()
    
    async def get_member_by_id(self, member_id: int) -> Optional[Dict[str, Any]]:
        """ID로 멤버 조회"""
        libsql_client = await self.get_client()
        try:
            sql = "SELECT * FROM members WHERE member_id = ?"
            result = await libsql_client.execute(sql, [member_id])
            if result.rows:
                return dict(zip([col.name for col in result.columns], result.rows[0]))
            return None
        finally:
            await libsql_client.close()
    
    async def get_members(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """멤버 목록 조회"""
        libsql_client = await self.get_client()
        try:
            sql = "SELECT * FROM members LIMIT ? OFFSET ?"
            result = await libsql_client.execute(sql, [limit, skip])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await libsql_client.close()
    
    async def update_member(self, member_id: int, member_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """멤버 업데이트"""
        libsql_client = await self.get_client()
        try:
            # 업데이트할 필드들
            update_fields = []
            values = []
            
            for key, value in member_data.items():
                if value is not None and key != 'member_id':
                    update_fields.append(f"{key} = ?")
                    values.append(value)
            
            if not update_fields:
                return None
            
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            values.append(member_id)
            
            sql = f"UPDATE members SET {', '.join(update_fields)} WHERE member_id = ?"
            await libsql_client.execute(sql, values)
            
            return await self.get_member_by_id(member_id)
        finally:
            await libsql_client.close()
    
    async def delete_member(self, member_id: int) -> bool:
        """멤버 삭제"""
        libsql_client = await self.get_client()
        try:
            sql = "DELETE FROM members WHERE member_id = ?"
            result = await libsql_client.execute(sql, [member_id])
            return result.rows_affected > 0
        finally:
            await libsql_client.close()

# 전역 LibSQL 서비스 인스턴스
libsql_service = LibSQLService() 