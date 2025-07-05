# ITTL Backend (LibSQL)

ITTL 프로젝트의 백엔드 API 서버입니다. LibSQL (Turso) 클라우드 데이터베이스를 사용합니다.

## 🚀 실행 방법

### 1. 환경 설정

1. Python 가상환경 생성 및 활성화:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. 필요한 패키지 설치:
```bash
pip install -r requirements.txt
```

3. 환경 변수 설정:
`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가:

```env
# LibSQL Database (Turso) 설정
LIBSQL_URL=libsql://ittlcdb-hozza.aws-ap-northeast-1.turso.io
LIBSQL_AUTH_TOKEN=your_auth_token_here
```

### 2. Turso 인증 토큰 생성

#### 방법 1: Turso 웹사이트에서 생성
1. https://turso.tech 접속
2. 로그인 후 데이터베이스 선택
3. Settings → Tokens에서 새 토큰 생성
4. 생성된 토큰을 `.env` 파일에 설정

#### 방법 2: WSL에서 Turso CLI 사용
```bash
# WSL 설치 (Windows에서)
wsl --install

# WSL에서 Turso CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 로그인
turso auth login

# 토큰 생성
turso db tokens create ittlcdb-hozza
```

### 3. 데이터베이스 테이블 생성

```bash
python migrate_to_libsql.py
```

### 4. 서버 실행

#### 방법 1: Windows 배치 파일 실행 (권장)
```bash
run.bat
```

#### 방법 2: uvicorn 직접 실행
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 방법 3: Python 모듈로 실행
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 📝 API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **헬스 체크**: http://localhost:8000/health

## 🏗️ 프로젝트 구조

```
ittlc_be/
├── app/
│   ├── api/          # API 라우터
│   ├── core/         # 설정 및 핵심 기능
│   ├── schemas/      # Pydantic 스키마
│   ├── services/     # LibSQL 서비스
│   └── main.py       # FastAPI 앱
├── requirements.txt  # Python 패키지 의존성
├── run.bat          # Windows 실행 배치 파일
├── migrate_to_libsql.py # LibSQL 테이블 생성
└── load_env.py      # 환경 변수 로드 테스트
```

## 🔧 기술 스택

- **FastAPI**: 웹 프레임워크
- **LibSQL**: 클라우드 데이터베이스 (Turso)
- **Pydantic**: 데이터 검증
- **Uvicorn**: ASGI 서버

## 🗄️ 데이터베이스

### LibSQL (Turso)
- 클라우드 기반 SQLite
- HTTP 연결 사용
- 자동 백업 및 복제
- 글로벌 분산 데이터베이스

### 주요 기능
- **Users API**: 사용자 관리 (생성, 조회, 목록)
- **Members API**: 멤버 관리 (생성, 조회, 수정, 삭제, 목록)
- **실시간 연결**: LibSQL HTTP API 사용
- **비동기 처리**: 모든 데이터베이스 작업이 비동기

## 🔍 API 엔드포인트

### Users
- `POST /api/v1/users/` - 사용자 생성
- `GET /api/v1/users/` - 사용자 목록
- `GET /api/v1/users/{user_id}` - 사용자 조회
- `GET /api/v1/users/test` - 테스트

### Members
- `POST /api/v1/members/` - 멤버 생성
- `GET /api/v1/members/` - 멤버 목록
- `GET /api/v1/members/{member_id}` - 멤버 조회
- `PUT /api/v1/members/{member_id}` - 멤버 수정
- `DELETE /api/v1/members/{member_id}` - 멤버 삭제
- `GET /api/v1/members/test` - 테스트
