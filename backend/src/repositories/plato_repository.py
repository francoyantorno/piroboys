from sqlalchemy.orm import Session

from src.db.models.platos_model import Platos


class PlatoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, descripcion: str, precio: float, disponible: bool, restaurante_id: int) -> Platos:
        plato = Platos(nombre=nombre, descripcion=descripcion, precio=precio, disponible=disponible, restaurante_id=restaurante_id)
        self.db.add(plato)
        self.db.commit()
        self.db.refresh(plato)
        return plato

    def find_by_id(self, plato_id: int) -> Platos | None:
        return self.db.query(Platos).filter(Platos.id == plato_id).first()

    def list_by_restaurant(self, restaurante_id: int) -> list[Platos]:
        return self.db.query(Platos).filter(Platos.restaurante_id == restaurante_id).all()

    def list_available_by_restaurant(self, restaurante_id: int) -> list[Platos]:
        return self.db.query(Platos).filter(Platos.restaurante_id == restaurante_id, Platos.disponible == True).all()

    def update(self, plato_id: int, **fields) -> Platos | None:
        plato = self.db.query(Platos).filter(Platos.id == plato_id).first()
        if plato:
            for key, value in fields.items():
                setattr(plato, key, value)
            self.db.commit()
            self.db.refresh(plato)
        return plato

    def delete(self, plato_id: int) -> bool:
        plato = self.db.query(Platos).filter(Platos.id == plato_id).first()
        if plato:
            self.db.delete(plato)
            self.db.commit()
            return True
        return False