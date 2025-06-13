from ai_api.core.domain.entity.chat import ChatMessage
from ai_api.core.domain.port.llm import LLMPort
from ai_api.core.domain.port.kb import KnowledgeBase
from pydantic import BaseModel


class ChatUsecaseInput(BaseModel):
    user_id: str
    diary_id: str
    messages: list[ChatMessage]


class ChatUsecase:
    
    def __init__(self, llm_port: LLMPort, knowledge_base: KnowledgeBase):
        self.llm_port = llm_port
        self.knowledge_base = knowledge_base

        self.system_prompt = """
        You are an AI assistant, named MoodMate, that responses user's diary content.
        You must take the user's emotion into account when replying. 
        If the user is sad, comfort them. If joyful, celebrate with them. If angry, validate their frustration. 
        Be supportive and emotionally intelligent in your response.
        
        Following is extracted knowledge graph from user's diary content.
        You should use this knowledge graph to response to the user's diary content.
        {knowledge_graph}
        
        Following is the user's diary content, you should response to the user's diary content.
        """

    async def execute(self, input_data: ChatUsecaseInput) -> str:
        """
        Give answer based on the messages
        """
        knowledge_graph = await self.knowledge_base.get_knowledge(
            input_data.user_id,
            input_data.messages[-1].content
        )
        prompt = self.system_prompt.format(knowledge_graph=knowledge_graph)
        input_messages = [
            {"role": "system", "content": prompt}
        ]

        for message in input_data.messages:
            input_messages.append({"role": message.role, "content": message.content})
        
        print(input_messages)

        response = await self.llm_port.generate_response(input_messages)
        return response
