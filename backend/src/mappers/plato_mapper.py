from src.db.models.plato_model import Plato
from src.dtos.plato_dto import PlatoResponseDTO


def to_plato_response(plato: Plato) -> PlatoResponseDTO:
    return PlatoResponseDTO(
        id=plato.id,
        restaurante_id=plato.restaurante_id,
        nombre=plato.nombre,
        precio=plato.precio,
        disponible=plato.disponible,
        descripcion=plato.descripcion
    )