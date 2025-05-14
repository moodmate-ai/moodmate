"""
diary 생성시 분석 결과 저장 및 반환
"""
from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide
from ai_api.core.domain.usecase.analyze import AnalyzeUsecase
from ai_api.di.container import Container
from .dto import DiaryAnalyzeRequest, DiaryAnalyzeResponse

diary_router = APIRouter(
    prefix="/v1/diary",
    responses={404: {"description": "Not found url"}},
    #dependencies=[Depends(common_headers)],
)


@diary_router.post("/analyze")
@inject
async def analyze(
    body: DiaryAnalyzeRequest,
    usecase: AnalyzeUsecase = Depends(Provide[Container.analyze_usecase]),
)-> DiaryAnalyzeResponse:
    emotion, first_message = await usecase.execute(body.content)
    return DiaryAnalyzeResponse(
        emotion=emotion,
        message=first_message
    )
    