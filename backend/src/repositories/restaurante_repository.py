from sqlalchemy.orm import Session

from piroboys.backend.src.db.models.platos_model import Platos
from src.db.models.restaurante_model import Restaurante


class RestauranteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, category: str, address: str, average_rating: int) -> Restaurante:
        restaurante = Restaurante(name=name, category=category, address=address, average_rating=average_rating)
        self.db.add(restaurante)
        self.db.commit()
        self.db.refresh(restaurante)
        return restaurante
    
    def get_plates_from_restaurant(self, restaurante_id: int) -> list[Platos]
