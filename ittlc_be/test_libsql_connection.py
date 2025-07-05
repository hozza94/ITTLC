#!/usr/bin/env python3
"""
LibSQL 연결 테스트 스크립트
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# .env 파일 로드
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

async def test_libsql_connection():
    """LibSQL 연결 테스트"""
    print("🔍 LibSQL 연결을 테스트합니다...")
    
    # 환경 변수 확인
    libsql_url = os.getenv("LIBSQL_URL")
    auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
    
    print(f"📋 환경 변수:")
    print(f"   URL: {libsql_url}")
    print(f"   토큰: {'설정됨' if auth_token else '설정되지 않음'}")
    
    if not libsql_url:
        print("❌ LIBSQL_URL이 설정되지 않았습니다.")
        return False
    
    try:
        from libsql_client import create_client
        
        print("📡 LibSQL 클라이언트 생성 중...")
        
        # 클라이언트 생성
        if auth_token:
            client = create_client(url=libsql_url, auth_token=auth_token)
        else:
            client = create_client(url=libsql_url)
        
        print("✅ 클라이언트 생성 성공!")
        
        # 간단한 쿼리 테스트
        print("🔍 연결 테스트 중...")
        result = await client.execute("SELECT 1 as test")
        
        if result and len(result.rows) > 0:
            print("✅ LibSQL 연결이 성공했습니다!")
            print(f"   테스트 결과: {result.rows[0]}")
        else:
            print("⚠️  연결은 되었지만 예상된 결과가 없습니다.")
        
        await client.close()
        return True
        
    except ImportError:
        print("❌ libsql-client 패키지가 설치되지 않았습니다.")
        print("📦 설치 명령어: pip install libsql-client")
        return False
    except Exception as e:
        print(f"❌ 연결 실패: {e}")
        print("\n🔧 해결 방법:")
        print("   1. Turso CLI로 로그인: turso auth login")
        print("   2. 토큰 생성: turso db tokens create ittlcdb-hozza")
        print("   3. .env 파일에 토큰 설정")
        print("   4. 또는 로컬 SQLite 사용: python create_tables.py")
        return False

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_libsql_connection()) 