from src.db.models.calificacion_model import Calificacion
from src.dtos.calificacion_dto import CalificacionResponseDTO


def to_calificacion_response(calificacion: Calificacion) -> CalificacionResponseDTO:
    return CalificacionResponseDTO(
        id=calificacion.id,
        pedido_id=calificacion.pedido_id,
        puntaje=calificacion.puntaje,
        comentario=calificacion.comentario,
        fecha=calificacion.fecha
    )