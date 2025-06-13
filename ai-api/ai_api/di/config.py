from pydantic_settings import BaseSettings


class BaseConfig(BaseSettings):
    logging_level: str = "INFO"
    redis_host: str = "localhost"
    redis_port: int = 6379
    
    # LiteLLM configs
    gemini_api_key: str
    llm_model_name: str =  "gemini-2.0-flash"
    
    knowledge_base_api_url: str = "http://localhost:3000/v1/knowledge"