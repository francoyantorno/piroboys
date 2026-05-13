from src.db.models.carrito_model import Carrito
from src.dtos.carrito_dto import CarritoResponseDTO


def to_carrito_response(carrito: Carrito) -> CarritoResponseDTO:
    return CarritoResponseDTO(
        id=carrito.id,
        cliente_id=carrito.cliente_id,
        restaurante_id=carrito.restaurante_id,
        fecha_actualizacion=carrito.fecha_actualizacion
    )