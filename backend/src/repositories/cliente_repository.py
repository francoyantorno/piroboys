from sqlalchemy.orm import Session

from src.db.models.cliente_model import Cliente


class ClienteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, email: str, direccion: str, codigo_postal: str, telefono: str | None = None) -> Cliente:
        cliente = Cliente(
            nombre=nombre,
            email=email,
            direccion=direccion,
            codigo_postal=codigo_postal,
            telefono=telefono
        )
        self.db.add(cliente)
        self.db.commit()
        self.db.refresh(cliente)
        return cliente

    def find_by_id(self, cliente_id: int) -> Cliente | None:
        return self.db.query(Cliente).filter(Cliente.id == cliente_id).first()

    def find_by_email(self, email: str) -> Cliente | None:
        return self.db.query(Cliente).filter(Cliente.email == email).first()