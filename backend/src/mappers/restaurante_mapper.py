from src.db.models.restaurante_model import Restaurante
from src.dtos.restaurante_dto import RestauranteResponseDTO


def to_restaurante_response(restaurante: Restaurante) -> RestauranteResponseDTO:
    return RestauranteResponseDTO(
        id=restaurante.id,
        nombre=restaurante.nombre,
        categoria=restaurante.categoria,
        direccion=restaurante.direccion,
        calificacion_promedio=restaurante.calificacion_promedio
    )