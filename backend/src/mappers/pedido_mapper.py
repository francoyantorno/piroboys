from src.db.models.pedido_model import Pedido
from src.dtos.pedido_dto import PedidoResponseDTO


def to_pedido_response(pedido: Pedido) -> PedidoResponseDTO:
    return PedidoResponseDTO(
        id=pedido.id,
        cliente_id=pedido.cliente_id,
        restaurante_id=pedido.restaurante_id,
        repartidor_id=pedido.repartidor_id,
        cupon_id=pedido.cupon_id,
        fecha=pedido.fecha,
        estado=pedido.estado,
        subtotal=pedido.subtotal,
        monto_descuento=pedido.monto_descuento,
        total=pedido.total,
        direccion_entrega=pedido.direccion_entrega,
        codigo_postal_entrega=pedido.codigo_postal_entrega
    )