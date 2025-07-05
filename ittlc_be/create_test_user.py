#!/usr/bin/env python3
"""
테스트 사용자 생성 스크립트
"""

import sys
import os
import asyncio
import bcrypt

# 현재 디렉터리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.libsql_service import libsql_service

async def create_test_user():
    """테스트 사용자 생성"""
    email = "admin@example.com"
    password = "password"
    username = "Admin"
    
    print("🚀 테스트 사용자 생성을 시작합니다...")
    
    try:
        # 이미 사용자가 있는지 확인
        existing_user = await libsql_service.get_user_by_email(email)
        if existing_user:
            print(f"✅ 사용자 {email}이 이미 존재합니다.")
            print(f"   - 사용자 ID: {existing_user.get('user_id', existing_user.get('id'))}")
            print(f"   - 사용자명: {existing_user.get('username')}")
            print(f"   - 역할: {existing_user.get('role')}")
            return
        
        # 비밀번호 해싱
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # 사용자 데이터
        user_data = {
            'email': email,
            'password_hash': password_hash,
            'username': username,
            'role': 'admin',
            'is_active': True
        }
        
        result = await libsql_service.create_user(user_data)
        print(f"✅ 테스트 사용자가 성공적으로 생성되었습니다!")
        print(f"   - 이메일: {email}")
        print(f"   - 비밀번호: {password}")
        print(f"   - 사용자명: {username}")
        print(f"   - 역할: admin")
        print(f"   - 사용자 ID: {result['user_id']}")
        print("")
        print("🎉 이제 로그인 페이지에서 위 계정으로 로그인할 수 있습니다!")
        
    except Exception as e:
        print(f"❌ 사용자 생성 중 오류가 발생했습니다: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(create_test_user()) 