from src.db.models.carrito_items_model import Carrito_items
from src.dtos.carrito_items_dto import Carrito_itemsResponseDTO


def to_Carrito_items_response(carrito_items: Carrito_items) -> Carrito_itemsResponseDTO:
    return Carrito_itemsResponseDTO(
        id=carrito_items.id,
        carrito_id=carrito_items.carrito_id,
        plato_id=carrito_items.plato_id,
        cantidad=carrito_items.cantidad
    )