from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from app.schemas.autenticacao import Token
from app.services.login import authenticate_user, create_access_token, timedelta, CredenciaisErro, UserInativo, get_current_active_user
from app.config import configuracao

from app.schemas.user import UserInDB

router_login = APIRouter(tags=["Login"])

@router_login.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Nome de usuário ou senha incorretos!",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=configuracao.access_token_expire_minutes)

    try:
        return Token(access_token=create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        ), token_type="bearer")
    except CredenciaisErro:
        raise HTTPException(status_code=401, detail=str(e))
    except UserInativo as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_login.get("/users/me/")
async def read_users_me(
    current_user: Annotated[UserInDB, Depends(get_current_active_user)],
) -> UserInDB:
    return current_user