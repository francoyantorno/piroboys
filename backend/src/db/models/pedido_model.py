from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.db.connection import Base

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, nullable=False)
    restaurante_id = Column(Integer, nullable=False)
    repartidor_id = Column(Integer, nullable=True)
    fecha = Column(DateTime, default=func.now())
    estado = Column(String, nullable=False)
    total = Column(Integer, nullable=False)
    direccion_entrega = Column(String, nullable=False)
