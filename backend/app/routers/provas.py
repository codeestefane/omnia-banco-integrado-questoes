from fastapi import APIRouter, HTTPException

from app.schemas.prova import Prova, ProvaResumo
from app.services.enem import (
    EnemErro,
    ProvaNaoEncontrada,
    buscar_prova_enem,
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