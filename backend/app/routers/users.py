from fastapi import APIRouter, HTTPException

from app.schemas.user import UserInDB
from app.services.users import listar_users, buscar_user_username

router_users = APIRouter(tags=["Users"])

@router_users.get("/users", response_model=list[UserInDB])
def listar():
    return listar_users()

@router_users.get("/users/{username}", response_model=UserInDB)
def obter(username: str):
    user = buscar_user_username(username)
    if user is None: raise HTTPException(status_code=404, detail="Usuário não encontrado!")
    return user
