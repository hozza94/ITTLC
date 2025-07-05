# 기도 관리 기능 요구사항 정의서

## 📋 문서 정보
- **작성일**: 2024-01-XX
- **버전**: 1.0
- **프로젝트**: ITTLC 교회 관리 시스템
- **담당자**: 개발팀

## 🎯 개요 및 목적

### 목적
교회 공동체의 기도 제목을 체계적으로 관리하고 성도들이 함께 기도할 수 있도록 지원하여 영적 공동체 형성에 기여합니다.

### 배경
- 교회 공동체 기도 제목 관리 필요
- 성도들의 기도 참여 독려
- 응답받은 기도에 대한 간증 공유
- 기도 이력 관리 및 추적

## 🏗️ 시스템 구조

### 메뉴 위치
```
├── 대시보드
├── 성도관리
├── 기도 ← 현재 문서
│   ├── 기도 제목
│   └── 기도 등록
├── 헌금
└── 관리자
```

### 접근 경로
- **기도 제목**: `/main/prayer/list`
- **기도 등록**: `/main/prayer/register`
- **기도 상세**: `/main/prayer/detail/:id`

## 🚀 기능 요구사항

### 1. 기도 제목 조회 기능

#### 주요 기능
1. **기도 제목 목록 조회**
   - 전체 기도 제목 목록 표시
   - 카테고리별 분류 표시
   - 상태별 필터링 (진행 중, 응답, 완료)

2. **검색 및 필터링**
   - 기도 제목 검색
   - 카테고리별 필터링
   - 등록자별 필터링
   - 날짜 범위 검색
   - 상태별 검색

3. **기도 참여 기능**
   - 기도 제목에 "함께 기도" 참여
   - 기도 참여자 수 표시
   - 기도 응답 간증 등록

#### 표시 정보
- 기도 제목
- 기도 내용 (요약)
- 카테고리
- 등록자 (익명 선택 가능)
- 등록일
- 상태 (진행 중, 응답, 완료)
- 참여자 수

### 2. 기도 등록 기능

#### 주요 기능
1. **기도 제목 등록**
   - 기도 제목 입력
   - 기도 내용 입력
   - 카테고리 선택
   - 공개 범위 설정

2. **익명 등록 지원**
   - 익명 등록 옵션
   - 본인만 볼 수 있는 개인 기도
   - 교회 공동체 공개 기도

3. **기도 응답 관리**
   - 기도 응답 등록
   - 간증 내용 작성
   - 응답 날짜 기록

#### 입력 항목
**필수 항목**
- 기도 제목
- 기도 내용
- 카테고리

**선택 항목**
- 익명 여부
- 공개 범위
- 기도 기간 설정
- 태그

### 3. 기도 상세 기능

#### 주요 기능
1. **기도 상세 정보 조회**
   - 전체 기도 내용 표시
   - 등록자 정보 (비익명인 경우)
   - 등록일 및 수정일

2. **기도 참여 관리**
   - "함께 기도" 버튼
   - 참여자 목록 표시
   - 기도 댓글 (격려 메시지)

3. **기도 응답 관리**
   - 응답 내용 표시
   - 간증 내용 표시
   - 응답 날짜 기록

## 🗃️ 데이터 구조

