from pydantic import BaseModel, Field
from typing import Optional


class CreateRepartidorSchema(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    vehiculo: Optional[str] = Field(None, max_length=50)


class UpdateRepartidorSchema(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    vehiculo: Optional[str] = Field(None, max_length=50)
    disponible: Optional[bool] = None


class RepartidorResponseSchema(BaseModel):
    id: int
    nombre: str
    vehiculo: Optional[str]
    disponible: bool

    class Config:
        from_attributes = True
