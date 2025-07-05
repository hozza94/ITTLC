# 성도관리 기능 요구사항 정의서

## 📋 문서 정보
- **작성일**: 2024-01-XX
- **버전**: 1.0
- **프로젝트**: ITTLC 교회 관리 시스템
- **담당자**: 개발팀

## 🎯 개요 및 목적

### 목적
교회 내 성도들의 개인정보 및 교회 활동 관련 정보를 체계적으로 관리하여 효율적인 목양 및 교회 운영을 지원합니다.

### 배경
- 성도 정보의 체계적 관리 필요
- 개인정보 보호 강화 요구
- 출석 및 활동 이력 추적 필요
- 연락처 관리 및 커뮤니케이션 효율화

## 🏗️ 시스템 구조

### 메뉴 위치
```
├── 대시보드
├── 성도관리 ← 현재 문서
│   ├── 성도 조회
│   ├── 성도 등록
│   └── 정보 수정
├── 기도
├── 헌금
└── 관리자
```

### 접근 경로
- **성도 조회**: `/main/members/view`
- **성도 등록**: `/main/members/register`
- **정보 수정**: `/main/members/edit/:id`

## 🚀 기능 요구사항

### 1. 성도 조회 기능

#### 주요 기능
1. **성도 목록 조회**
   - 전체 성도 목록 표시
   - 페이지네이션 처리 (20명씩)
   - 정렬 기능 (이름, 등록일, 생년월일)

2. **검색 및 필터링**
   - 이름 검색 (부분 검색 지원)
   - 연락처 검색 (전화번호, 이메일)
   - 나이 범위 검색
   - 성별 필터링
   - 직분 필터링
   - 활동 상태 필터링

3. **상세 정보 조회**
   - 성도 개인 정보 상세 페이지
   - 출석 이력 조회
   - 헌금 이력 조회
   - 활동 참여 이력 조회

#### 표시 정보
- 기본 정보: 이름, 나이, 성별, 연락처
- 교회 정보: 등록일, 직분, 소속 구역
- 상태 정보: 활동 상태, 최근 출석일
- 가족 정보: 가족 관계, 가족 구성원

### 2. 성도 등록 기능

#### 주요 기능
1. **개인 정보 입력**
   - 기본 정보 입력 폼
   - 실시간 유효성 검사
   - 중복 등록 방지

2. **가족 관계 설정**
   - 가족 구성원 연결
   - 가족 관계 설정
   - 가족 대표자 지정

3. **교회 정보 설정**
   - 직분 설정
   - 소속 구역 설정
   - 등록 경로 기록

#### 입력 항목
**필수 항목**
- 이름 (한글)
- 생년월일
- 성별
- 연락처 (전화번호 또는 이메일 중 하나)

**선택 항목**
- 영문 이름
- 주소
- 이메일 (추가)
- 휴대폰 번호 (추가)
- 직업
- 특이사항

**교회 정보**
- 등록일 (기본값: 오늘 날짜)
- 직분 (기본값: 성도)
- 소속 구역
- 세례 여부 및 날짜
- 등록 경로

### 3. 정보 수정 기능

#### 주요 기능
1. **개인 정보 수정**
   - 기존 정보 표시
   - 변경 사항 하이라이트
   - 수정 이력 기록

2. **권한 관리**
   - 관리자: 모든 정보 수정 가능
   - 사용자: 제한된 정보만 수정 가능
   - 본인: 개인 정보만 수정 가능

3. **변경 이력 추적**
   - 수정 내용 기록
   - 수정자 정보 기록
   - 수정 일시 기록

## 🗃️ 데이터 구조

