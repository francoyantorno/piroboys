from pydantic import BaseModel

class CreateNotificacionDTO(BaseModel):
    pedido_id: int
    estado_nuevo: int
    leida: bool | None
    fecha: str
    

class NotificacionResponseDTO(BaseModel):
    id: int
    pedido_id: int
    estado_nuevo: int
    fecha: str
    leida: bool | None
