from pydantic import BaseModel
import datetime

class CreateCuponDTO(BaseModel):
    pedido_id: int
    porcentaje_descuento: int
    fecha_vencimiento: datetime
    usos_maximos: int

class CuponResponseDTO(BaseModel):
    id: int
    codigo_postal: str | None
    porcentaje_descuento: int
    fecha_vencimiento: datetime
    usos_maximos: int
    usos_actuales: int