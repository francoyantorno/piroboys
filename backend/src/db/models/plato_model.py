from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric
from sqlalchemy.sql import func
from src.db.connection import Base

class Plato(Base):
    __tablename__ = "Plato"

    id = Column(Integer, primary_key=True)
    restaurante_id = Column(Integer, nullable=False)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String, nullable=False)
    precio = Column(Numeric(10, 2), nullable=False)
    disponible = Column(Boolean, default=True)
    restaurante_id = Column(Integer, nullable=False)