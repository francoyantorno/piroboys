from src.db.models.cupon_model import Cupon
from src.dtos.cupon_dto import CuponResponseDTO


def to_cupon_response(cupon: Cupon) -> CuponResponseDTO:
    return CuponResponseDTO(
        id=cupon.id,
        codigo=cupon.codigo,
        porcentaje_descuento=cupon.porcentaje_descuento,
        fecha_vencimiento=cupon.fecha_vencimiento,
        usos_maximos=cupon.usos_maximos,
        usos_actuales=cupon.usos_actuales
    )