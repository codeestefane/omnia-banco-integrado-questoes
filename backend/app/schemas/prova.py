from app.schemas.base import CamelMode

class QuestaoProva(CamelMode):
    id: str
    numero: int
    enunciado: str
    alternativas: list[str]
    correta: int
    area: str

class ProvaResumo(CamelMode):
    id: str
    banca: str
    ano: str
    area: str

class Prova(ProvaResumo):
    questoes: list[QuestaoProva]