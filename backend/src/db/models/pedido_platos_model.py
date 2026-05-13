from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.db.connection import Base

class Pedido_platos(Base):
    __tablename__ = "pedidos_platos"

    plato_id = Column(Integer, primary_key=True, autoincrement=True)
    pedido_id = Column(Integer, nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)