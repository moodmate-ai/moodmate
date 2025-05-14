from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role")
    content: str = Field(..., description="Content")


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    diary_id: str = Field(..., description="Diary ID")
    messages: list[ChatMessage] = Field(..., description="Messages")


class ChatResponse(BaseModel):
    content: str = Field(..., description="Content")
