#!/usr/bin/env python3
"""
간단한 데이터베이스 연결 및 서비스 테스트
"""
import asyncio
import sys
from pathlib import Path

# 프로젝트 루트 디렉토리를 시스템 경로에 추가
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.append(project_root)

async def test_basic_connection():
    """기본 데이터베이스 연결 테스트"""
    print("🔌 기본 데이터베이스 연결 테스트...")
    
    try:
        from libsql_client import create_client
        import os
        from dotenv import load_dotenv
        
        env_path = Path(__file__).parent / '.env'
        load_dotenv(env_path)
        
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 테이블 목록 조회
        result = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in result.rows]
        
        print(f"  ✅ 연결 성공! 테이블 {len(tables)}개 발견")
        for table in tables:
            print(f"     - {table}")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"  ❌ 연결 실패: {e}")
        return False

async def test_prayer_categories():
    """기도 카테고리 테스트"""
    print("🙏 기도 카테고리 테스트...")
    
    try:
        from libsql_client import create_client
        import os
        from dotenv import load_dotenv
        
        env_path = Path(__file__).parent / '.env'
        load_dotenv(env_path)
        
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 기도 카테고리 조회
        result = await client.execute("SELECT * FROM prayer_categories")
        categories = result.rows
        
        print(f"  ✅ 기도 카테고리 {len(categories)}개 조회 완료")
        for category in categories[:3]:  # 처음 3개만 표시
            print(f"     - {category[1]}")  # name 컬럼
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"  ❌ 기도 카테고리 테스트 실패: {e}")
        return False

async def test_offering_types():
    """헌금 종류 테스트"""
    print("💰 헌금 종류 테스트...")
    
    try:
        from libsql_client import create_client
        import os
        from dotenv import load_dotenv
        
        env_path = Path(__file__).parent / '.env'
        load_dotenv(env_path)
        
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 헌금 종류 조회
        result = await client.execute("SELECT * FROM offering_types")
        types = result.rows
        
        print(f"  ✅ 헌금 종류 {len(types)}개 조회 완료")
        for offering_type in types[:3]:  # 처음 3개만 표시
            print(f"     - {offering_type[1]}")  # name 컬럼
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"  ❌ 헌금 종류 테스트 실패: {e}")
        return False

async def test_system_settings():
    """시스템 설정 테스트"""
    print("⚙️  시스템 설정 테스트...")
    
    try:
        from libsql_client import create_client
        import os
        from dotenv import load_dotenv
        
        env_path = Path(__file__).parent / '.env'
        load_dotenv(env_path)
        
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 시스템 설정 조회
        result = await client.execute("SELECT * FROM system_settings LIMIT 5")
        settings = result.rows
        
        print(f"  ✅ 시스템 설정 {len(settings)}개 조회 완료")
        for setting in settings[:3]:  # 처음 3개만 표시
            print(f"     - {setting[1]}: {setting[2]}")  # key: value
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"  ❌ 시스템 설정 테스트 실패: {e}")
        return False

async def main():
    """메인 실행 함수"""
    print("="*60)
    print("🧪 ITTLC 간단한 데이터베이스 테스트")
    print("="*60)
    
    test_functions = [
        ("기본 연결", test_basic_connection),
        ("기도 카테고리", test_prayer_categories),
        ("헌금 종류", test_offering_types),
        ("시스템 설정", test_system_settings)
    ]
    
    success_count = 0
    total_tests = len(test_functions)
    
    for test_name, test_func in test_functions:
        print(f"\n🔄 {test_name} 테스트...")
        if await test_func():
            success_count += 1
            print(f"✅ {test_name} 테스트 성공")
        else:
            print(f"❌ {test_name} 테스트 실패")
    
    print("\n" + "="*60)
    print(f"📊 테스트 결과: {success_count}/{total_tests} 성공")
    
    if success_count == total_tests:
        print("🎉 데이터베이스 연결 및 기본 기능이 정상 작동합니다!")
        print("\n✨ 다음 단계로 진행할 수 있습니다:")
        print("   1. API 엔드포인트 개발")
        print("   2. 프론트엔드 인터페이스 구현")
    else:
        print(f"⚠️  {total_tests - success_count}개의 테스트에서 문제가 발생했습니다.")
    
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main()) 