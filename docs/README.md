# ITTLC 프로젝트 문서

## 📋 개요
ITTLC (IT Training and Learning Center) 프로젝트의 기술 문서 모음입니다.

## 📚 문서 목록

### 1. [로그인 기능 수정사항](./login-feature-fix.md)
- 로그인 기능 오류 수정 과정 상세 문서
- 프론트엔드 및 백엔드 코드 변경사항
- 보안 개선사항 (bcrypt, JWT)
- 테스트 사용자 생성 방법

### 2. [트러블슈팅 가이드](./troubleshooting.md)
- 서버 실행 오류 해결 방법
- 데이터베이스 연결 문제 해결
- 인증 관련 오류 해결
- 개발 환경 설정 문제 해결

## 🚀 프로젝트 구조

```
ITTLC/
├── ittlc_be/          # 백엔드 (FastAPI)
│   ├── app/
│   │   ├── api/       # API 엔드포인트
│   │   ├── core/      # 핵심 설정
│   │   ├── db/        # 데이터베이스 연결
│   │   ├── models/    # 데이터 모델
│   │   ├── schemas/   # Pydantic 스키마
│   │   └── services/  # 비즈니스 로직
│   └── requirements.txt
├── ittlc_fe/          # 프론트엔드 (Next.js)
│   ├── src/
│   │   ├── app/       # 페이지 컴포넌트
│   │   ├── components/ # 재사용 컴포넌트
│   │   └── contexts/  # React Context
│   └── package.json
└── docs/              # 기술 문서
    ├── README.md
    ├── login-feature-fix.md
    └── troubleshooting.md
```

## 🛠️ 기술 스택

### 백엔드
- **프레임워크**: FastAPI
- **데이터베이스**: LibSQL (Turso)
- **인증**: JWT + bcrypt
- **서버**: Uvicorn

### 프론트엔드
- **프레임워크**: Next.js 13+ (App Router)
- **스타일링**: Tailwind CSS
- **상태 관리**: React Context
- **타입스크립트**: TypeScript

## 🔧 설치 및 실행

### 백엔드 설정
```bash
cd ittlc_be
pip install -r requirements.txt
python create_test_user.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 프론트엔드 설정
```bash
cd ittlc_fe
npm install
npm run dev
```

## 🔐 보안 설정

### 환경 변수 (.env)
```bash
# ittlc_be/.env
LIBSQL_URL=your_libsql_database_url
LIBSQL_AUTH_TOKEN=your_auth_token
JWT_SECRET=your_jwt_secret_key
```

### 테스트 계정
- **이메일**: admin@example.com
- **비밀번호**: password

## 📊 API 문서

### 주요 엔드포인트
- **로그인**: `POST /api/v1/auth/login`
- **사용자 목록**: `GET /api/v1/users`
- **멤버 목록**: `GET /api/v1/members`
- **헬스 체크**: `GET /health`

### API 문서 확인
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 알려진 이슈

### 1. 백엔드 서버 실행 오류
- `ModuleNotFoundError: No module named 'app'`
- **해결**: ittlc_be 디렉터리에서 실행 필요

### 2. 의존성 버전 충돌
- `libsql-client` 버전 호환성 문제
- **해결**: 버전 0.3.1 사용

### 3. CORS 설정
- 프론트엔드-백엔드 연결 시 CORS 오류
- **해결**: main.py에서 CORS 미들웨어 설정 확인

## 📝 개발 가이드라인

### 1. 코드 스타일
- **Python**: PEP 8 준수
- **TypeScript**: ESLint + Prettier 사용
- **커밋 메시지**: 한글로 작성

### 2. 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치

### 3. 테스트
- **백엔드**: pytest 사용
- **프론트엔드**: Jest + React Testing Library
- **E2E**: Playwright 사용 예정

## 🔄 업데이트 로그

### v1.0.0 (2024-12-30)
- 로그인 기능 구현 및 수정
- bcrypt 비밀번호 해싱 적용
- JWT 토큰 인증 시스템 구축
- 테스트 사용자 생성 스크립트 추가

## 📞 지원 및 문의

### 개발팀 연락처
- **이메일**: support@ittlc.com
- **이슈 트래커**: GitHub Issues

### 유용한 링크
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [LibSQL 문서](https://docs.turso.tech/)

---

**최종 업데이트**: 2024년 12월 30일  
**버전**: 1.0  
**작성자**: AI Assistant 