### 성도 테이블 (members)
```sql
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    name_en VARCHAR(100),
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    job VARCHAR(100),
    registration_date DATE NOT NULL,
    baptism_date DATE,
    position VARCHAR(50) DEFAULT '성도',
    district VARCHAR(50),
    family_id INTEGER,
    family_role VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 가족 테이블 (families)
```sql
CREATE TABLE families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_name VARCHAR(100) NOT NULL,
    head_member_id INTEGER,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_member_id) REFERENCES members(id)
);
```

### 성도 수정 이력 테이블 (member_history)
```sql
CREATE TABLE member_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    modified_by INTEGER NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (modified_by) REFERENCES users(id)
);
```

### 기본 직분 데이터
- 성도 (기본값)
- 집사
- 권사
- 장로
- 전도사
- 목사
- 기타

## 🎨 UI/UX 요구사항

### 성도 조회 페이지
1. **헤더 영역**
   - 페이지 제목: "성도 조회"
   - 검색 입력창
   - 필터 버튼
   - 등록 버튼

2. **검색 및 필터 영역**
   - 접이식 고급 검색 옵션
   - 나이 범위 슬라이더
   - 성별 라디오 버튼
   - 직분 선택 드롭다운
   - 활동 상태 체크박스

3. **성도 목록 영역**
   - 카드 형태 또는 테이블 형태 선택
   - 사진 표시 (선택사항)
   - 기본 정보 표시
   - 상세 보기 버튼

4. **페이지네이션**
   - 페이지 번호 표시
   - 이전/다음 버튼
   - 페이지 크기 선택

### 성도 등록 페이지
1. **단계별 입력 폼**
   - 1단계: 기본 정보
   - 2단계: 연락처 정보
   - 3단계: 교회 정보
   - 4단계: 가족 정보

2. **입력 검증**
   - 실시간 유효성 검사
   - 오류 메시지 표시
   - 필수 항목 강조

3. **저장 및 네비게이션**
   - 임시 저장 기능
   - 단계별 저장
   - 취소 및 초기화 옵션

### 정보 수정 페이지
1. **기존 정보 표시**
   - 현재 정보 표시
   - 수정 가능 항목 강조
   - 수정 이력 표시

2. **수정 폼**
   - 기존 정보 미리 채우기
   - 변경 사항 하이라이트
   - 저장 전 확인 다이얼로그

## 🔐 권한 관리

### 역할별 접근 권한
1. **관리자 (Admin)**
   - 모든 성도 정보 조회
   - 성도 등록, 수정, 삭제
   - 민감 정보 접근 가능

2. **사용자 (User)**
   - 제한된 성도 정보 조회
   - 성도 등록 가능
   - 제한된 수정 권한

3. **성도 본인**
   - 본인 정보 조회
   - 본인 정보 수정 (제한적)

### 개인정보 보호
- 민감 정보 마스킹 처리
- 접근 로그 기록
- 데이터 암호화 저장
- 정보 제공 동의 관리

## 📊 데이터 검증 규칙

### 입력 검증
1. **이름 검증**
   - 한글 2-10자 이내
   - 특수문자 제한
   - 공백 제거

2. **생년월일 검증**
   - 올바른 날짜 형식
   - 미래 날짜 금지
   - 현실적인 나이 범위

3. **연락처 검증**
   - 전화번호 형식 확인
   - 이메일 형식 확인
   - 중복 연락처 확인

4. **중복 검증**
   - 이름 + 생년월일 중복 확인
   - 연락처 중복 확인
   - 가족 관계 중복 확인

## 🧪 테스트 요구사항

### 기능 테스트
1. **CRUD 기능 테스트**
   - 성도 등록 기능
   - 성도 조회 기능
   - 성도 수정 기능
   - 성도 삭제 기능

2. **검색 기능 테스트**
   - 이름 검색
   - 연락처 검색
   - 복합 검색
   - 필터링 기능

3. **권한 테스트**
   - 역할별 접근 권한
   - 개인정보 보호
   - 수정 권한 확인

### 성능 테스트
1. **대용량 데이터 처리**
   - 1000명 이상 성도 데이터 처리
   - 검색 성능 측정
   - 페이지 로딩 시간

2. **동시 접속 테스트**
   - 여러 사용자 동시 접속
   - 데이터 충돌 방지
   - 성능 저하 확인

### 보안 테스트
1. **데이터 보안**
   - 개인정보 암호화
   - 접근 권한 확인
   - SQL 인젝션 방지

2. **인증 및 권한**
   - 로그인 확인
   - 권한 우회 시도
   - 세션 관리

## 📝 개발 우선순위

### Phase 1 (고우선순위)
1. 기본 CRUD 기능 구현
2. 성도 목록 조회 및 검색
3. 성도 등록 기능
4. 기본 정보 수정 기능

### Phase 2 (중우선순위)
1. 고급 검색 및 필터링
2. 가족 관계 관리
3. 수정 이력 관리
4. 권한 관리 강화

### Phase 3 (저우선순위)
1. 사진 업로드 기능
2. 일괄 처리 기능
3. 통계 및 리포트
4. 모바일 최적화

## 🚦 주의사항

### 개인정보 보호
- 개인정보보호법 준수
- 최소한의 정보 수집
- 정보 제공 동의 관리
- 정기적인 정보 정리

### 데이터 품질 관리
- 입력 데이터 검증
- 중복 데이터 방지
- 정기적인 데이터 정리
- 백업 및 복구 체계

### 사용자 경험
- 직관적인 인터페이스
- 빠른 검색 성능
- 모바일 친화적 디자인
- 접근성 고려

## 📚 참고사항

### 관련 문서
- [대시보드 요구사항 정의서](./dashboard-requirements.md)
- [기도 관리 요구사항 정의서](./prayer-management-requirements.md)
- [헌금 관리 요구사항 정의서](./offering-management-requirements.md)
- [관리자 기능 요구사항 정의서](./admin-management-requirements.md)

### 법적 고려사항
- 개인정보보호법
- 정보통신망법
- 교회 개인정보 처리방침
- 개인정보 보호 정책

### 기술 스택
- **Frontend**: Next.js, React, TypeScript
- **Backend**: FastAPI, Python
- **Database**: LibSQL
- **UI Library**: Tailwind CSS

---

**문서 작성자**: 개발팀  
**최종 수정일**: 2024-01-XX  
**승인자**: 프로젝트 관리자 