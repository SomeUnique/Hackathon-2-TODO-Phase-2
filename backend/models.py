from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import time

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(sa_column_kwargs={"nullable": False})  # Foreign key reference to users.id
    title: str = Field(max_length=200, sa_column_kwargs={"nullable": False})
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)
    password_hash: Optional[str] = Field(default=None)