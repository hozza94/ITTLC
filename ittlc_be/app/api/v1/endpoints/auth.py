from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.libsql_service import libsql_service
import jwt
import bcrypt
import os
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = os.getenv('JWT_SECRET', 'changeme')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'

@router.post('/login', response_model=TokenResponse)
async def login(data: LoginRequest):
    user = await libsql_service.get_user_by_email(data.email)
    if not user:
        raise HTTPException(status_code=401, detail='이메일 또는 비밀번호가 올바르지 않습니다.')
    
    # bcrypt를 사용한 비밀번호 해시 비교
    if not bcrypt.checkpw(data.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail='이메일 또는 비밀번호가 올바르지 않습니다.')
    
    # JWT 토큰 생성
    to_encode = {
        'sub': str(user['id']) if 'id' in user else str(user.get('user_id', '')),
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return TokenResponse(access_token=token) 