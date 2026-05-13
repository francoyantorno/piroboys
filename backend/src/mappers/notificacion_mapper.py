from src.db.models.notificacion_model import Notificacion
from src.dtos.notificacion_dto import NotificacionResponseDTO


def to_notificacion_response(notificacion: Notificacion) -> NotificacionResponseDTO:
    return NotificacionResponseDTO(
        id=notificacion.id,
        pedido_id=notificacion.pedido_id,
        estado_nuevo=notificacion.estado_nuevo,
        fecha=notificacion.fecha,
        leida=notificacion.leida
    )