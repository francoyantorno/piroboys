from src.db.models.pedido_platos_model import Pedido_platos
from src.dtos.pedido_platos_dto import Pedido_platosResponseDTO


def to_pedido_platos_response(pedido_platos: Pedido_platos) -> Pedido_platosResponseDTO:
    return Pedido_platosResponseDTO(
        plato_id=pedido_platos.plato_id,
        pedido_id=pedido_platos.pedido_id,
        cantidad=pedido_platos.cantidad,
        precio_unitario=pedido_platos.precio_unitario
    )