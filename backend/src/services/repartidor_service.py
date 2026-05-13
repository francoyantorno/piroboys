from sqlalchemy.orm import Session

from src.repositories.repartidor_repository import RepartidorRepository
from src.utils.errors import NotFoundError


class RepartidorService:
    def __init__(self, db: Session):
        self.repo = RepartidorRepository(db)

    def create(self, nombre: str, vehiculo: str | None = None):
        return self.repo.create(
            nombre=nombre,
            vehiculo=vehiculo
        )

    def get_by_id(self, repartidor_id: int):
        repartidor = self.repo.find_by_id(repartidor_id)
        if not repartidor:
            raise NotFoundError("Repartidor no encontrado")
        return repartidor

    def get_disponibles(self):
        return self.repo.get_disponibles()
