from sqlalchemy.orm import Session
from src.db.models.restaurante_model import Restaurante


class RestauranteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, categoria: str, direccion: str, calificacion_promedio: float) -> Restaurante:
        restaurante = Restaurante(nombre=nombre, categoria=categoria, direccion=direccion, calificacion_promedio=calificacion_promedio)
        self.db.add(restaurante)
        self.db.commit()
        self.db.refresh(restaurante)
        return restaurante

    def find_by_id(self, restaurante_id: int) -> Restaurante | None:
        return self.db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()

    def update(self, restaurante_id: int, **fields) -> Restaurante | None:
        restaurante = self.db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()
        if restaurante:
            for key, value in fields.items():
                setattr(restaurante, key, value)
            self.db.commit()
            self.db.refresh(restaurante)
        return restaurante
