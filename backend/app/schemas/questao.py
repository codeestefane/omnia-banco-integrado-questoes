from typing import Literal
from pydantic import BaseModel, Field
from app.schemas.base import CamelMode

Dificuldade = Literal["Fácil", "Médio", "Difícil"]

class Questao(CamelMode):
    id: int
    enunciado: str
    alternativas: list[str]
    correta: int
    justificativa: str
    dificuldade: Dificuldade

# valida o pedido de requisição POST
class GerarQuestoesRequest(CamelMode):
    dificuldade: Dificuldade
    quantidade: int = Field(default=2)

# o que será devolvido
class QuestaoGerada(BaseModel):
    enunciado: str
    alternativas: list[str]
    correta: int
    justificativa: str