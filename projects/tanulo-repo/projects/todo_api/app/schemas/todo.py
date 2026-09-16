from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class TodoBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Title of the todo item"
    )
    description: Optional[str] = Field(
        None,
        max_length=2000,
        description="Optional detailed description"
    )

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    is_completed: Optional[bool] = None

class TodoRead(TodoBase):
    id: int
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TodoListResponse(BaseModel):
    total: int
    items: list[TodoRead]