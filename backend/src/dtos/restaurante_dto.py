from pydantic import BaseModel

class CreateRestauranteDTO(BaseModel):
    name: str
    categoria: str
    direccion: str
    calificacion_promedio: int

class RestauranteResponseDTO(BaseModel):
    id: int
    name: str
    categoria: str
    direccion: str
    calificacion_promedio: int
