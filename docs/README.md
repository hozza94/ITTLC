# ITTLC 프로젝트 문서

## 📋 개요
ITTLC (IT Training and Learning Center) 프로젝트의 기술 문서 모음입니다.

## 🎉 최신 업데이트 (2025-01-12)
**Phase 2 완전 완료! 실제 API 연동 및 사이드바 개선** ✅

### 주요 완료 사항
- ✅ **모든 페이지 API 연동**: Mock 데이터 → 실제 백엔드 API 완전 연동
- ✅ **안전한 fallback 시스템**: API 실패 시 Mock 데이터 자동 사용
- ✅ **사이드바 UX 개선**: 아코디언 메뉴 한 번에 하나만 펼쳐지도록 개선
- ✅ **관리자 기능 완성**: 사용자 관리, 시스템 설정 페이지 추가
- ✅ **타입 안전성**: TypeScript로 모든 API 인터페이스 보장

## 📚 문서 목록

### 1. [개발 로드맵](./development-roadmap.md)
- **Phase 1**: 100% 완료 (기반 구조)
- **Phase 2**: 100% 완료 (API 연동 완료)
- **Phase 3**: 준비 중 (고급 기능)
- 전체 개발 진행 상황 및 계획

### 2. [Phase 2 백엔드 API 개발 완료](./phase2-api-development-complete.md)
- 31개 API 엔드포인트 개발 완료
- Pydantic 스키마 모델 구현
- 모든 도메인 CRUD 작업 완료

### 3. [Phase 2 프론트엔드 API 연동 완료](./phase2-frontend-api-integration-complete.md) 🆕
- 모든 페이지 실제 API 연동 완료
- 공통 API 클라이언트 구현
- 사이드바 UX 개선
- 관리자 기능 추가

### 4. [로그인 기능 수정사항](./login-feature-fix.md)
- 로그인 기능 오류 수정 과정 상세 문서
- 프론트엔드 및 백엔드 코드 변경사항
- 보안 개선사항 (bcrypt, JWT)
- 테스트 사용자 생성 방법

### 5. [트러블슈팅 가이드](./troubleshooting.md)
- 서버 실행 오류 해결 방법
- 데이터베이스 연결 문제 해결
- 인증 관련 오류 해결
- 개발 환경 설정 문제 해결

### 6. 기능별 요구사항 문서
- [성도 관리 요구사항](./member-management-requirements.md)
- [기도 관리 요구사항](./prayer-management-requirements.md)
- [헌금 관리 요구사항](./offering-management-requirements.md)
- [가족 관리 요구사항](./family-management-requirements.md)
- [관리자 기능 요구사항](./admin-management-requirements.md)
- [대시보드 요구사항](./dashboard-requirements.md)

## 🚀 프로젝트 구조

```
ITTLC/
├── ittlc_be/          # 백엔드 (FastAPI)
│   ├── app/
│   │   ├── api/       # API 엔드포인트 (31개)
│   │   ├── core/      # 핵심 설정
│   │   ├── db/        # 데이터베이스 연결
│   │   ├── models/    # 데이터 모델
│   │   ├── schemas/   # Pydantic 스키마
│   │   └── services/  # 비즈니스 로직
│   └── requirements.txt
├── ittlc_fe/          # 프론트엔드 (Next.js)
│   ├── src/
│   │   ├── app/       # 페이지 컴포넌트 (모든 페이지 API 연동 완료)
│   │   ├── components/ # 재사용 컴포넌트
│   │   ├── contexts/  # React Context
│   │   └── lib/       # API 클라이언트 (신규 추가)
│   └── package.json
└── docs/              # 기술 문서
    ├── README.md
    ├── development-roadmap.md
    ├── phase2-api-development-complete.md
    ├── phase2-frontend-api-integration-complete.md (신규)
    └── [기타 문서들]
```

## 🛠️ 기술 스택

