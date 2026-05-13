from pydantic import BaseModel

class CreatePlatoDTO(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    disponible: bool
    restaurante_id: int

class PlatoResponseDTO(BaseModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    disponible: bool
    restaurante_id: int
    
    