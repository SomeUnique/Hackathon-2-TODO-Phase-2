from sqlmodel import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True)

async def init_db():
    """Initialize the database and create tables"""
    from sqlmodel import SQLModel
    from models import Task  # Import here to avoid circular imports
    
    async with engine.begin() as conn:
        # Create all tables defined in SQLModel models
        await conn.run_sync(SQLModel.metadata.create_all)