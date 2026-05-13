from sqlalchemy.orm import Session

from src.repositories.cliente_repository import ClienteRepository
from src.utils.errors import NotFoundError, ConflictError


class ClienteService:
    def __init__(self, db: Session):
        self.repo = ClienteRepository(db)

    def create(self, nombre: str, email: str, direccion: str, codigo_postal: str, telefono: str | None = None):
        # Normalizar email y verificar que no exista
        email_norm = email.strip().lower()
        existing = self.repo.find_by_email(email_norm)
        if existing:
            raise ConflictError("Email ya registrado")

        return self.repo.create(
            nombre=nombre.strip(),
            email=email_norm,
            direccion=direccion.strip(),
            codigo_postal=codigo_postal.strip(),
            telefono=telefono.strip() if isinstance(telefono, str) else None
        )

    def get_by_id(self, cliente_id: int):
        cliente = self.repo.find_by_id(cliente_id)
        if not cliente:
            raise NotFoundError("Cliente no encontrado")
        return cliente
