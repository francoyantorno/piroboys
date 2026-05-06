from sqlalchemy.orm import Session

from src.db.models.product_model import Product


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, price: float, stock: int) -> Product:
        product = Product(name=name, price=price, stock=stock)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def find_by_id(self, product_id: int) -> Product | None:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def list_all(self) -> list[Product]:
        return self.db.query(Product).all()

    def update(self, product_id: int, **fields) -> Product | None:
        # TODO: actualizar los campos pasados en **fields y devolver el Product actualizado
        ...

    def delete(self, product_id: int) -> bool:
        # TODO: borrar el Product con ese id; devolver True si lo borró, False si no existía
        ...
