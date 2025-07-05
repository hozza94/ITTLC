# 관리자 기능 요구사항 정의서

## 📋 문서 정보
- **작성일**: 2024-01-XX
- **버전**: 1.0
- **프로젝트**: ITTLC 교회 관리 시스템
- **담당자**: 개발팀

## 🎯 개요 및 목적

### 목적
시스템 관리자가 교회 관리 시스템을 효율적으로 운영하고 관리할 수 있도록 필요한 관리 도구와 기능을 제공합니다.

### 배경
- 시스템 전반의 관리 및 모니터링 필요
- 사용자 계정 및 권한 관리 요구
- 데이터 백업 및 복구 기능 필요
- 시스템 설정 및 환경 관리 필요

## 🏗️ 시스템 구조

### 메뉴 위치
```
├── 대시보드
├── 성도관리
├── 기도
├── 헌금
└── 관리자 ← 현재 문서
    ├── 사용자 관리
    ├── 시스템 설정
    ├── 데이터 관리
    ├── 로그 관리
    └── 통계 및 리포트
```

### 접근 경로
- **사용자 관리**: `/main/admin/users`
- **시스템 설정**: `/main/admin/settings`
- **데이터 관리**: `/main/admin/data`
- **로그 관리**: `/main/admin/logs`
- **통계 및 리포트**: `/main/admin/reports`

## 🚀 기능 요구사항

### 1. 사용자 관리 기능

#### 주요 기능
1. **사용자 계정 관리**
   - 사용자 계정 생성, 수정, 삭제
   - 계정 활성화/비활성화
   - 비밀번호 재설정

2. **권한 관리**
   - 역할 기반 권한 설정
   - 메뉴별 접근 권한 관리
   - 기능별 권한 설정

3. **사용자 모니터링**
   - 로그인 이력 조회
   - 사용자 활동 로그
   - 접속 통계

#### 관리 항목
- 사용자 ID/이메일
- 사용자 이름
- 역할 (관리자, 사용자, 게스트)
- 계정 상태 (활성, 비활성, 잠김)
- 마지막 로그인 시간
- 생성일/수정일

### 2. 시스템 설정 기능

#### 주요 기능
1. **기본 설정 관리**
   - 사이트 제목/로고 설정
   - 연락처 정보 설정
   - 교회 기본 정보 설정

2. **보안 설정**
   - 비밀번호 정책 설정
   - 세션 타임아웃 설정
   - 로그인 시도 제한

3. **이메일 설정**
   - SMTP 서버 설정
   - 이메일 템플릿 관리
   - 알림 설정

#### 설정 항목
- 교회명, 주소, 연락처
- 로고 이미지
- 기본 언어 설정
- 날짜/시간 형식
- 화폐 단위 설정

### 3. 데이터 관리 기능

#### 주요 기능
1. **백업 및 복구**
   - 데이터베이스 백업
   - 자동 백업 스케줄링
   - 백업 파일 관리
   - 데이터 복구 기능

2. **데이터 내보내기/가져오기**
   - CSV/Excel 형식 지원
   - 성도 데이터 내보내기
   - 헌금 데이터 내보내기
   - 기도 제목 내보내기

3. **데이터 정리**
   - 중복 데이터 검색
   - 오래된 데이터 정리
   - 데이터 품질 검사

#### 백업 관리
- 백업 파일 목록
- 백업 크기 및 일시
- 백업 상태 (성공/실패)
- 복구 기능

### 4. 로그 관리 기능

#### 주요 기능
1. **시스템 로그**
   - 사용자 활동 로그
   - 시스템 오류 로그
   - 보안 관련 로그

2. **로그 검색 및 필터링**
   - 날짜별 로그 조회
   - 사용자별 로그 조회
   - 로그 레벨별 필터링

3. **로그 관리**
   - 로그 보관 기간 설정
   - 로그 자동 정리
   - 로그 내보내기

#### 로그 유형
- 로그인/로그아웃
- 데이터 CRUD 작업
- 시스템 오류
- 보안 경고
- 성능 관련 로그

### 5. 통계 및 리포트 기능

#### 주요 기능
1. **사용자 통계**
   - 사용자 수 추이
   - 활성 사용자 통계
   - 로그인 통계

2. **시스템 성능**
   - 응답 시간 통계
   - 메모리 사용량
   - 저장 공간 사용량

3. **비즈니스 리포트**
   - 성도 현황 리포트
   - 헌금 현황 리포트
   - 기도 참여 현황

#### 리포트 형식
- 대시보드 형태
- PDF 내보내기
- Excel 내보내기
- 이메일 발송

## 🗃️ 데이터 구조

### 사용자 테이블 (users)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 시스템 설정 테이블 (system_settings)
```sql
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 시스템 로그 테이블 (system_logs)
```sql
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    log_level VARCHAR(20) NOT NULL,
    log_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    additional_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 백업 이력 테이블 (backup_history)
