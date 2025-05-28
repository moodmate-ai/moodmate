from .dto import (
    ChatRequest,
    ChatResponse,
)
from fastapi import APIRouter, Depends
from ai_api.di.container import Container
from ai_api.core.domain.entity.chat import ChatMessage
from dependency_injector.wiring import inject, Provide
import logging
from ai_api.core.domain.usecase.chat import ChatUsecase, ChatUsecaseInput

logger = logging.getLogger(__name__)

chat_router = APIRouter(
    prefix="/v1/chat",
    responses={404: {"description": "Not found url"}},
)


@chat_router.post("/completion", response_model=ChatResponse)
@inject
async def chat(
    body: ChatRequest,
    usecase: ChatUsecase = Depends(Provide[Container.chat_usecase]),
) -> ChatResponse:

    input_data = ChatUsecaseInput(
        user_id=body.user_id,
        diary_id=body.diary_id,
        messages=body.messages,
    )
    print(input_data)
    response = await usecase.execute(input_data)
    return ChatResponse(content=response)
