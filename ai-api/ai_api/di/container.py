from dependency_injector import containers, providers
from ai_api.infra.litellm import get_litellm_router
from ai_api.core.component.llm.litellm import LiteLLM
from ai_api.core.domain.usecase.chat import ChatUsecase
from ai_api.core.domain.usecase.analyze import AnalyzeUsecase
from ai_api.core.component.kb import KB
import aiohttp

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
    
    knowledge_base = providers.Singleton(
        KB,
        api_url=config.knowledge_base_api_url,
    )
    
    chat_usecase = providers.Factory(
        ChatUsecase,
        llm_port=llm_port,
        knowledge_base=knowledge_base,
    )
    
    analyze_usecase = providers.Factory(
        AnalyzeUsecase,
        llm_port=llm_port,
        knowledge_base=knowledge_base,
    )

