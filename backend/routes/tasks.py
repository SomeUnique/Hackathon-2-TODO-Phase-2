from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from models import Task
from schemas import TaskCreate, TaskUpdate, TaskRead
from dependencies import get_db, get_current_user
from sqlmodel import select
from datetime import datetime

router = APIRouter(prefix="/api/tasks")

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        new_task = Task(
            user_id="1",  # Ise number 1 ke bajaye string "1" karein
            title=task_data.title,
            description=task_data.description or "",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_task)
        await db.commit()
        await db.refresh(new_task)
        return new_task
    except Exception as e:
        print(f"BACKEND ERROR: {e}")  # Ye error aapke terminal mein dikhayega
        raise HTTPException(status_code=500, detail=str(e))
    
# @router.get("/", response_model=List[TaskRead])
# async def get_tasks(
#     status_filter: str = "all",
#     db: AsyncSession = Depends(get_db),
#     current_user: dict = Depends(get_current_user)
# ):
#     # Query tasks for the authenticated user
#     query = select(Task).where(Task.user_id == current_user["user_id"])
    
#     # Apply status filter if specified
#     if status_filter == "pending":
#         query = query.where(Task.completed == False)
#     elif status_filter == "completed":
#         query = query.where(Task.completed == True)
#     # If status_filter is "all", no additional filtering is needed
    
#     result = await db.execute(query)
#     tasks = result.scalars().all()
    
#     return tasks

@router.get("/", response_model=List[TaskRead]) # Yahan / ke baad slash lazmi hai
async def get_tasks(db: AsyncSession = Depends(get_db)):
    # Dummy data hata kar asli query likhein:
    query = select(Task) 
    result = await db.execute(query)
    tasks = result.scalars().all()
    return tasks

@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db)
    # current_user: dict = Depends(get_current_user)  <-- Is line ko comment/remove karein
):
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update fields
    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)
    
    task.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(task)
    return task

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db)
    # current_user: dict = Depends(get_current_user)  <-- Is line ko hata dein ya comment karein
):
    # Query task without checking user_id for now
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await db.delete(task)
    await db.commit()
    
    return {"message": "Task deleted successfully"}

@router.patch("/{task_id}/complete", response_model=TaskRead)
async def toggle_task_completion(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Toggle completion status of a specific task for the authenticated user
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user["user_id"])
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Toggle the completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(task)
    
    return task