from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class CreateClienteSchema(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    email: EmailStr
    direccion: str = Field(min_length=1, max_length=200)
    codigo_postal: str = Field(min_length=1, max_length=10)
    telefono: Optional[str] = Field(
        None,
        min_length=7,
        max_length=20,
        regex=r"^[\d\+\-\(\) ]+$"
    )


class UpdateClienteSchema(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    direccion: Optional[str] = Field(None, min_length=1, max_length=200)
    codigo_postal: Optional[str] = Field(None, min_length=1, max_length=10)
    telefono: Optional[str] = Field(
        None,
        min_length=7,
        max_length=20,
        regex=r"^[\d\+\-\(\) ]+$"
    )


class ClienteResponseSchema(BaseModel):
    id: int
    nombre: str
    email: str
    direccion: str
    codigo_postal: str
    telefono: Optional[str]

    class Config:
        from_attributes = True