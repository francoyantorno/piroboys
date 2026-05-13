from pydantic import BaseModel

class CreateProductDTO(BaseModel):
    pedido_id: int
    estado_nuevo: int
    leida: bool | None
    fecha: str
    

class ProductResponseDTO(BaseModel):
    id: int
    pedido_id: int
    estado_nuevo: int
    fecha: str
    leida: bool | None
