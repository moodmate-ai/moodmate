from ai_api.core.domain.port.llm import LLMPort
from typing import Tuple


class AnalyzeUsecase:
    
    def __init__(
        self, 
        llm_port: LLMPort,
    ):
        self.llm_port = llm_port
        
        self.emotion_analysis_prompt = """
        You are an AI assistant that analyzes user's diary content to extract emotions.
        Please analyze the given diary content and select one of the following 5 emotions:
        - 기쁨 (Joy)
        - 슬픔 (Sadness)
        - 분노 (Anger)
        - 두려움 (Fear)
        - 감정없음 (No emotion)

        You must respond ONLY in the following JSON format:
        {"emotion": "selected_emotion"}

        Diary content:
        {content}
        """
        
        self.first_message_prompt = """
        You are an AI assistant that responses user's diary content.
        Following is the user's diary content, you should response to the user's diary content.
        """
    
    async def execute(self, content: str) -> Tuple[str, str]:
        """
        diary content를 분석.
        - search memory등 필요
        """
        
        emotion = await self.llm_port.generate_response(
            [
                {"role": "system", "content": self.emotion_analysis_prompt},
                {"role": "user", "content": content}
            ]
        )
        
        first_message = await self.llm_port.generate_response(
            [
                {"role": "system", "content": self.first_message_prompt},
                {"role": "user", "content": content}
            ]
        )
        
        return emotion, first_message