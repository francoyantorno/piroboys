from sqlalchemy.orm import Session

from src.dtos.product_dto import CreateProductDTO, ProductResponseDTO
from src.mappers.product_mapper import to_product_response
from src.repositories.product_repository import ProductRepository
from src.utils.errors import NotFoundError


class ProductService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db)

    def create(self, dto: CreateProductDTO) -> ProductResponseDTO:
        if dto.precio <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        product = self.repo.create(
            nombre=dto.nombre,
            descripcion=dto.descripcion,
            precio=dto.precio,
            restaurante_id=dto.restaurante_id,
            disponible=dto.disponible
        )
        return to_product_response(product)

    def get_by_id(self, product_id: int) -> ProductResponseDTO:
        product = self.repo.find_by_id(product_id)
        if not product:
            raise NotFoundError(f"Producto con id {product_id} no encontrado")
        return to_product_response(product)

    def list_by_restaurant(self, restaurante_id: int) -> list[ProductResponseDTO]:
        products = self.repo.list_by_restaurant(restaurante_id)
        return [to_product_response(p) for p in products]

    def list_available_by_restaurant(self, restaurante_id: int) -> list[ProductResponseDTO]:
        products = self.repo.list_available_by_restaurant(restaurante_id)
        return [to_product_response(p) for p in products]

    def update(self, product_id: int, dto: CreateProductDTO) -> ProductResponseDTO:
        product = self.repo.update(product_id, **dto.model_dump())
        if not product:
            raise NotFoundError(f"Producto con id {product_id} no encontrado")
        return to_product_response(product)

    def delete(self, product_id: int) -> None:
        deleted = self.repo.delete(product_id)
        if not deleted:
            raise NotFoundError(f"Producto con id {product_id} no encontrado")
