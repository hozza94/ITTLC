# backend/app/schemas/member.py
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

class MemberBase(BaseModel):
    name: str
    age: Optional[int] = None
    sex: Optional[str] = None
    birthday: Optional[date] = None
    contact: Optional[str] = None
    address: Optional[str] = None
    job: Optional[str] = None
    email: Optional[EmailStr] = None
    baptism: bool = False
    marriage: bool = False
    prev_church: Optional[str] = None
    registration_date: Optional[date] = None
    memo: Optional[str] = None

class MemberCreate(MemberBase):
    pass

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    birthday: Optional[date] = None
    contact: Optional[str] = None
    address: Optional[str] = None
    job: Optional[str] = None
    email: Optional[EmailStr] = None
    baptism: Optional[bool] = None
    marriage: Optional[bool] = None
    prev_church: Optional[str] = None
    registration_date: Optional[date] = None
    memo: Optional[str] = None

class MemberInDBBase(MemberBase):
    member_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Member(MemberInDBBase):
    pass