from pydantic import BaseModel

class CreateCarritoItemsDTO(BaseModel):
    plato_id: int
    carrito_id: int
    cantidad: int


class CarritoItemsResponseDTO(BaseModel):
    id: int
    plato_id: int
    carrito_id: int
    cantidad: int
