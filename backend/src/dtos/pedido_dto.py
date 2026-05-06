from pydantic import BaseModel

class CreatePedidoDTO(BaseModel):
    cliente_id: int
    restaurante_id: int
    repartidor_id: int
    fecha: str
    estado: str
    total: float
    direccion_entrega: str

class PedidoResponseDTO(BaseModel):
    id: int
    cliente_id: int
    restaurante_id: int
    repartidor_id: int
    fecha: str
    estado: str
    total: float
    direccion_entrega: str
    