### 기도 제목 테이블 (prayers)
```sql
CREATE TABLE prayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'public',
    status VARCHAR(20) DEFAULT 'active',
    prayer_period_start DATE,
    prayer_period_end DATE,
    answer_content TEXT,
    answer_date DATE,
    tags VARCHAR(500),
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 기도 참여 테이블 (prayer_participants)
```sql
CREATE TABLE prayer_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prayer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prayer_id) REFERENCES prayers(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(prayer_id, user_id)
);
```

### 기도 댓글 테이블 (prayer_comments)
```sql
CREATE TABLE prayer_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prayer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prayer_id) REFERENCES prayers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 기도 카테고리 테이블 (prayer_categories)
```sql
CREATE TABLE prayer_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 기본 기도 카테고리 데이터
- 개인 기도
- 가족 기도
- 건강 기도
- 사업/직장 기도
- 선교 기도
- 교회 기도
- 감사 기도
- 기타

## 🎨 UI/UX 요구사항

### 기도 제목 조회 페이지
1. **헤더 영역**
   - 페이지 제목: "기도 제목"
   - 기도 등록 버튼
   - 검색 입력창

2. **필터 영역**
   - 카테고리 필터 버튼
   - 상태별 필터 (전체, 진행 중, 응답, 완료)
   - 날짜 범위 선택

3. **기도 목록 영역**
   - 카드 형태로 표시
   - 제목, 내용 요약, 카테고리
   - 참여자 수 표시
   - "함께 기도" 버튼

4. **기도 상세 모달**
   - 전체 내용 표시
   - 참여자 목록
   - 댓글 입력 영역

### 기도 등록 페이지
1. **입력 폼**
   - 기도 제목 입력
   - 기도 내용 입력 (텍스트 에디터)
   - 카테고리 선택
   - 공개 범위 설정

2. **옵션 설정**
   - 익명 등록 체크박스
   - 기도 기간 설정
   - 태그 입력

3. **저장 버튼**
   - 등록 버튼
   - 임시 저장 버튼
   - 취소 버튼

### 기도 상세 페이지
1. **기도 정보 영역**
   - 제목, 내용, 카테고리
   - 등록자 정보 (비익명)
   - 등록일, 수정일

2. **참여 영역**
   - "함께 기도" 버튼
   - 참여자 수 표시
   - 참여자 목록

3. **댓글 영역**
   - 격려 메시지 목록
   - 댓글 입력 폼

4. **응답 영역**
   - 응답 내용 표시
   - 간증 내용 표시
   - 응답 등록 버튼 (작성자만)

## 🔐 권한 관리

### 역할별 접근 권한
1. **관리자 (Admin)**
   - 모든 기도 제목 조회
   - 모든 기도 제목 관리
   - 부적절한 내용 관리

2. **사용자 (User)**
   - 공개 기도 제목 조회
   - 기도 제목 등록
   - 본인이 등록한 기도 관리

3. **게스트 (Guest)**
   - 제한된 기도 제목 조회
   - 기도 참여 불가

### 공개 범위 설정
- **공개**: 모든 사용자 조회 가능
- **교회 구성원**: 교회 회원만 조회 가능
- **비공개**: 본인만 조회 가능

## 📊 데이터 분석 요구사항

### 통계 정보
1. **기도 제목 통계**
   - 월별 기도 제목 등록 수
   - 카테고리별 기도 제목 수
   - 응답률 통계

2. **참여도 분석**
   - 기도 참여자 수 통계
   - 사용자별 참여도
   - 인기 기도 제목

3. **응답 분석**
   - 응답률 통계
   - 평균 응답 시간
   - 카테고리별 응답률

## 🧪 테스트 요구사항

### 기능 테스트
1. **기도 제목 관리**
   - 등록, 조회, 수정, 삭제
   - 검색 및 필터링
   - 공개 범위 설정

2. **기도 참여 기능**
   - 참여 등록/취소
   - 참여자 수 카운트
   - 댓글 기능

3. **권한 테스트**
   - 역할별 접근 권한
   - 공개 범위별 접근 제어
   - 익명 처리 확인

### 성능 테스트
1. **대용량 데이터 처리**
   - 많은 기도 제목 처리
   - 검색 성능 측정
   - 페이지 로딩 시간

2. **동시 접속 테스트**
   - 여러 사용자 동시 접속
   - 기도 참여 동시 처리
   - 댓글 동시 등록

### 보안 테스트
1. **데이터 보안**
   - 개인 기도 내용 보호
   - 익명 처리 확인
   - 접근 권한 확인

2. **입력 검증**
   - 부적절한 내용 필터링
   - XSS 공격 방지
   - 스팸 방지

## 📝 개발 우선순위

### Phase 1 (고우선순위)
1. 기본 CRUD 기능 구현
2. 기도 제목 목록 조회
3. 기도 등록 기능
4. 기본 검색 기능

### Phase 2 (중우선순위)
1. 기도 참여 기능
2. 고급 검색 및 필터링
3. 댓글 기능
4. 응답 관리 기능

### Phase 3 (저우선순위)
1. 통계 및 분석 기능
2. 알림 기능
3. 모바일 최적화
4. 소셜 공유 기능

## 🚦 주의사항

### 개인정보 보호
- 기도 내용 개인정보 보호
- 익명 처리 철저
- 민감한 내용 필터링

### 콘텐츠 관리
- 부적절한 내용 모니터링
- 신앙적 내용 가이드라인
- 스팸 방지 체계

### 사용자 경험
- 직관적인 인터페이스
- 모바일 친화적 디자인
- 접근성 고려

## 📚 참고사항

### 관련 문서
- [대시보드 요구사항 정의서](./dashboard-requirements.md)
- [성도 관리 요구사항 정의서](./member-management-requirements.md)
- [헌금 관리 요구사항 정의서](./offering-management-requirements.md)
- [관리자 기능 요구사항 정의서](./admin-management-requirements.md)

### 영적 고려사항
- 기도의 성격과 목적 고려
- 신앙적 가치 반영
- 공동체 의식 강화
- 개인 프라이버시 존중

### 기술 스택
- **Frontend**: Next.js, React, TypeScript
- **Backend**: FastAPI, Python
- **Database**: LibSQL
- **UI Library**: Tailwind CSS
- **텍스트 에디터**: 리치 텍스트 에디터

---

**문서 작성자**: 개발팀  
**최종 수정일**: 2024-01-XX  
**승인자**: 프로젝트 관리자 