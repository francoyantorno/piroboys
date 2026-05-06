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
    
    def get_restaurante_from_id(self, restaurante_id: int) -> Restaurante:
        return self.db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()

    def update_restaurante(self,nombre: str, categoria: str, direccion: str, calificacion_promedio: float, restaurante_id: int) -> Restaurante:
        restaurante = self.db.query(Restaurante).filter(Restaurante.id == restaurante_id).first()
        if restaurante:
            restaurante.nombre = nombre
            restaurante.categoria = categoria
            restaurante.direccion = direccion
            restaurante.calificacion_promedio = calificacion_promedio
            self.db.commit()
            self.db.refresh(restaurante)
        return restaurante
    