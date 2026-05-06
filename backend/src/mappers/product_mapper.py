from src.db.models.product_model import Product
from src.dtos.product_dto import ProductResponseDTO


def to_product_response(product: Product) -> ProductResponseDTO:
    return ProductResponseDTO(
        id=product.id,
        nombre=product.nombre,
        descripcion=product.descripcion,
        precio=float(product.precio),
        disponible=product.disponible,
        restaurante_id=product.restaurante_id
    )
