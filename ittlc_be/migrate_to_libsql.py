#!/usr/bin/env python3
"""
로컬 SQLite에서 LibSQL로 마이그레이션하는 스크립트 (HTTP 연결 사용)
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# 프로젝트 루트 디렉토리를 시스템 경로에 추가
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.append(project_root)

# .env 파일 로드
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

async def migrate_to_libsql():
    """SQLite에서 LibSQL로 마이그레이션 (HTTP 연결)"""
    print("🔄 LibSQL 마이그레이션을 시작합니다... (HTTP 연결)")
    
    # 환경 변수 확인
    libsql_url = os.getenv("LIBSQL_URL")
    auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
    
    print(f"📋 환경 변수 확인:")
    print(f"   LIBSQL_URL: {libsql_url}")
    print(f"   LIBSQL_AUTH_TOKEN: {'설정됨' if auth_token else '설정되지 않음'}")
    
    if not libsql_url:
        print("❌ LIBSQL_URL 환경 변수가 설정되지 않았습니다.")
        print("📝 .env 파일에 다음을 추가하세요:")
        print("   LIBSQL_URL=libsql://ittlcdb-hozza.aws-ap-northeast-1.turso.io")
        print(f"📁 .env 파일 경로: {env_path}")
        return False
    
    if not auth_token:
        print("❌ LIBSQL_AUTH_TOKEN이 설정되지 않았습니다.")
        return False
    
    try:
        # LibSQL 클라이언트 import
        from my_libsql_client import create_client
        
        # HTTP URL로 변환
        http_url = libsql_url.replace("libsql://", "https://")
        print(f"🔄 HTTP URL로 변환: {http_url}")
        
        # LibSQL 클라이언트 생성 (HTTP)
        client = create_client(url=http_url, auth_token=auth_token)
        
        print("✅ LibSQL 클라이언트가 성공적으로 생성되었습니다!")
        
        # 테이블 생성 SQL
        create_tables_sql = [
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                username VARCHAR(50) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                is_active BOOLEAN DEFAULT 1,
                last_login DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS members (
                member_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) NOT NULL,
                age INTEGER,
                sex VARCHAR(10),
                birthday DATE,
                contact VARCHAR(20),
                address VARCHAR(255),
                job VARCHAR(100),
                email VARCHAR(100),
                baptism BOOLEAN DEFAULT 0,
                marriage BOOLEAN DEFAULT 0,
                prev_church VARCHAR(100),
                registration_date DATE,
                memo TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        ]
        
        # 테이블 생성
        for i, sql in enumerate(create_tables_sql, 1):
            print(f"📝 테이블 {i} 생성 중...")
            await client.execute(sql)
        
        print("✅ LibSQL 테이블이 성공적으로 생성되었습니다!")
        await client.close()
        
    except ImportError:
        print("❌ libsql-client 패키지가 설치되지 않았습니다.")
        print("📦 다음 명령어로 설치하세요:")
        print("   pip install libsql-client")
        return False
    except Exception as e:
        print(f"❌ 마이그레이션 중 오류가 발생했습니다: {e}")
        return False
    
    return True

if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate_to_libsql()) 