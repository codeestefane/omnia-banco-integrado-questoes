from fastapi import APIRouter, HTTPException

from app.schemas.material import Material
from app.services.materiais import listar_materiais, buscar_material

router_materiais = APIRouter(tags=["Materiais"])

@router_materiais.get("/materiais", response_model=list[Material])
def listar():
    return listar_materiais()

@router_materiais.get("/materiais/{material_id}", response_model=Material)
def obter(material_id: int):
    material = buscar_material(material_id)
    if material is None: raise HTTPException(status_code=404, detail="Material não encontrado!")
    return material
