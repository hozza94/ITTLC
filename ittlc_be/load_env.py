# backend/load_env.py
from app.core.config import settings

print(f"DB_HOST: {settings.DB_HOST}")
print(f"DB_USER: {settings.DB_USER}")
# 비밀번호는 보안상 출력하지 않는 것이 좋습니다.