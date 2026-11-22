from fastapi import APIRouter, HTTPException

from app.schemas.user import UserCreate, UserInDB
from app.services.cadastrar import cadastrar_user

from app.services.users import UsernameErro, EmailErro

router_cadastrar = APIRouter(tags=["Cadastrar"])

@router_cadastrar.post("/cadastrar/", response_model=UserCreate)
def cadastrar(novo_user: UserCreate):
    try:
        user_cadastrado = cadastrar_user(novo_user)
    except UsernameErro:
        raise HTTPException(status_code=409, detail="Username já está sendo utilizado por outro usuário!")
    except EmailErro:
        raise HTTPException(status_code=409, detail="E-mail já está sendo utilizado por outro usuário!")

    return user_cadastrado