```sql
CREATE TABLE backup_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    backup_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## 🎨 UI/UX 요구사항

### 관리자 대시보드
1. **시스템 현황 카드**
   - 총 사용자 수
   - 활성 사용자 수
   - 시스템 상태
   - 저장 공간 사용량

2. **최근 활동 타임라인**
   - 최근 로그인 사용자
   - 최근 시스템 오류
   - 최근 백업 상태

3. **빠른 액션 버튼**
   - 백업 실행
   - 사용자 추가
   - 시스템 재시작
   - 로그 보기

### 사용자 관리 페이지
1. **사용자 목록**
   - 테이블 형태
   - 검색 및 필터링
   - 정렬 기능
   - 페이지네이션

2. **사용자 상세 정보**
   - 기본 정보
   - 권한 설정
   - 로그인 이력
   - 활동 로그

3. **사용자 등록/수정 폼**
   - 필수 정보 입력
   - 권한 선택
   - 계정 상태 설정

### 시스템 설정 페이지
1. **설정 카테고리**
   - 탭 형태로 구분
   - 기본 설정, 보안, 이메일 등

2. **설정 폼**
   - 설정 항목별 입력 필드
   - 실시간 유효성 검사
   - 저장 버튼

## 🔐 보안 요구사항

### 접근 제어
1. **관리자 전용 접근**
   - 관리자 권한 사용자만 접근
   - 다단계 인증 고려
   - IP 기반 접근 제한

2. **감사 로그**
   - 모든 관리 작업 기록
   - 변경 사항 추적
   - 접근 시도 기록

3. **데이터 보호**
   - 중요 데이터 암호화
   - 백업 파일 암호화
   - 로그 데이터 보호

## 📊 성능 요구사항

### 시스템 모니터링
1. **성능 지표**
   - CPU 사용률
   - 메모리 사용률
   - 디스크 I/O
   - 네트워크 트래픽

2. **응답 시간**
   - 관리 페이지 로딩 시간
   - 백업 처리 시간
   - 리포트 생성 시간

3. **알림 기능**
   - 성능 임계값 초과 알림
   - 시스템 오류 알림
   - 백업 실패 알림

## 🧪 테스트 요구사항

### 기능 테스트
1. **관리 기능 테스트**
   - 사용자 관리 CRUD
   - 시스템 설정 저장/로드
   - 백업/복구 기능
   - 로그 관리 기능

2. **권한 테스트**
   - 관리자 접근 권한
   - 일반 사용자 접근 차단
   - 메뉴별 권한 확인

3. **보안 테스트**
   - 인증/인가 테스트
   - 접근 제어 테스트
   - 데이터 보호 테스트

### 성능 테스트
1. **관리 작업 성능**
   - 대용량 데이터 처리
   - 백업 처리 성능
   - 로그 검색 성능

2. **동시 접속 테스트**
   - 여러 관리자 동시 접속
   - 동시 백업 작업
   - 동시 설정 변경

## 📝 개발 우선순위

### Phase 1 (고우선순위)
1. 사용자 관리 기능
2. 기본 시스템 설정
3. 로그 관리 기능
4. 백업 기능

### Phase 2 (중우선순위)
1. 고급 설정 관리
2. 데이터 내보내기/가져오기
3. 기본 통계 기능
4. 알림 기능

### Phase 3 (저우선순위)
1. 고급 리포트 기능
2. 성능 모니터링
3. 자동화 기능
4. 확장 기능

## 🚦 주의사항

### 보안 고려사항
- 관리자 권한 남용 방지
- 중요 작업 이중 확인
- 정기적인 보안 점검
- 접근 로그 보관

### 운영 고려사항
- 정기적인 백업 실행
- 시스템 성능 모니터링
- 로그 저장 공간 관리
- 사용자 교육 및 지원

### 개발 고려사항
- 확장 가능한 구조
- 사용자 친화적 인터페이스
- 성능 최적화
- 오류 처리 및 복구

## 📚 참고사항

### 관련 문서
- [대시보드 요구사항 정의서](./dashboard-requirements.md)
- [성도 관리 요구사항 정의서](./member-management-requirements.md)
- [기도 관리 요구사항 정의서](./prayer-management-requirements.md)
- [헌금 관리 요구사항 정의서](./offering-management-requirements.md)

### 관리 가이드라인
- 최소 권한 원칙 적용
- 정기적인 권한 검토
- 변경 사항 문서화
- 장애 대응 계획 수립

### 기술 스택
- **Frontend**: Next.js, React, TypeScript
- **Backend**: FastAPI, Python
- **Database**: LibSQL
- **UI Library**: Tailwind CSS
- **모니터링**: 시스템 모니터링 도구
- **백업**: 데이터베이스 백업 도구

---

**문서 작성자**: 개발팀  
**최종 수정일**: 2024-01-XX  
**승인자**: 프로젝트 관리자 