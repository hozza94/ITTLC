-- ====================================================================
-- ITTLC 교회 관리 시스템 데이터베이스 스키마
-- 작성일: 2024-01-XX
-- 버전: 1.0
-- 설명: 모든 기능을 위한 완전한 데이터베이스 스키마
-- ====================================================================

-- 1. 사용자 관리 테이블
-- ====================================================================

-- 사용자 테이블 (시스템 로그인 사용자)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 성도 관리 테이블
-- ====================================================================

-- 가족 테이블
CREATE TABLE IF NOT EXISTS families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_name VARCHAR(100) NOT NULL,
    head_member_id INTEGER,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_member_id) REFERENCES members(id)
);

-- 성도 테이블 (교회 구성원)
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    name_en VARCHAR(100),
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('남', '여')),
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
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 성도 수정 이력 테이블
CREATE TABLE IF NOT EXISTS member_history (
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

-- 3. 기도 관리 테이블
-- ====================================================================

-- 기도 카테고리 테이블
CREATE TABLE IF NOT EXISTS prayer_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기도 제목 테이블
CREATE TABLE IF NOT EXISTS prayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'private')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'answered', 'completed')),
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

-- 기도 참여 테이블
CREATE TABLE IF NOT EXISTS prayer_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prayer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prayer_id) REFERENCES prayers(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(prayer_id, user_id)
);

-- 기도 댓글 테이블
CREATE TABLE IF NOT EXISTS prayer_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prayer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prayer_id) REFERENCES prayers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. 헌금 관리 테이블
-- ====================================================================

-- 헌금 종류 테이블
CREATE TABLE IF NOT EXISTS offering_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 헌금 테이블
CREATE TABLE IF NOT EXISTS offerings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    offering_date DATE NOT NULL,
    offering_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    memo TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 5. 시스템 관리 테이블
-- ====================================================================

-- 시스템 설정 테이블
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 시스템 로그 테이블
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    log_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    additional_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 백업 이력 테이블
CREATE TABLE IF NOT EXISTS backup_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('manual', 'auto', 'scheduled')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'in_progress')),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ====================================================================
-- 인덱스 생성
-- ====================================================================

-- 사용자 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 성도 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_family_id ON members(family_id);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);

-- 기도 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_prayers_created_by ON prayers(created_by);
CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayers(category);
CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayers(status);
CREATE INDEX IF NOT EXISTS idx_prayers_visibility ON prayers(visibility);
CREATE INDEX IF NOT EXISTS idx_prayer_participants_prayer_id ON prayer_participants(prayer_id);
CREATE INDEX IF NOT EXISTS idx_prayer_participants_user_id ON prayer_participants(user_id);

-- 헌금 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_offerings_member_id ON offerings(member_id);
CREATE INDEX IF NOT EXISTS idx_offerings_offering_date ON offerings(offering_date);
CREATE INDEX IF NOT EXISTS idx_offerings_offering_type ON offerings(offering_type);
CREATE INDEX IF NOT EXISTS idx_offerings_created_by ON offerings(created_by);

-- 시스템 로그 인덱스
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_log_level ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_log_type ON system_logs(log_type);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- ====================================================================
-- 트리거 생성 (updated_at 자동 업데이트)
-- ====================================================================

-- 사용자 테이블 업데이트 트리거
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 성도 테이블 업데이트 트리거
CREATE TRIGGER IF NOT EXISTS update_members_updated_at 
    AFTER UPDATE ON members
    FOR EACH ROW
BEGIN
    UPDATE members SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 기도 테이블 업데이트 트리거
CREATE TRIGGER IF NOT EXISTS update_prayers_updated_at 
    AFTER UPDATE ON prayers
    FOR EACH ROW
BEGIN
    UPDATE prayers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 헌금 테이블 업데이트 트리거
CREATE TRIGGER IF NOT EXISTS update_offerings_updated_at 
    AFTER UPDATE ON offerings
    FOR EACH ROW
BEGIN
    UPDATE offerings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 시스템 설정 테이블 업데이트 트리거
CREATE TRIGGER IF NOT EXISTS update_system_settings_updated_at 
    AFTER UPDATE ON system_settings
    FOR EACH ROW
BEGIN
    UPDATE system_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END; 