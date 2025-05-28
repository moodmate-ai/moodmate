from abc import ABC, abstractmethod


class MemoryPort(ABC):
    @abstractmethod
    async def search_memory(self, user_id: str, query: str) -> str:
        pass
    
    @abstractmethod
    async def add_memory(self, user_id: str, content: str) -> None:
        pass