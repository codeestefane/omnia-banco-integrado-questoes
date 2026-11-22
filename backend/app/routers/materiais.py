from fastapi import APIRouter, Depends, HTTPException

from app.schemas.material import Material
from app.services.materiais import listar_materiais, buscar_material

from app.services.login import get_current_active_user

router_materiais = APIRouter(
    prefix="/materiais",
    tags=["Materiais"],
    dependencies=[Depends(get_current_active_user)],
)

@router_materiais.get("/", response_model=list[Material])
def listar():
    return listar_materiais()

@router_materiais.get("/{material_id}", response_model=Material)
def obter(material_id: int):
    material = buscar_material(material_id)

    if material is None: raise HTTPException(status_code=404, detail="Material não encontrado!")
    return material
