# backend/app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.endpoints import users, members, auth, prayers, offerings, families, system

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(members.router, prefix="/members", tags=["members"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(prayers.router, prefix="/prayers", tags=["prayers"])
api_router.include_router(offerings.router, prefix="/offerings", tags=["offerings"])
api_router.include_router(families.router, prefix="/families", tags=["families"])
api_router.include_router(system.router, prefix="/system", tags=["system"])