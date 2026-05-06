from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func

from src.db.connection import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False)
    creado_en = Column(DateTime, server_default=func.now())
