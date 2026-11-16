from app.schemas.base import CamelMode

class Material(CamelMode):
    id: int
    anoEscolar: str
    disciplina: str
    tema: str
    conteudo: str
    videoUrl: str = ""
