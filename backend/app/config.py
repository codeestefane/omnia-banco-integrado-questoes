from pydantic_settings import BaseSettings, SettingsConfigDict

class Configuracao(BaseSettings):
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.8-flash"
    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def origens_permitidas(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

configuracao = Configuracao()