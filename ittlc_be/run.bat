@echo off
echo 🚀 ITTL Backend 서버를 시작합니다...
echo.

REM 가상환경이 활성화되어 있는지 확인
if not defined VIRTUAL_ENV (
    echo ⚠️  가상환경이 활성화되지 않았습니다.
    echo 💡 가상환경을 활성화한 후 다시 실행해주세요.
    echo.
    pause
    exit /b 1
)

REM 필요한 패키지 설치 확인
echo 📦 필요한 패키지를 확인하고 설치합니다...
pip install -r requirements.txt

echo.
echo 🎯 서버를 시작합니다...
echo 📝 API 문서: http://localhost:8000/docs
echo 🔍 ReDoc 문서: http://localhost:8000/redoc
echo 💚 헬스 체크: http://localhost:8000/health
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo.

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause 