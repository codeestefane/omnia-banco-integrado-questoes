from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends

from app.schemas.questao import Questao, GerarQuestoesRequest
from app.services.materiais import buscar_material
from app.services.gemini import IAErro, IAIndisponivel, QuantidadeErro, gerar_questoes

from app.schemas.user import UserInDB
from app.services.login import get_current_active_user

router_questoes = APIRouter(tags=["Questões (IA)"])

@router_questoes.post("/questoes", response_model=list[Questao])
def gerar(material_id: int, dados: GerarQuestoesRequest, user: Annotated[UserInDB, Depends(get_current_active_user)]):
    material = buscar_material(material_id)
    if material is None:
        raise HTTPException(status_code=404, detail="Material não encontrado!")
    try:
        return gerar_questoes(material, dados.dificuldade, dados.quantidade)
    except IAIndisponivel:
        raise HTTPException(status_code=503, detail="Serviço de IA não configurado!")
    except IAErro as e:
        raise HTTPException(status_code=502, detail=str(e)) # é mais dificil de verificar o erro, por isso (e)
    except QuantidadeErro:
        raise HTTPException(status_code=422, detail="Por favor, insira uma quantidade válida!")
    