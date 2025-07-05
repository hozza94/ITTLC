from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.services.libsql_service import libsql_service

# FastAPI 앱 생성
app = FastAPI(
    title="ITTLC Backend API",
    description="ITTLC 프로젝트의 백엔드 API 서버 (LibSQL)",
    version="1.0.0"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """앱 시작 시 LibSQL 연결 확인"""
    try:
        # LibSQL 연결 테스트
        client = await libsql_service.get_client()
        result = await client.execute("SELECT 1 as test")
        print("✅ LibSQL 연결 성공!")
    except Exception as e:
        print(f"❌ LibSQL 연결 실패: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """앱 종료 시 LibSQL 연결 종료"""
    await libsql_service.close()
    print("🔌 LibSQL 연결 종료")

@app.get("/")
async def root():
    return {"message": "ITTL Backend API 서버에 오신 것을 환영합니다! (LibSQL)"}

@app.get("/health")
async def health_check():
    try:
        # LibSQL 연결 상태 확인
        client = await libsql_service.get_client()
        result = await client.execute("SELECT 1 as test")
        return {
            "status": "healthy", 
            "message": "서버가 정상적으로 실행 중입니다",
            "database": "LibSQL (Turso)"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "message": f"데이터베이스 연결 오류: {str(e)}",
            "database": "LibSQL (Turso)"
        }
