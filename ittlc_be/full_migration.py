#!/usr/bin/env python3
"""
ITTLC 교회 관리 시스템 완전한 데이터베이스 마이그레이션
요구사항 정의서 기반 전체 스키마 적용
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import asyncio

# 프로젝트 루트 디렉토리를 시스템 경로에 추가
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.append(project_root)

# .env 파일 로드
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

async def run_full_migration():
    """전체 데이터베이스 스키마 마이그레이션 실행"""
    print("🚀 ITTLC 교회 관리 시스템 전체 마이그레이션을 시작합니다...")
    
    # 환경 변수 확인
    libsql_url = os.getenv("LIBSQL_URL")
    auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
    
    print(f"📋 환경 변수 확인:")
    print(f"   LIBSQL_URL: {libsql_url}")
    print(f"   LIBSQL_AUTH_TOKEN: {'✅ 설정됨' if auth_token else '❌ 설정되지 않음'}")
    
    if not libsql_url:
        print("❌ LIBSQL_URL 환경 변수가 설정되지 않았습니다.")
        print("📝 .env 파일에 다음을 추가하세요:")
        print("   LIBSQL_URL=libsql://your-database-url")
        return False
    
    if not auth_token:
        print("❌ LIBSQL_AUTH_TOKEN이 설정되지 않았습니다.")
        return False
    
    try:
        # LibSQL 클라이언트 import
        from libsql_client import create_client
        
        # HTTP URL로 변환
        http_url = libsql_url.replace("libsql://", "https://")
        print(f"🔄 HTTP URL로 변환: {http_url}")
        
        # LibSQL 클라이언트 생성 (HTTP)
        print("🔌 LibSQL 클라이언트에 연결 중...")
        client = create_client(url=http_url, auth_token=auth_token)
        print("✅ LibSQL 클라이언트 연결 성공!")
        
        # 스키마 파일 읽기
        schema_file = Path(__file__).parent / 'database_schema.sql'
        if not schema_file.exists():
            print(f"❌ 스키마 파일을 찾을 수 없습니다: {schema_file}")
            return False
        
        print("📖 데이터베이스 스키마 파일을 읽는 중...")
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_content = f.read()
        
        # SQL 문장들을 분리
        sql_statements = []
        current_statement = ""
        
        for line in schema_content.split('\n'):
            line = line.strip()
            # 주석이나 빈 줄 건너뛰기
            if not line or line.startswith('--'):
                continue
            
            current_statement += line + '\n'
            
            # SQL 문장이 세미콜론으로 끝나면 완료
            if line.rstrip().endswith(';'):
                if current_statement.strip():
                    sql_statements.append(current_statement.strip())
                current_statement = ""
        
        print(f"📝 총 {len(sql_statements)}개의 SQL 문장을 실행합니다...")
        
        # 각 SQL 문장 실행
        success_count = 0
        error_count = 0
        
        for i, sql in enumerate(sql_statements, 1):
            try:
                # SQL 문장 미리보기 (처음 50자)
                preview = sql[:50].replace('\n', ' ').strip()
                if len(sql) > 50:
                    preview += "..."
                
                print(f"  [{i:3d}/{len(sql_statements)}] {preview}")
                
                await client.execute(sql)
                success_count += 1
                
            except Exception as e:
                print(f"  ❌ 오류 발생: {str(e)}")
                error_count += 1
                # 계속 진행 (일부 오류는 무시 가능할 수 있음)
        
        print(f"\n📊 마이그레이션 완료:")
        print(f"   ✅ 성공: {success_count}개")
        print(f"   ❌ 오류: {error_count}개")
        
        # 클라이언트 종료
        await client.close()
        print("🔌 데이터베이스 연결을 종료했습니다.")
        
        if error_count == 0:
            print("🎉 모든 스키마가 성공적으로 적용되었습니다!")
        else:
            print("⚠️  일부 오류가 있었지만 마이그레이션이 완료되었습니다.")
        
        return True
        
    except ImportError as e:
        print(f"❌ 필요한 패키지를 가져올 수 없습니다: {e}")
        print("📦 다음 명령어로 설치하세요:")
        print("   pip install libsql-client python-dotenv")
        return False
    except Exception as e:
        print(f"❌ 마이그레이션 중 오류가 발생했습니다: {e}")
        return False

async def verify_migration():
    """마이그레이션 결과 검증"""
    print("\n🔍 마이그레이션 결과를 검증하는 중...")
    
    try:
        from libsql_client import create_client
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 테이블 목록 조회
        result = await client.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
        """)
        
        expected_tables = [
            'users', 'families', 'members', 'member_history',
            'prayer_categories', 'prayers', 'prayer_participants', 'prayer_comments',
            'offering_types', 'offerings',
            'system_settings', 'system_logs', 'backup_history'
        ]
        
        existing_tables = [row[0] for row in result.rows] if result.rows else []
        
        print(f"📋 생성된 테이블 ({len(existing_tables)}개):")
        for table in existing_tables:
            status = "✅" if table in expected_tables else "⚠️"
            print(f"   {status} {table}")
        
        missing_tables = set(expected_tables) - set(existing_tables)
        if missing_tables:
            print(f"\n❌ 누락된 테이블 ({len(missing_tables)}개):")
            for table in missing_tables:
                print(f"   🔴 {table}")
        
        await client.close()
        
        if not missing_tables:
            print("\n🎉 모든 필수 테이블이 성공적으로 생성되었습니다!")
            return True
        else:
            print(f"\n⚠️  {len(missing_tables)}개의 테이블이 누락되었습니다.")
            return False
            
    except Exception as e:
        print(f"❌ 검증 중 오류가 발생했습니다: {e}")
        return False

async def main():
    """메인 실행 함수"""
    print("="*60)
    print("🏛️  ITTLC 교회 관리 시스템 데이터베이스 마이그레이션")
    print("="*60)
    
    # 마이그레이션 실행
    migration_success = await run_full_migration()
    
    if migration_success:
        # 결과 검증
        verification_success = await verify_migration()
        
        if verification_success:
            print("\n" + "="*60)
            print("🎊 마이그레이션이 성공적으로 완료되었습니다!")
            print("✨ 이제 다음 단계를 진행할 수 있습니다:")
            print("   1. 기본 데이터 시딩")
            print("   2. API 서비스 개발")
            print("   3. 프론트엔드 연동")
            print("="*60)
        else:
            print("\n❌ 마이그레이션 검증에 실패했습니다.")
    else:
        print("\n❌ 마이그레이션에 실패했습니다.")

if __name__ == "__main__":
    asyncio.run(main()) 