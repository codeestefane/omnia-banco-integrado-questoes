import json
from functools import lru_cache
from pathlib import Path

from app.schemas.user import UserInDB

arquivo = Path(__file__).resolve().parent.parent / "data" / "users.json"

class UsernameErro(Exception):
    pass

class EmailErro(Exception):
    pass

@lru_cache
def _carregar() -> list[UserInDB]:
    if not Path(arquivo).exists():
        return []
    
    with open(arquivo, encoding="utf-8") as f:
        return [UserInDB(**item) for item in json.load(f)]

def listar_users() -> list[UserInDB]:
    return _carregar()

def buscar_user_username(username: str) -> UserInDB | None:
    return next((u for u in _carregar() if u.username == username), None)

def buscar_user_email(email: str) -> UserInDB | None:
    return next((u for u in _carregar() if u.email == email), None)

def _salvar(users: list[UserInDB]) -> None:
    dados = [u.model_dump(mode="json") for u in users]
    with open(arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

def adicionar_user(novo_user: UserInDB) -> bool:
    users = _carregar()
    
    if buscar_user_username(novo_user.username):
        raise UsernameErro("Username já está sendo utilizado por outro usuário!")

    if buscar_user_email(novo_user.email):
        raise EmailErro("Esse e-mail já foi cadastrado por outro usuário!")
       
    users.append(novo_user)

    _salvar(users)

    return True