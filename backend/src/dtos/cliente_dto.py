from pydantic import BaseModel

class CreateRepartidorDTO(BaseModel):
    nombre: str
    email: str
    direccion: str
    telefono: int

class RepartidorResponseDTO(BaseModel):
    id: int
    nombre: str
    email: str
    direccion: str
    telefono: int