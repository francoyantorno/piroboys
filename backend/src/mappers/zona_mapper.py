from src.db.models.zona_model import Zona
from src.dtos.zona_dto import ZonaResponseDTO


def to_zona_response(zona: Zona) -> ZonaResponseDTO:
    return ZonaResponseDTO(
        id=zona.id,
        nombre=zona.nombre,
        restaurante_id=zona.restaurante_id,
        codigo_postal=zona.codigo_postal
    )