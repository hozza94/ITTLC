# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path
from dotenv import load_dotenv

# .env 파일 로드 (프로젝트 루트 기준)
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class Settings(BaseSettings):
    # LibSQL Database (Turso) 설정
    LIBSQL_URL: str = "libsql://ittlcdb-hozza.aws-ap-northeast-1.turso.io"
    LIBSQL_AUTH_TOKEN: Optional[str] = None

    class Config:
        env_file = env_path
        case_sensitive = True

# 설정 인스턴스 생성
settings = Settings()

# 데이터베이스 URL 설정 - 로컬 SQLite 사용
SQLALCHEMY_DATABASE_URL = "sqlite:///./ittlc.db"

# MySQL URL (fallback)
MYSQL_DATABASE_URL = f"mysql+pymysql://root:@localhost:3306/ittlc_db?charset=utf8mb4"

# LibSQL URL을 HTTP URL로 변환
def get_libsql_url():
    """LibSQL URL을 HTTP URL로 변환"""
    if settings.LIBSQL_URL and settings.LIBSQL_AUTH_TOKEN:
        # libsql:// -> https:// 변환
        http_url = settings.LIBSQL_URL.replace("libsql://", "https://")
        return f"{http_url}?authToken={settings.LIBSQL_AUTH_TOKEN}"
    return None

# 데이터베이스 URL 설정
libsql_url = get_libsql_url()
if libsql_url:
    SQLALCHEMY_DATABASE_URL = libsql_url
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./ittlc.db"