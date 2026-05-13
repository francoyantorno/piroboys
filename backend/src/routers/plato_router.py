from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from backend.src.dtos.plato_dto import CreatePlatoDTO, PlatoResponseDTO
from src.schemas.plato_schema import CreatePlatoSchema, UpdatePlatoSchema
from src.services.plato_service import PlatoService

router = APIRouter(prefix="/platos", tags=["platos"])


@router.post("/", response_model=PlatoResponseDTO, status_code=status.HTTP_201_CREATED)
def create_plato(payload: CreatePlatoSchema, db: Session = Depends(get_db)):
    dto = CreatePlatoDTO(**payload.model_dump())
    return PlatoService(db).create(dto)


@router.get("/{plato_id}", response_model=PlatoResponseDTO)
def get_plato(plato_id: int, db: Session = Depends(get_db)):
    return PlatoService(db).get_by_id(plato_id)


@router.get("/restaurante/{restaurante_id}", response_model=list[PlatoResponseDTO])
def list_platos_by_restaurante(restaurante_id: int, db: Session = Depends(get_db)):
    return PlatoService(db).list_by_restaurant(restaurante_id)


@router.get("/restaurante/{restaurante_id}/disponibles", response_model=list[PlatoResponseDTO])
def list_platos_disponibles_by_restaurante(restaurante_id: int, db: Session = Depends(get_db)):
    return PlatoService(db).list_available_by_restaurant(restaurante_id)


@router.put("/{plato_id}", response_model=PlatoResponseDTO)
def update_plato(plato_id: int, payload: UpdatePlatoSchema, db: Session = Depends(get_db)):
    dto = CreatePlatoDTO(**{k: v for k, v in payload.model_dump().items() if v is not None})
    return PlatoService(db).update(plato_id, dto)


@router.delete("/{plato_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plato(plato_id: int, db: Session = Depends(get_db)):
    PlatoService(db).delete(plato_id)