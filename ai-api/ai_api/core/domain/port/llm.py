from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any
from ai_api.core.domain.entity.chat import ChatMessage

class LLMPort(ABC):
    @abstractmethod
    async def generate_response(
        self, 
        messages: List[ChatMessage],
        response_format=None,
        tools: Optional[List[Dict]] = None,
        tool_choice: str = "auto",
    ) -> Any:
        pass