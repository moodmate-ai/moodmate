from ai_api.core.domain.entity.chat import ChatMessage
from ai_api.core.domain.port.llm import LLMPort


class ChatUsecase:
    
    def __init__(self, llm_port: LLMPort):
        self.llm_port = llm_port

    async def execute(self, messages: list[ChatMessage]) -> str:
        """
        Give answer based on the messages
        """
        messages = [
            item.model_dump() for item in messages
        ]
        response = await self.llm_port.generate_response(messages)
        return response
