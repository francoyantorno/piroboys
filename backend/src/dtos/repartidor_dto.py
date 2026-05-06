from pydantic import BaseModel

class CreateRepartidorDTO(BaseModel):
    nombre: str
    vehiculo: str
    disponible: bool

class RepartidorResponseDTO(BaseModel):
    id: int
    nombre: str
    vehiculo: str
    disponible: bool
