# 로그인 기능 수정사항 문서

## 📋 개요
본 문서는 ITTLC 프로젝트에서 로그인 기능이 동작하지 않는 문제를 해결하기 위해 수행한 수정사항을 정리한 것입니다.

## 🔍 문제점
- 프론트엔드 로그인 페이지에서 하드코딩된 더미 로그인 로직 사용
- 백엔드 API와 연결되지 않음
- 실제 사용자 인증이 불가능한 상태

## 🔧 수정사항

### 1. 프론트엔드 수정 (`ittlc_fe/src/contexts/AuthContext.tsx`)

#### 수정 전
```typescript
const login = async (email: string, password: string) => {
  try {
    // TODO: Replace with actual API call
    if (email === 'admin@example.com' && password === 'password') {
      const userData = { id: '1', username: 'Admin', email };
      setUser(userData);
      document.cookie = `auth-token=dummy-token; path=/; max-age=${60 * 60 * 24}`;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

#### 수정 후
```typescript
const API_BASE_URL = 'http://localhost:8000';

const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      return false;
    }

    const data = await response.json();
    
    const userData = { 
      id: '1',
      username: email.split('@')[0],
      email 
    };
    
    setUser(userData);
    document.cookie = `auth-token=${data.access_token}; path=/; max-age=${60 * 60 * 24}`;
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

#### 주요 변경사항
- 더미 로그인 로직을 실제 백엔드 API 호출로 변경
- `http://localhost:8000/api/v1/auth/login` 엔드포인트로 POST 요청
- JWT 토큰을 응답에서 받아서 쿠키에 저장

### 2. 백엔드 수정 (`ittlc_be/app/api/v1/endpoints/auth.py`)

#### 수정 전
```python
# 실제로는 비밀번호 해시 비교 필요
if user['password_hash'] != data.password:
    raise HTTPException(status_code=401, detail='이메일 또는 비밀번호가 올바르지 않습니다.')
```

#### 수정 후
```python
import bcrypt

# bcrypt를 사용한 비밀번호 해시 비교
if not bcrypt.checkpw(data.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
    raise HTTPException(status_code=401, detail='이메일 또는 비밀번호가 올바르지 않습니다.')
```

#### 주요 변경사항
- `bcrypt` 모듈 import 추가
- 평문 비밀번호 비교를 bcrypt를 사용한 해싱 비교로 변경
- 보안성 향상

### 3. 의존성 추가 (`ittlc_be/requirements.txt`)

#### 추가된 패키지
```
bcrypt==4.0.1
PyJWT==2.8.0
```

#### 수정된 패키지
```
libsql-client==0.3.1  # 0.5.0에서 변경 (호환성 문제 해결)
```

### 4. 테스트 사용자 생성 스크립트 (`ittlc_be/create_test_user.py`)

#### 새로 생성된 파일
```python
#!/usr/bin/env python3
"""
테스트 사용자 생성 스크립트
"""

import asyncio
import bcrypt
from app.services.libsql_service import libsql_service

async def create_test_user():
    """테스트 사용자 생성"""
    email = "admin@example.com"
    password = "password"
    username = "Admin"
    
    # 이미 사용자가 있는지 확인
    existing_user = await libsql_service.get_user_by_email(email)
    if existing_user:
        print(f"✅ 사용자 {email}이 이미 존재합니다.")
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
    
    try:
        result = await libsql_service.create_user(user_data)
        print(f"✅ 테스트 사용자가 생성되었습니다:")
        print(f"   - 이메일: {email}")
        print(f"   - 비밀번호: {password}")
        print(f"   - 사용자명: {username}")
        print(f"   - 역할: admin")
        print(f"   - 사용자 ID: {result['user_id']}")
    except Exception as e:
        print(f"❌ 사용자 생성 실패: {e}")

if __name__ == "__main__":
    asyncio.run(create_test_user())
```

## 🚀 배포 및 테스트 방법

### 1. 백엔드 서버 실행
```bash
cd ittlc_be
pip install -r requirements.txt
python create_test_user.py  # 테스트 사용자 생성
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. 프론트엔드 서버 실행
```bash
cd ittlc_fe
npm run dev
```

### 3. 로그인 테스트
1. 브라우저에서 `http://localhost:3000/login` 접속
2. 테스트 계정으로 로그인:
   - 이메일: `admin@example.com`
   - 비밀번호: `password`

## 🔐 보안 개선사항

### 1. 비밀번호 해싱
- bcrypt를 사용한 안전한 비밀번호 해싱 적용
- 솔트(salt) 자동 생성으로 레인보우 테이블 공격 방어

### 2. JWT 토큰 사용
- 상태 없는(stateless) 인증 방식
- 토큰 만료 시간 설정 (24시간)

### 3. CORS 설정
- 허용된 도메인에서만 API 접근 가능
- 자격 증명(credentials) 포함된 요청 허용

## 📝 추가 개선 사항

### 1. 토큰 검증 개선
- 현재 프론트엔드에서 토큰 검증 로직 미구현
- 백엔드에서 토큰 유효성 검증 API 필요

### 2. 사용자 정보 관리
- JWT 토큰에서 사용자 정보 디코딩
- 사용자 역할별 권한 관리 시스템

### 3. 에러 처리
- 더 상세한 에러 메시지 제공
- 사용자 친화적인 에러 표시

## 🐛 알려진 이슈

### 1. 모듈 import 오류
```
ModuleNotFoundError: No module named 'app'
```
- 해결방법: `ittlc_be` 디렉터리에서 서버 실행 필요

### 2. 환경 변수 설정
- `.env` 파일의 `LIBSQL_URL`, `LIBSQL_AUTH_TOKEN` 설정 필요
- `JWT_SECRET` 설정 권장

## 📊 테스트 결과

### 생성된 테스트 사용자
- 사용자 ID: 2
- 이메일: admin@example.com
- 비밀번호: password (bcrypt 해싱됨)
- 역할: admin
- 활성 상태: true

---

**작성일**: 2024년 12월 30일  
**작성자**: AI Assistant  
**버전**: 1.0 