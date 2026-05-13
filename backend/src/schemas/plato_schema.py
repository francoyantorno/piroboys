from pydantic import BaseModel, Field


class CreatePlatoSchema(BaseModel):
    nombre: str = Field(min_length=1)
    descripcion: str = Field(min_length=1)
    precio: float = Field(gt=0)
    disponible: bool = True
    restaurante_id: int = Field(gt=0)


class UpdatePlatoSchema(BaseModel):
    nombre: str | None = Field(None, min_length=1)
    descripcion: str | None = Field(None, min_length=1)
    precio: float | None = Field(None, gt=0)
    disponible: bool | None = None
    restaurante_id: int | None = Field(None, gt=0)