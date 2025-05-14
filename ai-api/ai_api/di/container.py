from dependency_injector import containers, providers
from ai_api.infra.litellm import get_litellm_router
from ai_api.core.component.llm.litellm import LiteLLM
from ai_api.core.domain.usecase.chat import ChatUsecase


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()
    
    
    litellm_router = providers.Factory(
        get_litellm_router,
        gemini_api_key=config.gemini_api_key,
    )
    
    llm_port = providers.Singleton(
        LiteLLM,
        litellm_router=litellm_router,
        model_name=config.llm_model_name,
    )
    
    chat_usecase = providers.Factory(
        ChatUsecase,
        llm_port=llm_port,
    )

