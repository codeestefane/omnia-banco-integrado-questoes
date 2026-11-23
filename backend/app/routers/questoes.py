from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends

from app.schemas.questao import Questao, GerarQuestoesRequest
from app.services.materiais import buscar_material
from app.services.gemini import IAErro, IAIndisponivel, IACotaExcedida, QuantidadeErro, gerar_questoes

from app.schemas.user import UserInDB
from app.services.login import get_current_active_user

router_questoes = APIRouter(
    tags=["Questões (IA)"],
    dependencies=[Depends(get_current_active_user)]
)

@router_questoes.post("/questoes", response_model=list[Questao])
def gerar(material_id: int, dados: GerarQuestoesRequest):
    material = buscar_material(material_id)
    if material is None:
        raise HTTPException(status_code=404, detail="Material não encontrado!")
    try:
        return gerar_questoes(material, dados.dificuldade, dados.quantidade)
    except IACotaExcedida:
        raise HTTPException(status_code=429, detail="O limite diário de uso da IA foi atingido. Tente novamente mais tarde.")
    except IAIndisponivel:
        raise HTTPException(status_code=503, detail="Serviço de IA não configurado!")
    except IAErro:
        raise HTTPException(status_code=502, detail="Não foi possível gerar as questões com a IA!") # é mais dificil de verificar o erro, por isso (e)
    except QuantidadeErro:
        raise HTTPException(status_code=422, detail="Por favor, insira uma quantidade válida!")
    