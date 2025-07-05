# 트러블슈팅 가이드

## 📋 개요
ITTLC 프로젝트에서 발생할 수 있는 주요 문제점과 해결방법을 정리한 문서입니다.

## 🚫 백엔드 서버 실행 오류

### 1. ModuleNotFoundError: No module named 'app'

#### 오류 메시지
```
ModuleNotFoundError: No module named 'app'
```

#### 원인
- 잘못된 디렉터리에서 서버 실행
- Python 모듈 경로 설정 문제

#### 해결방법

##### 방법 1: 올바른 디렉터리에서 실행
```bash
# 현재 디렉터리 확인
pwd

# ittlc_be 디렉터리로 이동
cd ittlc_be

# 서버 실행
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

##### 방법 2: PYTHONPATH 환경변수 설정
```bash
# Windows (Git Bash)
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Windows (Command Prompt)
set PYTHONPATH=%PYTHONPATH%;%CD%
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

##### 방법 3: Python 모듈로 실행
```bash
# ittlc_be 디렉터리에서
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. 포트 충돌 오류

#### 오류 메시지
```
OSError: [Errno 98] Address already in use
```

#### 해결방법
```bash
# 포트 8000을 사용하는 프로세스 확인
netstat -tulpn | grep :8000

# 프로세스 종료 (PID 확인 후)
kill -9 <PID>

# 또는 다른 포트 사용
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. 의존성 설치 문제

#### 오류 메시지
```
ERROR: Could not find a version that satisfies the requirement libsql-client==0.5.0
```

#### 해결방법
```bash
# 호환 가능한 버전으로 수정
pip install libsql-client==0.3.1

# 또는 requirements.txt 수정 후
pip install -r requirements.txt
```

## 🔗 프론트엔드 연결 오류

### 1. CORS 오류

#### 오류 메시지
```
Access to fetch at 'http://localhost:8000/api/v1/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

#### 해결방법
백엔드 `main.py`에서 CORS 설정 확인:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. API 엔드포인트 404 오류

#### 원인
- 백엔드 서버가 실행되지 않음
- 잘못된 API 엔드포인트 URL

#### 해결방법
```bash
# 백엔드 서버 상태 확인
curl http://localhost:8000/health

# API 문서 확인
curl http://localhost:8000/docs
```

## 🗃️ 데이터베이스 연결 오류

### 1. LibSQL 연결 실패

#### 오류 메시지
```
❌ LibSQL 연결 실패: Connection failed
```

#### 해결방법
1. `.env` 파일 확인:
```bash
# .env 파일 생성 (ittlc_be 디렉터리)
LIBSQL_URL=your_libsql_url
LIBSQL_AUTH_TOKEN=your_auth_token
JWT_SECRET=your_jwt_secret
```

2. 환경변수 로드 확인:
```python
# load_env.py 실행
python load_env.py
```

### 2. 테이블 없음 오류

#### 해결방법
```bash
# 데이터베이스 스키마 확인
python -c "
from app.services.libsql_service import libsql_service
import asyncio

async def check_tables():
    client = await libsql_service.get_client()
    result = await client.execute('SELECT name FROM sqlite_master WHERE type=\"table\"')
    print('Tables:', [row[0] for row in result.rows])
    await client.close()

asyncio.run(check_tables())
"
```

## 🔐 인증 관련 오류

### 1. 비밀번호 해싱 오류

#### 오류 메시지
```
TypeError: a bytes-like object is required, not 'str'
```

#### 해결방법
```python
# 올바른 bcrypt 사용법
import bcrypt

# 해싱 시
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# 검증 시
bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
```

### 2. JWT 토큰 오류

#### 오류 메시지
```
jwt.InvalidTokenError: Invalid token
```

#### 해결방법
```python
# JWT 토큰 디코딩
import jwt
from datetime import datetime, timedelta

# 토큰 생성
token = jwt.encode({
    'sub': user_id,
    'exp': datetime.utcnow() + timedelta(hours=24)
}, SECRET_KEY, algorithm='HS256')

# 토큰 검증
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
except jwt.ExpiredSignatureError:
    print("토큰 만료")
except jwt.InvalidTokenError:
    print("유효하지 않은 토큰")
```

## 🛠️ 개발 환경 설정 문제

### 1. 가상환경 활성화

#### Windows
```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화
source venv/Scripts/activate

# 또는 Git Bash에서
source venv/Scripts/activate
```

#### macOS/Linux
```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화
source venv/bin/activate
```

### 2. Node.js 의존성 문제

#### 해결방법
```bash
# Node.js 버전 확인
node --version
npm --version

# 의존성 재설치
cd ittlc_fe
rm -rf node_modules package-lock.json
npm install

# 또는 yarn 사용
yarn install
```

## 📊 로그 및 디버깅

### 1. 백엔드 로그 확인
```bash
# 상세 로그로 서버 실행
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

### 2. 프론트엔드 디버깅
```javascript
// 브라우저 개발자 도구 콘솔에서
localStorage.getItem('auth-token')
document.cookie
```

### 3. API 테스트
```bash
# curl로 API 테스트
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

## 🔍 성능 모니터링

### 1. 메모리 사용량 확인
```bash
# 프로세스 모니터링
ps aux | grep uvicorn
ps aux | grep node
```

### 2. 데이터베이스 연결 상태
```bash
# 연결 테스트
python -c "
from app.services.libsql_service import libsql_service
import asyncio
import time

async def test_connection():
    start = time.time()
    client = await libsql_service.get_client()
    result = await client.execute('SELECT 1')
    end = time.time()
    print(f'연결 시간: {end - start:.2f}초')
    await client.close()

asyncio.run(test_connection())
"
```

## 📞 추가 지원

### 문제 해결이 안 될 경우
1. 로그 파일 전체 내용 확인
2. 환경 변수 설정 재확인
3. 의존성 버전 호환성 확인
4. 네트워크 방화벽 설정 확인

### 유용한 명령어
```bash
# 전체 시스템 상태 확인
systemctl status    # Linux
netstat -tulpn      # 포트 사용 현황
ps aux             # 프로세스 목록
df -h              # 디스크 사용량
free -h            # 메모리 사용량
```

---

**작성일**: 2024년 12월 30일  
**작성자**: AI Assistant  
**버전**: 1.0 