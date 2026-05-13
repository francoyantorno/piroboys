from pydantic import BaseModel
import datetime

class CreateCalificacionDTO(BaseModel):
    pedido_id: int
    puntaje: int
    comentario: str | None

class CalificacionResponseDTO(BaseModel):
    id: int
    pedido_id: int
    puntaje: int
    comentario: str | None
    fecha: datetime
    

    