### 백엔드
- **프레임워크**: FastAPI
- **데이터베이스**: LibSQL (Turso)
- **인증**: JWT + bcrypt
- **서버**: Uvicorn
- **API 엔드포인트**: 31개 (모든 CRUD 작업 완료)

### 프론트엔드
- **프레임워크**: Next.js 15 (App Router)
- **스타일링**: Tailwind CSS
- **상태 관리**: React Context
- **타입스크립트**: TypeScript
- **API 연동**: 완전 연동 (fallback 시스템 포함)

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

### 주요 엔드포인트 (31개)
**인증 관련**
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/users` - 사용자 목록

**성도 관리**
- `GET /api/v1/members` - 성도 목록
- `POST /api/v1/members` - 성도 등록
- `PUT /api/v1/members/{id}` - 성도 수정
- `DELETE /api/v1/members/{id}` - 성도 삭제

**기도 관리**
- `GET /api/v1/prayers` - 기도 목록
- `POST /api/v1/prayers` - 기도 등록
- `GET /api/v1/prayers/categories` - 기도 카테고리

**헌금 관리**
- `GET /api/v1/offerings` - 헌금 목록
- `POST /api/v1/offerings` - 헌금 등록
- `GET /api/v1/offerings/statistics/period` - 헌금 통계

**가족 관리**
- `GET /api/v1/families` - 가족 목록
- `POST /api/v1/families` - 가족 등록

**시스템 관리**
- `GET /api/v1/system/dashboard/stats` - 대시보드 통계
- `GET /api/v1/system/settings` - 시스템 설정

### API 문서 확인
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 현재 개발 상태

### Phase 1 (완료 ✅)
- 기반 구조 및 핵심 기능
- 데이터베이스 설계 및 구축
- 인증 시스템 구축
- 기본 레이아웃 및 네비게이션

### Phase 2 (완료 ✅)
- **백엔드**: 31개 API 엔드포인트 개발
- **프론트엔드**: 모든 페이지 API 연동
- **기능**: 성도/기도/헌금/가족/관리자 기능 완성
- **UX**: 사이드바 아코디언 메뉴 개선

### Phase 3 (준비 중)
- 고급 기능 개발
- 성능 최적화
- 보안 강화
- 사용자 경험 개선

## 🐛 알려진 이슈

### 해결된 이슈
1. ✅ **백엔드 서버 실행 오류** - 모듈 경로 문제 해결
2. ✅ **의존성 버전 충돌** - libsql-client 버전 0.3.1 사용
3. ✅ **CORS 설정** - main.py에서 CORS 미들웨어 설정
4. ✅ **API 연동 오류** - 모든 페이지 실제 API 연동 완료
5. ✅ **사이드바 UX 문제** - 아코디언 메뉴 개선 완료

### 현재 이슈
- 없음 (모든 기능 정상 작동)

## 📝 개발 가이드라인

### 1. 코드 스타일
- **Python**: PEP 8 준수
- **TypeScript**: ESLint + Prettier 사용
- **커밋 메시지**: 한글로 작성

### 2. 브랜치 전략
- `master`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치

### 3. 테스트
- **백엔드**: pytest 사용
- **프론트엔드**: Jest + React Testing Library
- **E2E**: Playwright 사용 예정

## 🔄 업데이트 로그

### v2.0.0 (2025-01-12) 🆕
- **Phase 2 완전 완료**: 모든 페이지 API 연동
- **공통 API 클라이언트**: lib/api.ts 구현
- **안전한 fallback 시스템**: API 실패 시 Mock 데이터 사용
- **사이드바 UX 개선**: 아코디언 메뉴 개선
- **관리자 기능 추가**: 완전한 관리자 페이지 구현
- **타입 안전성**: TypeScript 인터페이스 완전 구현

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

**최종 업데이트**: 2025년 1월 12일  
**버전**: 2.0  
**작성자**: 개발팀 