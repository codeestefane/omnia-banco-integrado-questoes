from fastapi import APIRouter, HTTPException, Query

from app.schemas.prova import Prova, ProvaResumo
from app.services.enem import (
    EnemErro,
    ProvaNaoEncontrada,
    buscar_prova_enem,
    gerar_simulado_enem,
    listar_provas_enem,
)

router_provas = APIRouter(prefix="/provas", tags=["Provas (ENEM)"])

@router_provas.get("/enem", response_model=list[ProvaResumo])
def listar():
    try:
        return listar_provas_enem()
    except EnemErro as e:
        raise HTTPException(status_code=502, detail=str(e))

@router_provas.get("/enem/{ano}/{area}", response_model=Prova)
def obter(ano: int, area: str):
    try:
        return buscar_prova_enem(ano, area)
    except ProvaNaoEncontrada:
        raise HTTPException(status_code=404, detail="Prova não encontrada!")
    except EnemErro as e:
        raise HTTPException(status_code=502, detail=str(e))

@router_provas.get("/enem/simulado", response_model=Prova)
def simulado(area: str, quantidade: int = Query(default=2, ge=1, le=10)):
    try:
        return gerar_simulado_enem(area, quantidade)
    except ProvaNaoEncontrada as e:
        raise HTTPException(status_code=404, detail=str(e) or "Nenhuma questão disponível.")
    except EnemErro as e:
        raise HTTPException(status_code=502, detail=str(e))