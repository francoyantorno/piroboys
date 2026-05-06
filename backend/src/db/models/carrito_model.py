from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from src.db.connection import Base

class Carrito(Base):
    __tablename__ = "Carrito"

    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, unique=True, nullable=False)
    restaurante_id = Column(Integer)
    fecha_actualizacion = Column(DateTime, default=func.now())