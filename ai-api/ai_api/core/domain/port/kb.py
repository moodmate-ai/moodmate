from abc import ABC, abstractmethod
from typing import List

class KnowledgeBase(ABC):

    @abstractmethod
    async def add_knowledge(self, user_id:str, source: str) -> None:
        pass

    @abstractmethod
    async def get_knowledge(self, user_id:str, query: str) -> List[str]:
        pass
