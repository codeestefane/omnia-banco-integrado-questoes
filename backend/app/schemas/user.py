from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str
    full_name: str | None = None
    disabled: bool = False

class UserCreate(UserBase):
    password: str  

class UserInDB(UserBase):
    hashed_password: str