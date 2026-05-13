from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from src.db.connection import Base

class Pedido(Base):
    __tablename__ = "Pedido"

    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, nullable=False)
    restaurante_id = Column(Integer, nullable=False)
    repartidor_id = Column(Integer, nullable=True)
    cupon_id = Column(Integer, nullable=True)
    fecha = Column(DateTime, default=func.now())
    estado = Column(String(20), nullable=False, default="pendiente")
    subtotal = Column(Float, nullable=False, default=0.0)
    monto_descuento = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False, default=0.0)
    direccion_entrega = Column(String, nullable=False)
    codigo_postal_entrega = Column(String(10), nullable=False)