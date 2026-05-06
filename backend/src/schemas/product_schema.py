from pydantic import BaseModel, Field
from typing import Optional


class CreateProductSchema(BaseModel):
    nombre: str = Field(min_length=1)
    descripcion: Optional[str] = None
    precio: float = Field(gt=0)
    restaurante_id: int = Field(gt=0)
    disponible: bool = True


class UpdateProductSchema(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1)
    descripcion: Optional[str] = None
    precio: Optional[float] = Field(None, gt=0)
    disponible: Optional[bool] = None
