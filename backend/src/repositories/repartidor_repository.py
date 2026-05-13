from sqlalchemy.orm import Session

from src.db.models.repartidor_model import Repartidor


class RepartidorRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, vehiculo: str | None = None) -> Repartidor:
        repartidor = Repartidor(
            nombre=nombre,
            vehiculo=vehiculo,
            disponible=True
        )
        self.db.add(repartidor)
        self.db.commit()
        self.db.refresh(repartidor)
        return repartidor

    def find_by_id(self, repartidor_id: int) -> Repartidor | None:
        return self.db.query(Repartidor).filter(Repartidor.id == repartidor_id).first()

    def get_disponibles(self) -> list[Repartidor]:
        return self.db.query(Repartidor).filter(Repartidor.disponible == True).all()