from pydantic import BaseModel
import datetime

class CreateZonaDTO(BaseModel):
    restaurante_id: int
    nombre: str | None
    codigo_postal: str | None

class ZonaResponseDTO(BaseModel):
    id: int
    restaurante_id: int
    nombre: str | None
    codigo_postal: str | None
    

    