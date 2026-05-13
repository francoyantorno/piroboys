from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.schemas.repartidor_schema import CreateRepartidorSchema, RepartidorResponseSchema
from src.services.repartidor_service import RepartidorService

router = APIRouter(prefix="/repartidores", tags=["repartidores"])


@router.post("/", response_model=RepartidorResponseSchema, status_code=status.HTTP_201_CREATED)
def create_repartidor(payload: CreateRepartidorSchema, db: Session = Depends(get_db)):
    return RepartidorService(db).create(**payload.model_dump())


@router.get("/disponibles", response_model=list[RepartidorResponseSchema])
def get_repartidores_disponibles(db: Session = Depends(get_db)):
    return RepartidorService(db).get_disponibles()


@router.get("/{repartidor_id}", response_model=RepartidorResponseSchema)
def get_repartidor(repartidor_id: int, db: Session = Depends(get_db)):
    return RepartidorService(db).get_by_id(repartidor_id)
