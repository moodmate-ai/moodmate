from pydantic import BaseModel, Field
from ai_api.core.domain.entity.chat import ChatMessage


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    diary_id: str = Field(..., description="Diary ID")
    messages: list[ChatMessage] = Field(..., description="Messages")


class ChatResponse(BaseModel):
    content: str = Field(..., description="Content")
