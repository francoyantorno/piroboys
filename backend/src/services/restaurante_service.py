from sqlalchemy.orm import Session

from src.dtos.restaurante_dto import CreateRestauranteDTO, RestauranteResponseDTO
from src.mappers.restaurante_mapper import to_restaurante_response
from src.repositories.restaurante_repository import RestauranteRepository
from src.utils.errors import NotFoundError


class RestauranteService:
    def __init__(self, db: Session):
        self.repo = RestauranteRepository(db)

    def create(self, dto: CreateRestauranteDTO) -> RestauranteResponseDTO:
        if dto.calificacion_promedio < 0:
            raise ValueError("La calificación promedio debe ser un número no negativo")
        restaurante = self.repo.create(
            nombre=dto.nombre,
            categoria=dto.categoria,
            direccion=dto.direccion,
            calificacion_promedio=dto.calificacion_promedio
        )
        return to_restaurante_response(restaurante)

    def get_by_id(self, restaurante_id: int) -> RestauranteResponseDTO:
        restaurante = self.repo.find_by_id(restaurante_id)
        if not restaurante:
            raise NotFoundError(f"Restaurante con id {restaurante_id} no encontrado")
        return to_restaurante_response(restaurante)

    def list_by_restaurant(self, restaurante_id: int) -> list[RestauranteResponseDTO]:
        restaurantes = self.repo.list_by_restaurant(restaurante_id)
        return [to_restaurante_response(r) for r in restaurantes]

    def list_available_by_restaurant(self, restaurante_id: int) -> list[RestauranteResponseDTO]:
        restaurantes = self.repo.list_available_by_restaurant(restaurante_id)
        return [to_restaurante_response(r) for r in restaurantes]

    def update(self, restaurante_id: int, dto: CreateRestauranteDTO) -> RestauranteResponseDTO:
        restaurante = self.repo.update(restaurante_id, **dto.model_dump())
        if not restaurante:
            raise NotFoundError(f"Restaurante con id {restaurante_id} no encontrado")
        return to_restaurante_response(restaurante)

    def delete(self, restaurante_id: int) -> None:
        deleted = self.repo.delete(restaurante_id)
        if not deleted:
            raise NotFoundError(f"Restaurante con id {restaurante_id} no encontrado")

    def search(self, q: str | None = None, categoria: str | None = None) -> list[RestauranteResponseDTO]:
        restaurantes = self.repo.search(q=q, categoria=categoria)
        return [to_restaurante_response(r) for r in restaurantes]
