import json
from functools import lru_cache
from pathlib import Path

from app.schemas.material import Material

arquivo = Path(__file__).resolve().parent.parent / "data" / "materiais.json"

@lru_cache
def _carregar() -> list[Material]:
    with open(arquivo, encoding="utf-8") as f:
        return [Material(**item) for item in json.load(f)]

def listar_materiais() -> list[Material]:
    return _carregar()

def buscar_material(material_id: int) -> Material | None:
    return next((m for m in _carregar() if m.id == material_id), None)