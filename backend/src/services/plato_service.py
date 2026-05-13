from sqlalchemy.orm import Session

from backend.src.dtos.plato_dto import CreatePlatoDTO, PlatoResponseDTO
from src.mappers.plato_mapper import to_plato_response
from src.repositories.plato_repository import PlatoRepository
from src.utils.errors import NotFoundError


class PlatoService:
    def __init__(self, db: Session):
        self.repo = PlatoRepository(db)

    def create(self, dto: CreatePlatoDTO) -> PlatoResponseDTO:
        if dto.precio <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        plato = self.repo.create(
            nombre=dto.nombre,
            descripcion=dto.descripcion,
            precio=dto.precio,
            disponible=dto.disponible,
            restaurante_id=dto.restaurante_id
        )
        return to_plato_response(plato)

    def get_by_id(self, plato_id: int) -> PlatoResponseDTO:
        plato = self.repo.find_by_id(plato_id)
        if not plato:
            raise NotFoundError(f"Plato con id {plato_id} no encontrado")
        return to_plato_response(plato)

    def list_by_restaurant(self, restaurante_id: int) -> list[PlatoResponseDTO]:
        platos = self.repo.list_by_restaurant(restaurante_id)
        return [to_plato_response(p) for p in platos]

    def list_available_by_restaurant(self, restaurante_id: int) -> list[PlatoResponseDTO]:
        platos = self.repo.list_available_by_restaurant(restaurante_id)
        return [to_plato_response(p) for p in platos]

    def update(self, plato_id: int, dto: CreatePlatoDTO) -> PlatoResponseDTO:
        plato = self.repo.update(plato_id, **dto.model_dump())
        if not plato:
            raise NotFoundError(f"Plato con id {plato_id} no encontrado")
        return to_plato_response(plato)

    def delete(self, plato_id: int) -> None:
        deleted = self.repo.delete(plato_id)
        if not deleted:
            raise NotFoundError(f"Plato con id {plato_id} no encontrado")