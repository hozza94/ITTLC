# backend/app/db/test_db_connection.py
import sys
import os
import asyncio

# 환경 변수 설정 (로컬 SQLite 파일 사용)
os.environ['LIBSQL_URL'] = 'file:test.db'
# AUTH_TOKEN은 로컬 파일에서는 필요없음
if 'LIBSQL_AUTH_TOKEN' in os.environ:
    del os.environ['LIBSQL_AUTH_TOKEN']

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from app.services.libsql_service import libsql_service

async def create_users_table():
    """users 테이블 생성"""
    libsql_client = await libsql_service.get_client()
    try:
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            username TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        await libsql_client.execute(create_table_sql)
        print('users 테이블 생성 완료')
    finally:
        await libsql_client.close()

async def add_sample_user():
    user_data = {
        'email': 'user@example.com',
        'password_hash': '1234',  # 실제 환경에서는 해시 사용 필요
        'username': 'SampleUser',
        'role': 'user',
        'is_active': True
    }
    result = await libsql_service.create_user(user_data)
    print('샘플 유저 추가 결과:', result)

async def main():
    await create_users_table()
    await add_sample_user()

if __name__ == '__main__':
    asyncio.run(main())