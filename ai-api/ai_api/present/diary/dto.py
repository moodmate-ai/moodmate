from pydantic import BaseModel
from datetime import datetime

class DiaryAnalyzeRequest(BaseModel):
    user_id: str
    content: str
    created_at: datetime

class DiaryAnalyzeResponse(BaseModel):
    """
    emotion: user's emotion
    message: ai assistant's response
    """
    emotion: str
    message: str