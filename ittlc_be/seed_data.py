#!/usr/bin/env python3
"""
ITTLC 교회 관리 시스템 기본 데이터 시딩
기도 카테고리, 헌금 종류, 시스템 설정 등의 초기 데이터 삽입
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import asyncio
from datetime import datetime

# 프로젝트 루트 디렉토리를 시스템 경로에 추가
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.append(project_root)

# .env 파일 로드
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

async def seed_prayer_categories():
    """기도 카테고리 기본 데이터 시딩"""
    print("📿 기도 카테고리 데이터를 추가하는 중...")
    
    categories = [
        ("개인 기도", "개인적인 기도 제목", "#3B82F6"),
        ("가족 기도", "가족을 위한 기도 제목", "#10B981"),
        ("건강 기도", "건강과 치유를 위한 기도", "#EF4444"),
        ("사업/직장 기도", "사업과 직장을 위한 기도", "#F59E0B"),
        ("선교 기도", "선교와 전도를 위한 기도", "#8B5CF6"),
        ("교회 기도", "교회와 공동체를 위한 기도", "#06B6D4"),
        ("감사 기도", "감사와 찬양의 기도", "#F97316"),
        ("기타", "기타 기도 제목", "#6B7280")
    ]
    
    try:
        from libsql_client import create_client
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        for name, description, color in categories:
            try:
                await client.execute(
                    "INSERT OR IGNORE INTO prayer_categories (name, description, color) VALUES (?, ?, ?)",
                    [name, description, color]
                )
                print(f"  ✅ {name}")
            except Exception as e:
                print(f"  ❌ {name}: {e}")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"❌ 기도 카테고리 시딩 중 오류: {e}")
        return False

async def seed_offering_types():
    """헌금 종류 기본 데이터 시딩"""
    print("💰 헌금 종류 데이터를 추가하는 중...")
    
    offering_types = [
        ("십일조", "정기적인 십일조 헌금"),
        ("감사헌금", "감사의 마음으로 드리는 헌금"),
        ("선교헌금", "선교 사역을 위한 헌금"),
        ("건축헌금", "교회 건축을 위한 헌금"),
        ("특별헌금", "특별한 목적을 위한 헌금"),
        ("절기헌금", "절기에 드리는 헌금"),
        ("생일헌금", "생일을 맞아 드리는 헌금"),
        ("기타", "기타 헌금")
    ]
    
    try:
        from libsql_client import create_client
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        for name, description in offering_types:
            try:
                await client.execute(
                    "INSERT OR IGNORE INTO offering_types (name, description) VALUES (?, ?)",
                    [name, description]
                )
                print(f"  ✅ {name}")
            except Exception as e:
                print(f"  ❌ {name}: {e}")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"❌ 헌금 종류 시딩 중 오류: {e}")
        return False

async def seed_system_settings():
    """시스템 설정 기본 데이터 시딩"""
    print("⚙️  시스템 설정 데이터를 추가하는 중...")
    
    settings = [
        # 기본 교회 정보
        ("church_name", "ITTLC", "string", "교회명"),
        ("church_address", "", "string", "교회 주소"),
        ("church_phone", "", "string", "교회 전화번호"),
        ("church_email", "", "string", "교회 이메일"),
        
        # 시스템 설정
        ("site_title", "ITTLC 교회 관리 시스템", "string", "사이트 제목"),
        ("default_language", "ko", "string", "기본 언어"),
        ("timezone", "Asia/Seoul", "string", "타임존"),
        ("date_format", "YYYY-MM-DD", "string", "날짜 형식"),
        ("currency", "KRW", "string", "화폐 단위"),
        
        # 보안 설정
        ("password_min_length", "8", "number", "최소 비밀번호 길이"),
        ("session_timeout", "3600", "number", "세션 타임아웃 (초)"),
        ("max_login_attempts", "5", "number", "최대 로그인 시도 횟수"),
        ("account_lock_duration", "1800", "number", "계정 잠금 시간 (초)"),
        
        # 기능 설정
        ("enable_member_registration", "true", "boolean", "성도 등록 기능 활성화"),
        ("enable_prayer_comments", "true", "boolean", "기도 댓글 기능 활성화"),
        ("enable_anonymous_prayers", "true", "boolean", "익명 기도 기능 활성화"),
        ("enable_offering_statistics", "true", "boolean", "헌금 통계 기능 활성화"),
        
        # 이메일 설정
        ("smtp_server", "", "string", "SMTP 서버"),
        ("smtp_port", "587", "number", "SMTP 포트"),
        ("smtp_username", "", "string", "SMTP 사용자명"),
        ("email_from_name", "ITTLC", "string", "발신자 이름"),
        ("email_from_address", "", "string", "발신자 이메일"),
        
        # 백업 설정
        ("auto_backup_enabled", "false", "boolean", "자동 백업 활성화"),
        ("backup_retention_days", "30", "number", "백업 보관 일수"),
        
        # UI 설정
        ("items_per_page", "20", "number", "페이지당 항목 수"),
        ("enable_dark_mode", "true", "boolean", "다크 모드 지원"),
        ("default_theme", "light", "string", "기본 테마")
    ]
    
    try:
        from libsql_client import create_client
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        for setting_key, setting_value, setting_type, description in settings:
            try:
                await client.execute(
                    """INSERT OR IGNORE INTO system_settings 
                       (setting_key, setting_value, setting_type, description) 
                       VALUES (?, ?, ?, ?)""",
                    [setting_key, setting_value, setting_type, description]
                )
                print(f"  ✅ {setting_key}: {setting_value}")
            except Exception as e:
                print(f"  ❌ {setting_key}: {e}")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"❌ 시스템 설정 시딩 중 오류: {e}")
        return False

async def seed_admin_user():
    """기본 관리자 계정 생성"""
    print("👤 기본 관리자 계정을 생성하는 중...")
    
    try:
        from libsql_client import create_client
        import hashlib
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 기본 관리자 정보
        admin_email = "admin@ittlc.org"
        admin_username = "admin"
        admin_password = "admin123!"  # 실제 사용시 변경 필요
        admin_name = "시스템 관리자"
        
        # 비밀번호 해시화 (실제로는 bcrypt 등 사용 권장)
        password_hash = hashlib.sha256(admin_password.encode()).hexdigest()
        
        # 기존 관리자 계정 확인
        result = await client.execute(
            "SELECT id FROM users WHERE email = ? OR username = ?",
            [admin_email, admin_username]
        )
        
        if result.rows:
            print(f"  ⚠️  관리자 계정이 이미 존재합니다: {admin_email}")
        else:
            await client.execute(
                """INSERT INTO users 
                   (email, username, password_hash, full_name, role, is_active) 
                   VALUES (?, ?, ?, ?, ?, ?)""",
                [admin_email, admin_username, password_hash, admin_name, "admin", True]
            )
            print(f"  ✅ 관리자 계정 생성 완료")
            print(f"     📧 이메일: {admin_email}")
            print(f"     👤 사용자명: {admin_username}")
            print(f"     🔑 비밀번호: {admin_password}")
            print(f"     ⚠️  보안을 위해 첫 로그인 후 비밀번호를 변경하세요!")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"❌ 관리자 계정 생성 중 오류: {e}")
        return False

async def seed_system_logs():
    """시스템 로그 기본 데이터 시딩"""
    print("📋 시스템 로그 데이터를 추가하는 중...")
    
    logs = [
        ("INFO", "시스템", "시스템이 시작되었습니다", None, None),
        ("INFO", "사용자", "관리자 계정이 생성되었습니다", None, None),
        ("INFO", "기도", "기도 카테고리가 초기화되었습니다", None, None),
        ("INFO", "헌금", "헌금 종류가 초기화되었습니다", None, None),
        ("INFO", "설정", "시스템 설정이 초기화되었습니다", None, None),
        ("INFO", "데이터베이스", "데이터베이스 마이그레이션이 완료되었습니다", None, None),
        ("INFO", "백업", "데이터베이스 백업이 완료되었습니다", None, None),
        ("WARNING", "보안", "비밀번호 정책이 업데이트되었습니다", None, None),
        ("INFO", "시스템", "시스템 점검이 완료되었습니다", None, None),
        ("INFO", "사용자", "사용자 권한이 업데이트되었습니다", None, None)
    ]
    
    try:
        from libsql_client import create_client
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        for log_level, log_type, message, ip_address, user_agent in logs:
            try:
                await client.execute(
                    """INSERT INTO system_logs 
                       (log_level, log_type, message, ip_address, user_agent) 
                       VALUES (?, ?, ?, ?, ?)""",
                    [log_level, log_type, message, ip_address, user_agent]
                )
                print(f"  ✅ {log_type}: {message}")
            except Exception as e:
                print(f"  ❌ {log_type}: {e}")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"❌ 시스템 로그 시딩 중 오류: {e}")
        return False

async def create_sample_data():
    """샘플 데이터 생성 (선택사항)"""
    print("📝 샘플 데이터를 생성하는 중...")
    
    try:
        from libsql_client import create_client
        from datetime import date
        
        # HTTP URL로 변환
        libsql_url = os.getenv("LIBSQL_URL")
        auth_token = os.getenv("LIBSQL_AUTH_TOKEN")
        http_url = libsql_url.replace("libsql://", "https://")
        
        client = create_client(url=http_url, auth_token=auth_token)
        
        # 관리자 ID 조회
        admin_result = await client.execute(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        )
        
        if not admin_result.rows:
            print("  ⚠️  관리자 계정을 찾을 수 없어 샘플 데이터 생성을 건너뜁니다.")
            await client.close()
            return True
        
        admin_id = admin_result.rows[0][0]
        
        # 샘플 성도 데이터
        sample_members = [
            ("김철수", "1980-05-15", "남", "010-1234-5678", "서울시 강남구"),
            ("이영희", "1985-08-22", "여", "010-2345-6789", "서울시 서초구"),
            ("박민수", "1990-12-03", "남", "010-3456-7890", "서울시 송파구")
        ]
        
        member_ids = []
        for name, birth_date, gender, phone, address in sample_members:
            try:
                result = await client.execute(
                    """INSERT INTO members 
                       (name, birth_date, gender, phone, address, registration_date, created_by) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    [name, birth_date, gender, phone, address, date.today().isoformat(), admin_id]
                )
                member_ids.append(result.last_insert_rowid)
                print(f"  ✅ 샘플 성도: {name}")
            except Exception as e:
                print(f"  ❌ 샘플 성도 {name}: {e}")
        
        # 샘플 기도 제목
        if member_ids:
            sample_prayers = [
                ("가족의 건강을 위한 기도", "가족 모두가 건강하게 지낼 수 있도록 기도해주세요.", "건강 기도"),
                ("새로운 직장을 위한 기도", "하나님의 뜻에 맞는 직장을 찾을 수 있도록 기도해주세요.", "사업/직장 기도"),
                ("교회 부흥을 위한 기도", "우리 교회가 하나님의 뜻대로 부흥할 수 있도록 기도해주세요.", "교회 기도")
            ]
            
            for title, content, category in sample_prayers:
                try:
                    await client.execute(
                        """INSERT INTO prayers 
                           (title, content, category, created_by) 
                           VALUES (?, ?, ?, ?)""",
                        [title, content, category, admin_id]
                    )
                    print(f"  ✅ 샘플 기도: {title}")
                except Exception as e:
                    print(f"  ❌ 샘플 기도 {title}: {e}")
        
        await client.close()
        return True
        
    except Exception as e:
        print(f"❌ 샘플 데이터 생성 중 오류: {e}")
        return False

