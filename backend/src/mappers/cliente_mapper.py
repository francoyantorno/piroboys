from src.db.models.cliente_model import Cliente
from src.dtos.cliente_dto import ClienteResponseDTO


def to_Cliente_response(cliente: Cliente) -> ClienteResponseDTO:
    return ClienteResponseDTO(
        id=cliente.id,
        nombre=cliente.nombre,
        direccion=cliente.direccion,
        telefono=cliente.telefono,
        codigo_postal=cliente.codigo_postal,
        email=cliente.email
    )