from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db import engine
from routes.auth import verify_jwt
from typing import Dict
from typing import AsyncGenerator

async def get_db() -> AsyncGenerator:
    async with AsyncSession(engine) as session:
        yield session
        
def get_current_user(request: Request) -> Dict:
    """
    Get current user from JWT token in Authorization header
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    token = auth_header[7:]  # Remove "Bearer " prefix
    
    user_info = verify_jwt(token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    return user_info