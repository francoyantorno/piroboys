from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.restaurante_dto import CreateRestauranteDTO, RestauranteResponseDTO
from src.schemas.restaurante_schema import CreateRestauranteSchema
from src.services.restaurante_service import RestauranteService

router = APIRouter(prefix="/Restaurantes", tags=["restaurantes"])


@router.post("/", response_model=RestauranteResponseDTO, status_code=status.HTTP_201_CREATED)
def create_restaurante(payload: CreateRestauranteSchema, db: Session = Depends(get_db)):
    dto = CreateRestauranteDTO(**payload.model_dump())
    return RestauranteService(db).create(dto)


@router.get("/{restaurante_id}", response_model=RestauranteResponseDTO)
def get_restaurante(restaurante_id: int, db: Session = Depends(get_db)):
    return RestauranteService(db).get_by_id(restaurante_id)


@router.get("/restaurant/{restaurante_id}", response_model=list[RestauranteResponseDTO])
def list_restaurantes_by_restaurant(restaurante_id: int, db: Session = Depends(get_db)):
    return RestauranteService(db).list_by_restaurant(restaurante_id)


@router.get("/restaurant/{restaurante_id}/available", response_model=list[RestauranteResponseDTO])
def list_available_restaurantes_by_restaurant(restaurante_id: int, db: Session = Depends(get_db)):
    return RestauranteService(db).list_available_by_restaurant(restaurante_id)


@router.put("/{restaurante_id}", response_model=RestauranteResponseDTO)
def update_restaurante(restaurante_id: int, payload: CreateRestauranteSchema, db: Session = Depends(get_db)):
    dto = CreateRestauranteDTO(**{k: v for k, v in payload.model_dump().items() if v is not None})
    return RestauranteService(db).update(restaurante_id, dto)


@router.delete("/{restaurante_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurante(restaurante_id: int, db: Session = Depends(get_db)):
    RestauranteService(db).delete(restaurante_id)
