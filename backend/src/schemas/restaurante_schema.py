from pydantic import BaseModel, Field
from typing import Optional


class CreateRestauranteSchema(BaseModel):
    nombre: str = Field(min_length=1)
    categoria: str = Field(min_length=1)
    direccion: str = Field(min_length=1)
    calificacion_promedio: float = Field(ge=0)

