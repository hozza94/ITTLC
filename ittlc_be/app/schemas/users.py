# backend/app/schemas/users.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from pydantic import Field

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    username: str
    password: str
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserInDBBase(UserBase):
    user_id: int
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    password: str

    