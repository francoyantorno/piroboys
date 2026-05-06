from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.product_dto import CreateProductDTO, ProductResponseDTO
from src.schemas.product_schema import CreateProductSchema, UpdateProductSchema
from src.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductResponseDTO, status_code=status.HTTP_201_CREATED)
def create_product(payload: CreateProductSchema, db: Session = Depends(get_db)):
    dto = CreateProductDTO(**payload.model_dump())
    return ProductService(db).create(dto)


@router.get("/{product_id}", response_model=ProductResponseDTO)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return ProductService(db).get_by_id(product_id)


@router.get("/restaurant/{restaurante_id}", response_model=list[ProductResponseDTO])
def list_products_by_restaurant(restaurante_id: int, db: Session = Depends(get_db)):
    return ProductService(db).list_by_restaurant(restaurante_id)


@router.get("/restaurant/{restaurante_id}/available", response_model=list[ProductResponseDTO])
def list_available_products_by_restaurant(restaurante_id: int, db: Session = Depends(get_db)):
    return ProductService(db).list_available_by_restaurant(restaurante_id)


@router.put("/{product_id}", response_model=ProductResponseDTO)
def update_product(product_id: int, payload: UpdateProductSchema, db: Session = Depends(get_db)):
    dto = CreateProductDTO(**{k: v for k, v in payload.model_dump().items() if v is not None})
    return ProductService(db).update(product_id, dto)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    ProductService(db).delete(product_id)
