from pydantic import BaseModel
import datetime

class CreatePedido_PlatosDTO(BaseModel):
    pedido_id: int
    plato_id: int
    cantidad: int
    precio_unitario: float

class Pedido_PlatosResponseDTO(BaseModel):
    plato_id: int
    pedido_id: int
    cantidad: int
    precio_unitario: float

    