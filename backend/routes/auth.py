from fastapi import APIRouter, Request, HTTPException, status
import jwt
import os
from dotenv import load_dotenv
from typing import Optional, Dict

# Load environment variables
load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

# --- Verification Function (Jo dependencies.py ko chahiye) ---
def verify_jwt(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"user_id": user_id}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid or expired")

# --- Routes (Jo Signup/Login handle karenge) ---
@router.get("/get-session") 
async def get_session(request: Request): 
    return {"user": {"id": "1",
        "email": "test@example.com",
                     "name": "Test User"},
                     "session": {"id": "session_123","userId": "1"}}

@router.post("/sign-up/email")
async def signup(request: Request):
    print("REACHED BACKEND SIGNUP!")
    try:
        data = await request.json()
        print(f"User Data: {data}")
        # Filhal testing ke liye success response
        return {"status": "ok", "message": "User registered successfully"}
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}

# Login ke liye bhi yahi format follow karein:
@router.post("/sign-in/email")
async def login(request: Request):
    return {"message": "Login route is active"}