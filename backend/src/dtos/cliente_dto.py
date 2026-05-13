from pydantic import BaseModel

class CreateClienteDTO(BaseModel):
    nombre: str
    email: str
    direccion: str
    telefono: int

class ClienteResponseDTO(BaseModel):
    id: int
    nombre: str
    email: str
    direccion: str
    telefono: int