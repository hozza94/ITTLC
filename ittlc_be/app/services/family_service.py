"""
가족 관리 서비스
"""
import os
from typing import Optional, List, Dict, Any
from libsql_client import create_client
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 로드
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class FamilyService:
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
    
    # 가족 관련 메서드
    async def create_family(self, family_data: Dict[str, Any]) -> Dict[str, Any]:
        """가족 생성"""
        client = await self.get_client()
        try:
            sql = """
            INSERT INTO families (family_name, head_member_id, address)
            VALUES (?, ?, ?)
            """
            result = await client.execute(sql, [
                family_data['family_name'],
                family_data.get('head_member_id'),
                family_data.get('address')
            ])
            return {"id": result.last_insert_rowid}
        finally:
            await client.close()
    
    async def get_family_by_id(self, family_id: int) -> Optional[Dict[str, Any]]:
        """ID로 가족 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT f.*, m.name as head_member_name
            FROM families f
            LEFT JOIN members m ON f.head_member_id = m.id
            WHERE f.id = ?
            """
            result = await client.execute(sql, [family_id])
            if result.rows:
                return dict(zip([col.name for col in result.columns], result.rows[0]))
            return None
        finally:
            await client.close()
    
    async def get_families(self, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        """가족 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT f.*, m.name as head_member_name,
                   (SELECT COUNT(*) FROM members WHERE family_id = f.id) as member_count
            FROM families f
            LEFT JOIN members m ON f.head_member_id = m.id
            ORDER BY f.family_name
            LIMIT ? OFFSET ?
            """
            result = await client.execute(sql, [limit, skip])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def get_family_members(self, family_id: int) -> List[Dict[str, Any]]:
        """가족 구성원 목록 조회"""
        client = await self.get_client()
        try:
            sql = """
            SELECT * FROM members
            WHERE family_id = ?
            ORDER BY family_role, birth_date
            """
            result = await client.execute(sql, [family_id])
            return [dict(zip([col.name for col in result.columns], row)) for row in result.rows]
        finally:
            await client.close()
    
    async def update_family(self, family_id: int, family_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """가족 정보 업데이트"""
        client = await self.get_client()
        try:
            update_fields = []
            values = []
            
            for key, value in family_data.items():
                if value is not None and key != 'id':
                    update_fields.append(f"{key} = ?")
                    values.append(value)
            
            if not update_fields:
                return None
            
            values.append(family_id)
            
            sql = f"UPDATE families SET {', '.join(update_fields)} WHERE id = ?"
            await client.execute(sql, values)
            
            return await self.get_family_by_id(family_id)
        finally:
            await client.close()
    
    async def delete_family(self, family_id: int) -> bool:
        """가족 삭제"""
        client = await self.get_client()
        try:
            # 먼저 가족 구성원들의 family_id를 NULL로 설정
            await client.execute("UPDATE members SET family_id = NULL WHERE family_id = ?", [family_id])
            
            # 가족 삭제
            sql = "DELETE FROM families WHERE id = ?"
            result = await client.execute(sql, [family_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    async def add_member_to_family(self, family_id: int, member_id: int, family_role: str = "자녀") -> bool:
        """가족에 구성원 추가"""
        client = await self.get_client()
        try:
            sql = "UPDATE members SET family_id = ?, family_role = ? WHERE id = ?"
            result = await client.execute(sql, [family_id, family_role, member_id])
            return result.rows_affected > 0
        finally:
            await client.close()
    
    async def remove_member_from_family(self, member_id: int) -> bool:
        """가족에서 구성원 제거"""
        client = await self.get_client()
        try:
            sql = "UPDATE members SET family_id = NULL, family_role = NULL WHERE id = ?"
            result = await client.execute(sql, [member_id])
            return result.rows_affected > 0
        finally:
            await client.close()

# 전역 가족 서비스 인스턴스
family_service = FamilyService() 