async def main():
    """메인 실행 함수"""
    print("="*60)
    print("🌱 ITTLC 교회 관리 시스템 데이터 시딩")
    print("="*60)
    
    success_count = 0
    total_tasks = 6
    
    tasks = [
        ("기도 카테고리", seed_prayer_categories),
        ("헌금 종류", seed_offering_types),
        ("시스템 설정", seed_system_settings),
        ("관리자 계정", seed_admin_user),
        ("시스템 로그", seed_system_logs),
        ("샘플 데이터", create_sample_data)
    ]
    
    for task_name, task_func in tasks:
        print(f"\n🔄 {task_name} 처리 중...")
        if await task_func():
            success_count += 1
            print(f"✅ {task_name} 완료")
        else:
            print(f"❌ {task_name} 실패")
    
    print("\n" + "="*60)
    print(f"📊 시딩 결과: {success_count}/{total_tasks} 완료")
    
    if success_count == total_tasks:
        print("🎉 모든 기본 데이터가 성공적으로 추가되었습니다!")
        print("\n✨ 다음 단계:")
        print("   1. 백엔드 API 서비스 개발")
        print("   2. 프론트엔드 페이지 구현")
        print("   3. 사용자 테스트")
    else:
        print(f"⚠️  {total_tasks - success_count}개의 작업에서 오류가 발생했습니다.")
        print("💡 오류를 확인하고 다시 실행해보세요.")
    
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main()) 