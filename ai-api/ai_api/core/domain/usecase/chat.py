from ai_api.core.domain.entity.chat import ChatMessage
from ai_api.core.domain.port.llm import LLMPort
from pydantic import BaseModel


class ChatUsecaseInput(BaseModel):
    user_id: str
    diary_id: str
    messages: list[ChatMessage]


class ChatUsecase:
    
    def __init__(self, llm_port: LLMPort):
        self.llm_port = llm_port

        self.system_prompt = """
        You are an AI assistant that responses user's diary content.
        Following is the user's diary content, you should response to the user's diary content.
        """

    async def execute(self, input_data: ChatUsecaseInput) -> str:
        """
        Give answer based on the messages
        """
        input_messages = [
            {"role": "system", "content": self.system_prompt}
        ]

        for message in input_data.messages:
            input_messages.append({"role": message.role, "content": message.content})
        
        print(input_messages)

        response = await self.llm_port.generate_response(input_messages)
        return response
