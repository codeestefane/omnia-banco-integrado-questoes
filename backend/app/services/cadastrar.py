from app.schemas.user import UserInDB, UserCreate
from app.services.users import adicionar_user

from app.services.autenticacao import get_password_hash
from app.services.users import UsernameErro, EmailErro

def cadastrar_user(novo_user: UserCreate) -> UserCreate | None:
    hashed_password = get_password_hash(novo_user.password)

    user_db = UserInDB(
    **novo_user.model_dump(exclude={"password"}),
    hashed_password=hashed_password)

    try:
        user = adicionar_user(user_db)
    except UsernameErro:
        raise UsernameErro()
    except EmailErro:
        raise EmailErro()

    if user:
        return novo_user