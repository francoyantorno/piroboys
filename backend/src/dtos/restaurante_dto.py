from pydantic import BaseModel

class CreateRestauranteDTO(BaseModel):
    nombre: str
    categoria: str
    direccion: str
    calificacion_promedio: float

class RestauranteResponseDTO(BaseModel):
    id: int
    nombre: str
    categoria: str
    direccion: str
    calificacion_promedio: float
