from aiohttp import ClientSession
from ai_api.core.domain.port.kb import KnowledgeBase
from typing import List
import asyncio

class KB(KnowledgeBase):
    def __init__(
        self,
        api_url: str
    ):
        self.session = ClientSession()
        self.api_url = api_url

    async def add_knowledge(self, user_id: str, source: str):
        async with self.session.post(
            self.api_url,
            json={
                "items": [
                    {
                        "system_id": f"moodmate.{user_id}",
                        "data": source
                    }
                ]
            }
        ) as response:
            if response.status != 200:
                raise Exception(f"Failed to add knowledge: {response.status}")

    async def get_knowledge(self, user_id: str, query: str) -> List[str]:
        async with self.session.get(
            self.api_url,
            params={
                "system_id": f"moodmate.{user_id}",
                "query": query
            }
        ) as response:
            if response.status != 200:
                raise Exception(f"Failed to get knowledge: {response.status}")
            return await response.json()


if __name__ == "__main__":
    async def main():
        async with ClientSession() as session:
            kb = KB(session, "http://localhost:3000/v1/knowledge")
            #await kb.add_knowledge("test", "I like pizza")
            print(await kb.get_knowledge("test", "what do I like?"))

    asyncio.run(main())
