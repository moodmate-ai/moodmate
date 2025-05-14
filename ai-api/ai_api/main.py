from fastapi import FastAPI
from functools import partial
from dotenv import load_dotenv
from ai_api.di.config import BaseConfig
from ai_api.di.container import Container
from ai_api.present.chat.router import chat_router
from ai_api.present.health.router import health_router
from ai_api.present.diary.router import diary_router
from ai_api.core.logging.base import init_logging, shutdown_logging
import logging


async def lifespan(app: FastAPI):
    load_dotenv()
    config = BaseConfig()
    init_logging(
        level=config.logging_level,
        handlers=[
            logging.StreamHandler(),
        ],
    )

    container = Container()
    container.config.from_pydantic(config)
    container.unwire()
    container.wire(
        modules=[
            "ai_api.present.chat.router",
            "ai_api.present.diary.router",
        ]
    )

    app.state.container = container
    app.include_router(chat_router)
    app.include_router(diary_router)
    app.include_router(health_router)

    yield

    await container.shutdown_resources()
    shutdown_logging()


def get_application():
    app = FastAPI(lifespan=partial(lifespan))
    return app


app = get_application()
