from ai_api.core.domain.port.llm import LLMPort
from typing import Tuple
import json

class AnalyzeUsecase:
    
    def __init__(
        self, 
        llm_port: LLMPort,
    ):
        self.llm_port = llm_port
        
        self.emotion_analysis_prompt = """
        You are an AI assistant that analyzes a user's diary content to extract emotional context.
        Your task is to read the user's diary entry and classify it into one of the following 5 emotions:

        - JOY: Positive feelings like happiness, excitement, gratitude.
        - SADNESS: Feelings of loss, loneliness, disappointment.
        - ANGER: Frustration, rage, injustice, irritation.
        - FEAR: Anxiety, nervousness, worry about the future.
        - NO_EMOTION: Neutral content with no strong emotional signal.

        You must respond ONLY in the following JSON format:
        {"emotion": "selected_emotion"}

        ---

        Examples:

        1. Diary: "내가 원하던 직장에 취업하게 되었어. 오늘 정말 하늘을 나는 기분이야!"
        → Response: {"emotion": "JOY"}

        2. Diary: "오늘 너무 외로워서 눈물이 날 뻔했어. 누구랑도 말하지 못하고 하루가 끝났어."
        → Response: {"emotion": "SADNESS"}

        3. Diary: "내가 몇 주 동안 준비한 발표를 아무도 신경 쓰지 않았어. 정말 화가 났어."
        → Response: {"emotion": "ANGER"}

        4. Diary: "이번 주에 발표가 있는데 너무 떨리고 잠이 안 와. 내가 잘할 수 있을까?"
        → Response: {"emotion": "FEAR"}

        5. Diary: "아침에 일어나서 조용히 책을 읽고 산책을 했다. 특별한 일은 없었다."
        → Response: {"emotion": "NO_EMOTION"}

        ---

        Now, analyze the following diary content and return the emotion in JSON format.
        You are an AI assistant that analyzes user's diary content to extract emotions.
        Please analyze the given diary content and select one of the following 5 emotions:
        - JOY
        - SADNESS
        - ANGER
        - FEAR
        - NO_EMOTION
        """
        
        self.first_message_prompt = """
        You are an AI assistant, named MoodMate, that responses user's diary content.
        You must take the user's emotion into account when replying. 
        If the user is sad, comfort them. If joyful, celebrate with them. If angry, validate their frustration. 
        Be supportive and emotionally intelligent in your response.
        
        Following is the user's diary content, you should response to the user's diary content.
        """
    
    async def execute(self, content: str) -> Tuple[str, str]:
        """
        diary content를 분석.
        - search memory등 필요
        """
        
        emotion = await self.llm_port.generate_response(
            messages=[
                {"role": "system", "content": self.emotion_analysis_prompt},
                {"role": "user", "content": content}
            ],
            response_format={"type": "json_object"}
        )
        emotion = json.loads(emotion)["emotion"]
        
        first_message = await self.llm_port.generate_response(
            messages=[
                {"role": "system", "content": self.first_message_prompt},
                {"role": "user", "content": content}
            ]
        )
        
        return emotion, first_message