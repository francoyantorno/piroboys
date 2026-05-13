from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.schemas.cliente_schema import CreateClienteSchema, ClienteResponseSchema
from src.services.cliente_service import ClienteService

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("/", response_model=ClienteResponseSchema, status_code=status.HTTP_201_CREATED)
def create_cliente(payload: CreateClienteSchema, db: Session = Depends(get_db)):
    return ClienteService(db).create(**payload.model_dump())


@router.get("/{cliente_id}", response_model=ClienteResponseSchema)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    return ClienteService(db).get_by_id(cliente_id)
