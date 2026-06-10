from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import datetime
from bson import ObjectId
from config.database import users_collection
from utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class SignupSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup(user_data: SignupSchema):
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email matches an active record account.")
    
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "created_at": datetime.utcnow()
    }
    result = await users_collection.insert_one(user_doc)
    
    token = create_access_token({"sub": user_doc["email"], "id": str(result.inserted_id)})
    return {"token": token, "user": {"name": user_doc["name"], "email": user_doc["email"]}}

@router.post("/login")
async def login(credentials: LoginSchema):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credential combination validation failure.")
    
    token = create_access_token({"sub": user["email"], "id": str(user["_id"])})
    return {"token": token, "user": {"name": user["name"], "email": user["email"]}}