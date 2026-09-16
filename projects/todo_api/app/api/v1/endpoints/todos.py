from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.models.todo import Todo
from app.models.user import User
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate

router = APIRouter()

@router.get("/", response_model=List[TodoRead])
async def read_todos(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
) -> Any:

    query = select(Todo).where(Todo.user_id == current_user.id)

    if is_completed is not None:
        query = query.where(Todo.is_completed == is_completed)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_in: TodoCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:

    todo = Todo(**todo_in.model_dump(), user_id=current_user.id)
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo

@router.get("/{todo_id}", response_model=TodoRead)
async def read_todo(
    todo_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:

    result = await db.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    )
    todo = result.scalars().first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo item not found"
        )
    return todo

@router.put("/{todo_id}", response_model=TodoRead)
async def update_todo(
    todo_id: int,
    todo_in: TodoUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:

    result = await db.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    )
    todo = result.scalars().first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo item not found"
        )

    update_data = todo_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)

    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> None:

    result = await db.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    )
    todo = result.scalars().first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo item not found"
        )
    await db.delete(todo)
    await db.commit()