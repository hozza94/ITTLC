#!/usr/bin/env python3
"""
새로운 서비스 클래스들 테스트 스크립트
"""
import asyncio
import sys
from pathlib import Path

# 프로젝트 루트 디렉토리를 시스템 경로에 추가
project_root = str(Path(__file__).parent)
if project_root not in sys.path:
    sys.path.append(project_root)

async def test_prayer_service():
    """기도 서비스 테스트"""
    print("🙏 기도 서비스 테스트 중...")
    
    try:
        from app.services.prayer_service import prayer_service
        
        # 기도 카테고리 조회
        categories = await prayer_service.get_prayer_categories()
        print(f"  ✅ 기도 카테고리 {len(categories)}개 조회 완료")
        
        # 기도 목록 조회
        prayers = await prayer_service.get_prayers(limit=5)
        print(f"  ✅ 기도 제목 {len(prayers)}개 조회 완료")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 기도 서비스 테스트 실패: {e}")
        return False

async def test_offering_service():
    """헌금 서비스 테스트"""
    print("💰 헌금 서비스 테스트 중...")
    
    try:
        from app.services.offering_service import offering_service
        
        # 헌금 종류 조회
        types = await offering_service.get_offering_types()
        print(f"  ✅ 헌금 종류 {len(types)}개 조회 완료")
        
        # 헌금 목록 조회
        offerings = await offering_service.get_offerings(limit=5)
        print(f"  ✅ 헌금 기록 {len(offerings)}개 조회 완료")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 헌금 서비스 테스트 실패: {e}")
        return False

async def test_family_service():
    """가족 서비스 테스트"""
    print("👨‍👩‍👧‍👦 가족 서비스 테스트 중...")
    
    try:
        from app.services.family_service import family_service
        
        # 가족 목록 조회
        families = await family_service.get_families(limit=5)
        print(f"  ✅ 가족 {len(families)}개 조회 완료")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 가족 서비스 테스트 실패: {e}")
        return False

async def test_system_service():
    """시스템 서비스 테스트"""
    print("⚙️  시스템 서비스 테스트 중...")
    
    try:
        from app.services.system_service import system_service
        
        # 시스템 설정 조회
        settings = await system_service.get_settings(limit=10)
        print(f"  ✅ 시스템 설정 {len(settings)}개 조회 완료")
        
        # 대시보드 통계 조회
        stats = await system_service.get_dashboard_stats()
        print(f"  ✅ 대시보드 통계 조회 완료")
        print(f"      - 성도 수: {stats['member_count']}")
        print(f"      - 가족 수: {stats['family_count']}")
        print(f"      - 이달의 기도 제목: {stats['monthly_prayer_count']}")
        print(f"      - 이달의 헌금 총액: {stats['monthly_offering_amount']}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 시스템 서비스 테스트 실패: {e}")
        return False

async def test_libsql_service():
    """기존 LibSQL 서비스 테스트"""
    print("🗄️  기존 LibSQL 서비스 테스트 중...")
    
    try:
        from app.services.libsql_service import libsql_service
        
        # 사용자 목록 조회
        users = await libsql_service.get_users(limit=5)
        print(f"  ✅ 사용자 {len(users)}개 조회 완료")
        
        # 성도 목록 조회
        members = await libsql_service.get_members(limit=5)
        print(f"  ✅ 성도 {len(members)}개 조회 완료")
        
        return True
        
    except Exception as e:
        print(f"  ❌ 기존 LibSQL 서비스 테스트 실패: {e}")
        return False

async def main():
    """메인 실행 함수"""
    print("="*60)
    print("🧪 ITTLC 서비스 클래스 테스트")
    print("="*60)
    
    test_functions = [
        ("기존 LibSQL 서비스", test_libsql_service),
        ("기도 서비스", test_prayer_service),
        ("헌금 서비스", test_offering_service),
        ("가족 서비스", test_family_service),
        ("시스템 서비스", test_system_service)
    ]
    
    success_count = 0
    total_tests = len(test_functions)
    
    for test_name, test_func in test_functions:
        print(f"\n🔄 {test_name} 테스트...")
        if await test_func():
            success_count += 1
            print(f"✅ {test_name} 테스트 완료")
        else:
            print(f"❌ {test_name} 테스트 실패")
    
    print("\n" + "="*60)
    print(f"📊 테스트 결과: {success_count}/{total_tests} 성공")
    
    if success_count == total_tests:
        print("🎉 모든 서비스 클래스가 정상 작동합니다!")
        print("\n✨ 다음 단계:")
        print("   1. API 엔드포인트 생성")
        print("   2. 프론트엔드 페이지 구현")
        print("   3. 사용자 인터페이스 개발")
    else:
        print(f"⚠️  {total_tests - success_count}개의 서비스에서 문제가 발생했습니다.")
        print("💡 오류를 확인하고 수정해주세요.")
    
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main()) 