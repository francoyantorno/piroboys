from pydantic import BaseModel

class CreateCarritoDTO(BaseModel):
    cliente_id: int
    restaurante_id: int
    repartidor_id: int | None
    estado: str
    total: int
    direccion_entrega: str
class CarritoResponseDTO(BaseModel):
    id: int
    cliente_id: int
    restaurante_id: int
    repartidor_id: int | None
    fecha: str
    estado: str
    total: int
    direccion_entrega: str

