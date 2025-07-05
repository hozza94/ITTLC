"""
LibSQL 클라이언트 설정
"""
import os
from libsql_client import create_client
from typing import Optional

class LibSQLClient:
    def __init__(self, client):
        self.client = client

    @classmethod
    async def create(cls, url=None, auth_token=None):
        url = url or os.getenv("LIBSQL_URL", "libsql://ittlcdb-hozza.aws-ap-northeast-1.turso.io")
        auth_token = auth_token or os.getenv("LIBSQL_AUTH_TOKEN")
        if auth_token:
            client = create_client(
                url=url,
                auth_token=auth_token
            )
        else:
            client = create_client(url=url)
        return cls(client)

    async def execute(self, sql: str, params: Optional[list] = None):
        """SQL 실행"""
        if params:
            return await self.client.execute(sql, params)
        return await self.client.execute(sql)
    
    async def batch(self, statements: list):
        """배치 실행"""
        return await self.client.batch(statements)
    
    async def close(self):
        """클라이언트 종료"""
        await self.client.close()

# 전역 인스턴스 제거 (필요할 때 async로 생성) 